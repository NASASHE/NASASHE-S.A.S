// src/pages/PaginaVentas.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc,
  Timestamp,
  increment
} from 'firebase/firestore';
import { useCaja } from '../context/CajaContext';
import './PaginaVentas.css'; // Â¡CSS de Ventas!
// Â¡Importamos la NUEVA funciÃ³n de ticket!
import { generarTextoTicketVenta } from '../utils/generarTickets';
import { imprimirTicketEnNavegador } from '../utils/imprimirTicket';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
const isTauriEnvironment = () => typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

// FunciÃ³n de Descarga
const descargarTxt = (contenido, nombreArchivo) => {
  const element = document.createElement("a");
  const file = new Blob([contenido], {type: 'text/plain;charset=utf-8'});
  element.href = URL.createObjectURL(file);
  element.download = `${nombreArchivo}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

function PaginaVentas() {
  const { userProfile, base, obtenerConsecutivoParaModulo } = useCaja(); // Traemos la base (solo para verla)
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);

  // --- Estados del formulario ---
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState('');
  const [articuloSeleccionadoId, setArticuloSeleccionadoId] = useState('');
  const [cantidad, setCantidad] = useState('');

  // --- Estados de la Venta ---
  const [itemsVenta, setItemsVenta] = useState([]);
  const [totalVenta, setTotalVenta] = useState(0);

  // --- Estado Post-Guardado ---
  const [ventaReciente, setVentaReciente] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const generarIdLocal = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

  // --- Cargar Proveedores y ArtÃ­culos ---
  const fetchDatosMaestros = async () => {
    setLoading(true);
    try {
      const proveedoresSnap = await getDocs(collection(db, "proveedores"));
      const proveedoresLista = proveedoresSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProveedores(proveedoresLista);

      const articulosSnap = await getDocs(collection(db, "articulos"));
      const articulosLista = articulosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticulos(articulosLista);
    } catch (error) {
      console.error("Error al cargar datos: ", error);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchDatosMaestros();
  }, []);

  // --- Calcular Total ---
  useEffect(() => {
    let nuevoTotal = 0;
    itemsVenta.forEach(item => {
      nuevoTotal += item.subtotal;
    });
    setTotalVenta(nuevoTotal);
  }, [itemsVenta]);

  
  // --- AÃ±adir Item (con validaciÃ³n de stock) ---
  const handleAddItem = () => {
    if (!articuloSeleccionadoId || !cantidad || Number(cantidad) <= 0) {
      alert("Seleccione un artÃ­culo y una cantidad (peso) vÃ¡lida.");
      return;
    }
    const articulo = articulos.find(a => a.id === articuloSeleccionadoId);
    if (!articulo) {
      alert("Error: ArtÃ­culo no encontrado.");
      return;
    }
    const cantNum = Number(cantidad);
    const stockActual = articulo.stock || 0;
    
    const itemExistente = itemsVenta.find(item => item.articuloId === articulo.id);
    const cantidadEnLista = itemExistente ? itemExistente.cantidad : 0;

    // Â¡ValidaciÃ³n de Stock!
    if ((cantNum + cantidadEnLista) > stockActual) {
      alert(`Â¡No hay stock suficiente! Stock actual: ${stockActual}, Quieres vender: ${cantNum + cantidadEnLista}`);
      return;
    }
    
    const subtotal = cantNum * articulo.precioVenta; // Â¡Usamos precioVenta!
    
    if (itemExistente) {
      setItemsVenta(prevState => 
        prevState.map(item => 
          item.articuloId === articulo.id
            ? { ...item, cantidad: item.cantidad + cantNum, subtotal: item.subtotal + subtotal }
            : item
        )
      );
    } else {
      setItemsVenta(prevState => [
        ...prevState,
        {
          localId: generarIdLocal(),
          articuloId: articulo.id,
          nombre: articulo.nombre,
          cantidad: cantNum,
          precioVenta: articulo.precioVenta, // Â¡precioVenta!
          subtotal: subtotal
        }
      ]);
    }
    setArticuloSeleccionadoId('');
    setCantidad('');
  };

  const handleAnularItem = (localId) => {
    if (window.confirm('Â¿Desea eliminar este item de la prefactura?')) {
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
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precioVenta }
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
          ? { ...item, precioVenta: nuevoPrecio, subtotal: nuevoPrecio * item.cantidad }
          : item
      )
    );
  };

  // --- Guardar Venta (Â¡LÃ³gica Transaccional!) ---
  const handleSaveVenta = async () => {
    if (itemsVenta.length === 0) {
      alert("No hay artÃ­culos en la venta.");
      return;
    }
    if (!proveedorSeleccionadoId) {
      alert("Debe seleccionar un Proveedor (Cliente de Venta).");
      return;
    }
    setIsSubmitting(true);

    let ventaDataParaTicket = null;

    try {
      const nuevaVentaRef = doc(collection(db, "ventas"));
      const proveedorObj = proveedores.find(p => p.id === proveedorSeleccionadoId);

      const { consecutivo: nuevoConsecutivoStr, bloqueRef } =
        await obtenerConsecutivoParaModulo('ventas');
        
      const ventaData = {
        consecutivo: nuevoConsecutivoStr,
        proveedor: { // Guardamos los datos del cliente
          id: proveedorObj.id,
          nombre: proveedorObj.nombre,
          nit: proveedorObj.nit
        },
        items: itemsVenta,
        total: totalVenta,
        fecha: Timestamp.now(),
        usuario: userProfile?.nombre || 'SISTEMA'
      };
      ventaDataParaTicket = ventaData;

      // Validacion local de stock antes de escribir en cola offline.
      itemsVenta.forEach((item) => {
        const articuloCompleto = articulos.find((a) => a.id === item.articuloId);
        if (!articuloCompleto) {
          throw new Error(`Articulo ${item.nombre} no encontrado en cache.`);
        }
        const stockActual = Number(articuloCompleto.stock) || 0;
        if (item.cantidad > stockActual) {
          throw new Error(`Stock insuficiente para ${item.nombre}`);
        }
      });

      const batch = writeBatch(db);
      batch.set(nuevaVentaRef, ventaData);
      batch.update(bloqueRef, {
        siguiente: increment(1),
        actualizadoEn: Timestamp.now(),
      });

      itemsVenta.forEach((item) => {
        const articuloRef = doc(db, "articulos", item.articuloId);
        batch.update(articuloRef, { stock: increment(-item.cantidad) });
      });

      // Firestore lo deja en cola automaticamente si no hay internet.
      await batch.commit();

      // --- 4. TRANSACCIÃ“N EXITOSA ---
      await fetchDatosMaestros(); // Refresca el stock en los dropdowns

      setVentaReciente(ventaDataParaTicket); 
      setProveedorSeleccionadoId('');
      // Â¡No limpiamos itemsVenta aÃºn!

    } catch (error) {
      console.error("Error al guardar la venta: ", error);
      alert(`Error al guardar: ${error.message}`);
    }
    setIsSubmitting(false);
  };

  // --- LÃ³gica de ImpresiÃ³n/Descarga (Â¡ACTUALIZADA!) ---

  const printVentaEnNavegador = (ventaData) => {
    const textoTicket = generarTextoTicketVenta(ventaData, userProfile);
    const exito = imprimirTicketEnNavegador({
      titulo: `Ticket ${ventaData.consecutivo}`,
      textoTicket,
    });

    if (!exito) {
      alert('No se pudo preparar la impresiÃ³n del ticket en el navegador. Verifica la configuraciÃ³n de impresiÃ³n e intÃ©ntalo nuevamente.');
    }
  };

  const handleImprimir = async () => {
    if (!ventaReciente) return;

    if (!isTauriEnvironment()) {
      printVentaEnNavegador(ventaReciente);
    } else {
      localStorage.setItem('ticketData', JSON.stringify(ventaReciente));
      localStorage.setItem('ticketUser', JSON.stringify(userProfile));
      localStorage.setItem('ticketType', 'venta'); // <-- Tipo 'venta'

      const label = `ticket-venta-${ventaReciente.consecutivo.replace(/\s/g, '-')}`;
      const webview = new WebviewWindow(label, {
        url: '/imprimir',
        title: `Ticket ${ventaReciente.consecutivo}`,
        width: 310,
        height: 600,
      });

      webview.once('tauri://error', (e) => {
        console.error('Error al crear ventana de impresiÃ³n:', e);
        printVentaEnNavegador(ventaReciente);
      });
    }
  };

  const handleDescargarTicket = () => {
    if (!ventaReciente) return;
    if (isTauriEnvironment()) return;

    const textoTicket = generarTextoTicketVenta(ventaReciente, userProfile);
    descargarTxt(textoTicket, ventaReciente.consecutivo);
  };

  const handleRegistrarNuevaVenta = () => {
    setItemsVenta([]);
    setTotalVenta(0);
    setProveedorSeleccionadoId('');
    setVentaReciente(null);
  };
    

  if (loading) {
    return <p>Cargando datos maestros...</p>;
  }


  return (
    <div className="pagina-ventas">
      <h1>Registrar Nueva Venta (a Proveedor)</h1>
      <div style={{textAlign: 'center', fontSize: '18px', marginBottom: '10px'}}>
        Base actual: <strong>${base.toLocaleString('es-CO')}</strong>
      </div>
      
      <div className="layout-ventas">
        
        {/* --- FORMULARIO --- */}
        <div className="formulario-venta">
          <h2>Datos de la Venta</h2>
          <div className="form-grupo">
            <label htmlFor="proveedor">Cliente (Proveedor al que Vendes):</label>
            <select 
              id="proveedor" 
              value={proveedorSeleccionadoId}
              onChange={(e) => setProveedorSeleccionadoId(e.target.value)}
              disabled={ventaReciente}
            >
              <option value="">-- Seleccione un Cliente --</option>
              {proveedores.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} ({p.nit})</option>
              ))}
            </select>
          </div>
          <hr />
          <h3>AÃ±adir ArtÃ­culos</h3>
          <div className="form-grupo">
            <label htmlFor="articulo">ArtÃ­culo:</label>
            <select 
              id="articulo" 
              value={articuloSeleccionadoId}
              onChange={(e) => setArticuloSeleccionadoId(e.target.value)}
              disabled={ventaReciente}
            >
              <option value="">-- Seleccione un ArtÃ­culo --</option>
              {articulos.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nombre} (${a.precioVenta}/kg) - Stock: {(Number(a.stock) || 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-grupo">
            <label htmlFor="cantidad">Cantidad (Peso):</label>
            <input 
              id="cantidad" 
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={ventaReciente}
            />
          </div>
          <button 
            type="button" 
            onClick={handleAddItem} 
            className="btn-anadir-item-venta" // BotÃ³n verde
            disabled={ventaReciente}
          >
            AÃ±adir Item a la Venta
          </button>
        </div>

        {/* --- PRE-FACTURA --- */}
        <div className="pre-factura">
          <h2>Items de la Venta</h2>
          <table className="pre-factura-tabla">
            <thead>
              <tr>
                <th>ArtÃ­culo</th>
                <th>Cant.</th>
                <th>Precio Venta</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(ventaReciente ? ventaReciente.items : itemsVenta).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center'}}>AÃ±ade artÃ­culos...</td>
                </tr>
              ) : (
                (ventaReciente ? ventaReciente.items : itemsVenta).map((item, index) => (
                  <tr key={item.localId || index}>
                    <td>{item.nombre}</td>
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
                          value={item.precioVenta}
                          onChange={(e) => handleActualizarPrecio(e, item.localId)}
                          style={{width: '80px', padding: '3px'}}
                        />
                      ) : (
                        `$${item.precioVenta}`
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

          <div className="total-venta">
            Total: ${(ventaReciente ? ventaReciente.total : totalVenta).toLocaleString('es-CO')}
          </div>

          <div className="botones-accion">
            {ventaReciente ? (
              // --- VISTA POST-GUARDADO ---
              <>
                <p className="venta-exitosa">Â¡Venta {ventaReciente.consecutivo} guardada!</p>
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
                className="btn-guardar-venta"
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


export default PaginaVentas;
