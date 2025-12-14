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
import './PaginaGastos.css'; // ¡Importamos el nuevo CSS!
// ¡Importamos la NUEVA función de ticket!
import { generarTextoTicketGasto } from '../utils/generarTickets';
import { imprimirTicketEnNavegador } from '../utils/imprimirTicket';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
const isTauriEnvironment = () => typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

const formatConsecutivo = (num, prefix) => {
  return `${prefix}${String(num).padStart(5, '0')}`;
};

// Función de Descarga
const descargarTxt = (contenido, nombreArchivo) => {
  const element = document.createElement("a");
  const file = new Blob([contenido], {type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = `${nombreArchivo}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

function PaginaGastos() {
  // ¡Traemos 'restarDeLaBase' y 'setBase'!
  const { userProfile, base, restarDeLaBase, setBase } = useCaja();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estados del formulario ---
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  
  // --- Estado Post-Guardado ---
  const [gastoReciente, setGastoReciente] = useState(null); 

  
  // --- Guardar Gasto (¡Lógica Transaccional!) ---
  const handleSaveGasto = async () => {
    const montoNum = Number(monto);
    if (!descripcion || montoNum <= 0) {
      alert("Debe ingresar una descripción y un monto válido.");
      return;
    }
    if (montoNum > base) {
      alert("¡Error! El monto del gasto no puede superar la base en caja.");
      return;
    }
    setIsSubmitting(true);

    let gastoDataParaTicket = null;
    let nuevoConsecutivoStr = "";

    try {
      // Usaremos dos transacciones separadas para seguridad
      // 1. Restar de la base (Transacción del Context)
      await restarDeLaBase(montoNum);
      
      // 2. Guardar Gasto y Consecutivo (Transacción 2)
      const nuevoGastoRef = doc(collection(db, "gastos"));
      await runTransaction(db, async (transaction) => {
        const consecRef = doc(db, "configuracion", "consecutivos");
        const consecDoc = await transaction.get(consecRef);
        if (!consecDoc.exists()) throw new Error("Consecutivos no encontrados");
        
        const ultimoNum = consecDoc.data().gastos; // <-- 'gastos'
        const nuevoNum = ultimoNum + 1;
        nuevoConsecutivoStr = formatConsecutivo(nuevoNum, "GAS"); // <-- 'GAS'

        const gastoData = {
          consecutivo: nuevoConsecutivoStr,
          descripcion: descripcion,
          monto: montoNum,
          fecha: Timestamp.now(),
          usuario: userProfile?.nombre || 'SISTEMA'
        };
        gastoDataParaTicket = gastoData;
        
        transaction.set(nuevoGastoRef, gastoData);
        transaction.update(consecRef, { gastos: nuevoNum }); // <-- 'gastos'
      });

      // --- 4. TRANSACCIÓN EXITOSA ---
      setGastoReciente(gastoDataParaTicket);
      setDescripcion('');
      setMonto('');

    } catch (error) {
      console.error("Error al guardar el gasto: ", error);
      alert(`Error al guardar: ${error.message}`);
      // Si la segunda transacción falla, debemos "revertir" la primera
      // (Devolver el dinero a la base)
      // Esta es una lógica de compensación simple.
      // ¡Pero 'restarDeLaBase' ya valida! Si falla, no resta.
      // Si la transacción 2 falla, la base SÍ se restó.
      // ¡ERROR EN MI LÓGICA ANTERIOR!
      // Debemos hacer TODO en UNA transacción.
    }
    setIsSubmitting(false);
  };
  
  // --- ¡handleSaveGasto CORREGIDO CON 1 SOLA TRANSACCIÓN! ---
  const handleSaveGastoCorregido = async () => {
    const montoNum = Number(monto);
    if (!descripcion || montoNum <= 0) {
      alert("Debe ingresar una descripción y un monto válido.");
      return;
    }
    if (montoNum > base) {
      alert("¡Error! El monto del gasto no puede superar la base en caja.");
      return;
    }
    setIsSubmitting(true);

    let gastoDataParaTicket = null;
    let nuevaBaseParaEstado = 0;

    try {
      const nuevoGastoRef = doc(collection(db, "gastos"));

      await runTransaction(db, async (transaction) => {
        // --- 1. LEER TODO ---
        const consecRef = doc(db, "configuracion", "consecutivos");
        const cajaRef = doc(db, "configuracion", "caja");
        const [consecDoc, cajaDoc] = await Promise.all([
          transaction.get(consecRef),
          transaction.get(cajaRef)
        ]);
        if (!consecDoc.exists()) throw new Error("Consecutivos no encontrados");
        if (!cajaDoc.exists()) throw new Error("Caja no encontrada");

        // --- 2. CALCULAR ---
        const ultimoNum = consecDoc.data().gastos;
        const nuevoNum = ultimoNum + 1;
        const nuevoConsecutivoStr = formatConsecutivo(nuevoNum, "GAS");
        
        const baseActual = cajaDoc.data().baseActual;
        const nuevaBase = baseActual - montoNum; // ¡RESTAMOS DE LA BASE!
        if (nuevaBase < 0) throw new Error("Fondos insuficientes en caja.");
        nuevaBaseParaEstado = nuevaBase; // Guardamos para React
        
        const gastoData = {
          consecutivo: nuevoConsecutivoStr,
          descripcion: descripcion,
          monto: montoNum,
          fecha: Timestamp.now(),
          usuario: userProfile?.nombre || 'SISTEMA'
        };
        gastoDataParaTicket = gastoData;

        // --- 3. ESCRIBIR TODO ---
        transaction.set(nuevoGastoRef, gastoData);
        transaction.update(consecRef, { gastos: nuevoNum });
        transaction.update(cajaRef, { baseActual: nuevaBase }); // ¡Restamos aquí!
      });

      // --- 4. TRANSACCIÓN EXITOSA ---
      setBase(nuevaBaseParaEstado); // Actualizamos el estado local
      setGastoReciente(gastoDataParaTicket);
      setDescripcion('');
      setMonto('');

    } catch (error) {
      console.error("Error al guardar el gasto: ", error);
      alert(`Error al guardar: ${error.message}`);
    }
    setIsSubmitting(false);
  };


  // --- Lógica de Impresión/Descarga (¡ACTUALIZADA!) ---

  const printGastoEnNavegador = (gastoData) => {
    const textoTicket = generarTextoTicketGasto(gastoData, userProfile);
    const exito = imprimirTicketEnNavegador({
      titulo: `Comprobante ${gastoData.consecutivo}`,
      textoTicket,
    });

    if (!exito) {
      alert('No se pudo preparar la impresión del comprobante en el navegador. Verifica la configuración de impresión e inténtalo nuevamente.');
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
      localStorage.setItem('ticketType', 'gasto'); // <-- Tipo 'gasto'

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
        
        {/* --- FORMULARIO --- */}
        <div className="formulario-gasto">
          <h2>Datos del Gasto</h2>
          <div className="form-grupo">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea 
              id="descripcion" 
              rows="4"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={gastoReciente}
            ></textarea>
          </div>
          <div className="form-grupo">
            <label htmlFor="monto">Monto ($):</label>
            <input 
              id="monto" 
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              disabled={gastoReciente}
            />
          </div>
        </div>

        {/* --- VISTA PREVIA Y BOTONES --- */}
        <div className="vista-previa-gasto">
          <div>
            <h2>Resumen de Salida</h2>
            <div className="resumen-gasto">
              <div>Descripción: {gastoReciente ? gastoReciente.descripcion : descripcion}</div>
              <div className="monto">
                - ${(gastoReciente ? gastoReciente.monto : Number(monto)).toLocaleString('es-CO')}
              </div>
            </div>
          </div>

          <div className="botones-accion">
            {gastoReciente ? (
              // --- VISTA POST-GUARDADO ---
              <>
                <p className="gasto-exitoso">¡Gasto {gastoReciente.consecutivo} guardado!</p>
                <button type="button" onClick={handleImprimir} className="btn-imprimir-ticket">
                  Imprimir Comprobante (SALIDA)
                </button>
                <button type="button" onClick={handleRegistrarNuevoGasto} className="btn-nuevo-gasto">
                  Registrar Nuevo Gasto (y Descargar TXT)
                </button>
              </>
            ) : (
              // --- VISTA ANTES DE GUARDAR ---
              <button 
                type="button" 
                onClick={handleSaveGastoCorregido} // ¡Usamos la función corregida!
                className="btn-guardar-gasto"
                disabled={isSubmitting || !descripcion || !monto}
              >
                {isSubmitting ? "Guardando..." : "Guardar Gasto"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaGastos;