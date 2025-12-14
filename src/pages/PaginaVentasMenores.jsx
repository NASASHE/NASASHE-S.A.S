// src/pages/PaginaVentasMenores.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  Timestamp, 
  runTransaction 
} from 'firebase/firestore';
import { useCaja } from '../context/CajaContext';
import './PaginaVentasMenores.css';
import { generarTextoTicketVentaMenor } from '../utils/generarTickets';
import { imprimirTicketEnNavegador } from '../utils/imprimirTicket';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
const isTauriEnvironment = () => typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

const formatConsecutivo = (num, prefix) => {
  return `${prefix}${String(num).padStart(5, '0')}`;
};

const descargarTxt = (contenido, nombreArchivo) => {
  const element = document.createElement("a");
  const file = new Blob([contenido], {type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = `${nombreArchivo}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

function PaginaVentasMenores() {

  // 1. ¡EL ARREGLO! Traemos 'setBase' en lugar de 'sumarALaBase'␊
  const { userProfile, base, setBase } = useCaja();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- (Estados del formulario y de la venta, sin cambios) ---
  const [nombreCliente, setNombreCliente] = useState('');
  const [itemDescripcion, setItemDescripcion] = useState('');
  const [itemCantidad, setItemCantidad] = useState('');
  const [itemPrecio, setItemPrecio] = useState('');
  const [itemsVenta, setItemsVenta] = useState([]);
  const [totalVenta, setTotalVenta] = useState(0);
  const [ventaReciente, setVentaReciente] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const generarIdLocal = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

  useEffect(() => {
    const nuevoTotal = itemsVenta.reduce((acc, item) => acc + item.subtotal, 0);
    setTotalVenta(nuevoTotal);
  }, [itemsVenta]);
  
  const handleAddItem = () => {
    const cantNum = Number(itemCantidad);
    const precioNum = Number(itemPrecio);

    if (!itemDescripcion || cantNum <= 0 || precioNum <= 0) {
      alert("Complete Material, Cantidad y Precio.");
      return;
    }
    const subtotal = cantNum * precioNum;

    setItemsVenta(prevState => [
      ...prevState,
      {
        id: new Date().getTime(),
        localId: generarIdLocal(),
        descripcion: itemDescripcion.toUpperCase(),
        cantidad: cantNum,
        precio: precioNum,
        subtotal: subtotal
      }
    ]);
    setItemDescripcion('');
    setItemCantidad('');
    setItemPrecio('');
  };

  const handleAnularItem = (localId) => {
    if (window.confirm('¿Desea eliminar este item de la prefactura?')) {
      setItemsVenta(prev => prev.filter(item => item.localId !== localId));
      setEditingItemId(prev => (prev === localId ? null : prev));
    }
  };

  const handleEditarItem = (localId) => {
    setEditingItemId(prev => (prev === localId ? null : localId));
  };

  const handleActualizarCantidad = (e, localId) => {
    const nuevaCantidad = Number(e.target.value);
    if (nuevaCantidad <= 0) return;

    setItemsVenta(prevState =>
      prevState.map(item =>
        item.localId === localId
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precio }
          : item
      )
    );
  };

  const handleActualizarPrecio = (e, localId) => {
    const nuevoPrecio = Number(e.target.value);
    if (nuevoPrecio <= 0) return;

    setItemsVenta(prevState =>
      prevState.map(item =>
        item.localId === localId
          ? { ...item, precio: nuevoPrecio, subtotal: nuevoPrecio * item.cantidad }
          : item
      )
    );
  };

  // 2. ¡LÓGICA DE GUARDADO CORREGIDA!
  const handleSaveVenta = async () => {
    if (itemsVenta.length === 0) {
      alert("No hay artículos en la venta.");
      return;
    }
    setIsSubmitting(true);

    let ventaDataParaTicket = null;
    let nuevoConsecutivoStr = "";
    let nuevaBaseParaEstado = 0; // Para actualizar el estado local

    try {
      const nuevaVentaRef = doc(collection(db, "ventasMenores"));

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
        const ultimoNum = consecDoc.data().ventasMenores;
        const nuevoNum = ultimoNum + 1;
        nuevoConsecutivoStr = formatConsecutivo(nuevoNum, "FAVMI");
        
        const baseActual = cajaDoc.data().baseActual;
        const nuevaBase = baseActual + totalVenta; // ¡SUMAMOS A LA BASE!
        nuevaBaseParaEstado = nuevaBase; // Guardamos para React
        
        const clienteNombre = nombreCliente.trim().toUpperCase();

        const ventaData = {
          consecutivo: nuevoConsecutivoStr,
          cliente: clienteNombre || 'N/A',
          items: itemsVenta,
          total: totalVenta,
          fecha: Timestamp.now(),
          usuario: userProfile?.nombre || 'SISTEMA'
        };
        ventaDataParaTicket = ventaData;

        // --- 3. ESCRIBIR TODO ---
        transaction.set(nuevaVentaRef, ventaData);
        transaction.update(consecRef, { ventasMenores: nuevoNum });
        transaction.update(cajaRef, { baseActual: nuevaBase }); // ¡SOLO SE SUMA AQUÍ!
      });

      // --- 4. TRANSACCIÓN EXITOSA ---
      
      // 3. ¡EL ARREGLO!
      //    Ya no llamamos a 'sumarALaBase'.
      //    Actualizamos el estado local de React con 'setBase'.
      setBase(nuevaBaseParaEstado);

      setVentaReciente(ventaDataParaTicket);
      setNombreCliente('');

    } catch (error) {
      console.error("Error al guardar la venta: ", error);
      alert(`Error al guardar: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  // --- Lógica de Impresión/Descarga (¡ACTUALIZADA!) ---

  const printVentaMenorEnNavegador = (ventaData) => {
    const textoTicket = generarTextoTicketVentaMenor(ventaData, userProfile);
    const exito = imprimirTicketEnNavegador({
      titulo: `Ticket ${ventaData.consecutivo}`,
      textoTicket,
    });

    if (!exito) {
      alert('No se pudo preparar la impresión del ticket en el navegador. Verifica la configuración de impresión e inténtalo nuevamente.');
    }
  };

  const handleImprimir = async () => {
    if (!ventaReciente) return;

    if (!isTauriEnvironment()) {
      printVentaMenorEnNavegador(ventaReciente);
    } else {
      localStorage.setItem('ticketData', JSON.stringify(ventaReciente));
      localStorage.setItem('ticketUser', JSON.stringify(userProfile));
      localStorage.setItem('ticketType', 'ventaMenor'); // <-- Tipo 'ventaMenor'

      const label = `ticket-venta-menor-${ventaReciente.consecutivo.replace(/\s/g, '-')}`;
      const webview = new WebviewWindow(label, {
        url: '/imprimir',
        title: `Ticket ${ventaReciente.consecutivo}`,
        width: 310,
        height: 600,
      });

      webview.once('tauri://error', (e) => {
        console.error('Error al crear ventana de impresión:', e);
        printVentaMenorEnNavegador(ventaReciente);
      });
    }
  };

  const handleDescargarTicket = () => {
    if (!ventaReciente) return;
    if (isTauriEnvironment()) return;

    const textoTicket = generarTextoTicketVentaMenor(ventaReciente, userProfile);
    descargarTxt(textoTicket, ventaReciente.consecutivo);
  };

  const handleRegistrarNuevaVenta = () => {
    setItemsVenta([]);
    setTotalVenta(0);
    setNombreCliente('');
    setVentaReciente(null);
  };
  
  // --- RENDERIZADO (Sin cambios) ---
  return (
    <div className="pagina-ventas-menores">
      <h1>Registro de Venta Menor (a Particular)</h1>
      <div style={{textAlign: 'center', fontSize: '18px', marginBottom: '10px'}}>
        Base actual: <strong>${base.toLocaleString('es-CO')}</strong>
      </div>
      
      <div className="layout-ventas-menores">
        
        {/* --- FORMULARIO --- */}
        <div className="formulario-venta-menor">
          <h2>Datos de la Venta</h2>
          <div className="form-grupo">
            <label htmlFor="cliente">Nombre Cliente (Opcional):</label>
            <input 
              id="cliente" 
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value.toUpperCase())}
              disabled={ventaReciente}
            />
          </div>
          <hr />
          <h3>Material</h3>
          <div className="form-grupo">
            <label htmlFor="itemDescripcion">Descripción:</label>
            <input 
              id="itemDescripcion" 
              type="text"
              value={itemDescripcion}
              onChange={(e) => setItemDescripcion(e.target.value.toUpperCase())}
              disabled={ventaReciente}
            />
          </div>
          <div className="form-manual-item">
            <div className="form-grupo">
              <label htmlFor="itemCantidad">Cantidad:</label>
              <input 
                id="itemCantidad" 
                type="number"
                value={itemCantidad}
                onChange={(e) => setItemCantidad(e.target.value)}
                disabled={ventaReciente}
              />
            </div>
            <div className="form-grupo">
              <label htmlFor="itemPrecio">Precio x (Und o Kg):</label>
              <input 
                id="itemPrecio" 
                type="number"
                value={itemPrecio}
                onChange={(e) => setItemPrecio(e.target.value)}
                disabled={ventaReciente}
              />
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleAddItem} 
            className="btn-anadir-item-menor"
            disabled={ventaReciente}
          >
            + Añadir Item
          </button>
        </div>

        {/* --- PRE-FACTURA --- */}
        <div className="pre-factura">
          <h2>Items de la Venta</h2>
          <table className="pre-factura-tabla">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(ventaReciente ? ventaReciente.items : itemsVenta).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center'}}>Añade artículos manuales...</td>
                </tr>
              ) : (
                (ventaReciente ? ventaReciente.items : itemsVenta).map((item) => (
                  <tr key={item.localId || item.id}>
                    <td>{item.descripcion}</td>
                    <td>
                      {editingItemId === item.localId ? (
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => handleActualizarCantidad(e, item.localId)}
                          style={{width: '70px', padding: '3px'}}
                          autoFocus
                        />
                      ) : (
                        item.cantidad
                      )}
                    </td>
                    <td>
                      {editingItemId === item.localId ? (
                        <input
                          type="number"
                          value={item.precio}
                          onChange={(e) => handleActualizarPrecio(e, item.localId)}
                          style={{width: '80px', padding: '3px'}}
                        />
                      ) : (
                        `$${item.precio}`
                      )}
                    </td>
                    <td>${item.subtotal.toLocaleString('es-CO')}</td>
                    <td className="prefactura-acciones">
                      <button
                        className="btn-pre-editar"
                        onClick={() => handleEditarItem(item.localId)}
                        disabled={ventaReciente}
                      >
                        {editingItemId === item.localId ? 'Listo' : 'Editar'}
                      </button>
                      <button
                        className="btn-pre-borrar"
                        onClick={() => handleAnularItem(item.localId)}
                        disabled={ventaReciente}
                      >
                        Anular
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="total-venta-menor">
            Total: ${(ventaReciente ? ventaReciente.total : totalVenta).toLocaleString('es-CO')}
          </div>

          <div className="botones-accion">
            {ventaReciente ? (
              // --- VISTA POST-GUARDADO ---
              <>
                <p className="venta-exitosa">¡Venta {ventaReciente.consecutivo} guardada!</p>
                <button type="button" onClick={handleImprimir} className="btn-imprimir-ticket">
                  Imprimir Ticket
                </button>
                <button type="button" onClick={handleDescargarTicket} className="btn-descargar-ticket">
                  Descargar Ticket
                </button>
                <button type="button" onClick={handleRegistrarNuevaVenta} className="btn-nueva-venta">
                  Registrar Nueva Venta
                </button>
              </>
            ) : (
              // --- VISTA ANTES DE GUARDAR ---
              <button 
                type="button" 
                onClick={handleSaveVenta} 
                className="btn-guardar-venta-menor"
                disabled={isSubmitting || itemsVenta.length === 0}
              >
                {isSubmitting ? "Guardando..." : "Guardar Venta"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default PaginaVentasMenores;
