// src/pages/PaginaGastos.jsx

import React, { useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  doc,
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { useCaja } from '../context/CajaContext';
import './PaginaGastos.css';
import { generarTextoTicketGasto } from '../utils/generarTickets';
import { imprimirTicketEnNavegador } from '../utils/imprimirTicket';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

const isTauriEnvironment = () => typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

const formatConsecutivo = (num, prefix) => {
  return `${prefix}${String(num).padStart(5, '0')}`;
};

const descargarTxt = (contenido, nombreArchivo) => {
  const element = document.createElement('a');
  const file = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `${nombreArchivo}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

function PaginaGastos() {
  const { userProfile, base } = useCaja();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  const [gastoReciente, setGastoReciente] = useState(null);

  const handleSaveGasto = async () => {
    const montoNum = Number(monto);
    const descripcionLimpia = descripcion.trim();

    if (!descripcionLimpia || montoNum <= 0) {
      alert('Debe ingresar una descripción y un monto válido.');
      return;
    }

    if (montoNum > base) {
      alert('Error: el monto del gasto no puede superar la base en caja.');
      return;
    }

    setIsSubmitting(true);

    try {
      const nuevoGastoRef = doc(collection(db, 'gastos'));
      let gastoDataParaTicket = null;

      await runTransaction(db, async (transaction) => {
        const consecRef = doc(db, 'configuracion', 'consecutivos');
        const consecDoc = await transaction.get(consecRef);

        if (!consecDoc.exists()) {
          throw new Error('Consecutivos no encontrados.');
        }

        const ultimoNum = consecDoc.data().gastos ?? 0;
        const nuevoNum = ultimoNum + 1;
        const nuevoConsecutivoStr = formatConsecutivo(nuevoNum, 'GAS');

        const gastoData = {
          consecutivo: nuevoConsecutivoStr,
          descripcion: descripcionLimpia,
          monto: montoNum,
          fecha: Timestamp.now(),
          usuario: userProfile?.nombre || 'SISTEMA'
        };
        gastoDataParaTicket = gastoData;

        const movimientoCajaRef = doc(collection(db, 'movimientos_caja'));

        transaction.set(nuevoGastoRef, gastoData);
        transaction.update(consecRef, { gastos: nuevoNum });
        transaction.set(movimientoCajaRef, {
          tipo: 'egreso',
          monto: montoNum,
          descripcion: `Gasto ${nuevoConsecutivoStr} - ${descripcionLimpia}`,
          fecha: Timestamp.now(),
          usuario: userProfile?.nombre || 'SISTEMA',
          anulado: false,
          referencia: {
            coleccion: 'gastos',
            id: nuevoGastoRef.id,
            consecutivo: nuevoConsecutivoStr
          }
        });
      });

      setGastoReciente(gastoDataParaTicket);
      setDescripcion('');
      setMonto('');
    } catch (error) {
      console.error('Error al guardar el gasto: ', error);
      alert(`Error al guardar: ${error.message}`);
    }

    setIsSubmitting(false);
  };

  const printGastoEnNavegador = (gastoData) => {
    const textoTicket = generarTextoTicketGasto(gastoData, userProfile);
    const exito = imprimirTicketEnNavegador({
      titulo: `Comprobante ${gastoData.consecutivo}`,
      textoTicket,
    });

    if (!exito) {
      alert('No se pudo preparar la impresión del comprobante en el navegador.');
    }
  };

  const handleImprimir = async () => {
    if (!gastoReciente) return;

    if (!isTauriEnvironment()) {
      printGastoEnNavegador(gastoReciente);
      handleDescargarYLlimpiar();
    } else {
      localStorage.setItem('ticketData', JSON.stringify(gastoReciente));
      localStorage.setItem('ticketUser', JSON.stringify(userProfile));
      localStorage.setItem('ticketType', 'gasto');

      const label = `ticket-gasto-${gastoReciente.consecutivo.replace(/\s/g, '-')}`;
      const webview = new WebviewWindow(label, {
        url: '/imprimir',
        title: `Comprobante ${gastoReciente.consecutivo}`,
        width: 310,
        height: 600,
      });

      webview.once('tauri://created', () => {
        handleRegistrarNuevoGasto();
      });
      webview.once('tauri://error', (e) => {
        console.error('Error al crear ventana de impresión:', e);
        printGastoEnNavegador(gastoReciente);
        handleDescargarYLlimpiar();
      });
    }
  };

  const handleRegistrarNuevoGasto = () => {
    if (!gastoReciente) return;
    handleDescargarYLlimpiar();
  };

  const handleDescargarYLlimpiar = () => {
    if (gastoReciente && !isTauriEnvironment()) {
      const textoTicket = generarTextoTicketGasto(gastoReciente, userProfile);
      descargarTxt(textoTicket, gastoReciente.consecutivo);
    }

    setDescripcion('');
    setMonto('');
    setGastoReciente(null);
  };

  return (
    <div className="pagina-gastos">
      <h1>Registro de Gasto (Salida de Caja)</h1>
      <div>
        Base actual: <strong>${base.toLocaleString('es-CO')}</strong>
      </div>

      <div className="layout-gastos">
        <div className="formulario-gasto">
          <h2>Datos del Gasto</h2>
          <div className="form-grupo">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={Boolean(gastoReciente)}
            ></textarea>
          </div>
          <div className="form-grupo">
            <label htmlFor="monto">Monto ($):</label>
            <input
              id="monto"
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              disabled={Boolean(gastoReciente)}
            />
          </div>
        </div>

        <div className="vista-previa-gasto">
          <div>
            <h2>Resumen de Salida</h2>
            <div className="resumen-gasto">
              <div>Descripción: {gastoReciente ? gastoReciente.descripcion : descripcion}</div>
              <div className="monto">
                - ${(gastoReciente ? gastoReciente.monto : Number(monto || 0)).toLocaleString('es-CO')}
              </div>
            </div>
          </div>

          <div className="botones-accion">
            {gastoReciente ? (
              <>
                <p className="gasto-exitoso">Gasto {gastoReciente.consecutivo} guardado.</p>
                <button type="button" onClick={handleImprimir} className="btn-imprimir-ticket">
                  Imprimir Comprobante (SALIDA)
                </button>
                <button type="button" onClick={handleRegistrarNuevoGasto} className="btn-nuevo-gasto">
                  Registrar Nuevo Gasto (y Descargar TXT)
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSaveGasto}
                className="btn-guardar-gasto"
                disabled={isSubmitting || !descripcion || !monto}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaGastos;
