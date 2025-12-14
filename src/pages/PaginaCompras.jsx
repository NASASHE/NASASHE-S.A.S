// src/pages/PaginaCompras.jsx

import React, { useState, useEffect } from 'react';
// 👇 Asegúrate de importar 'onSnapshot' y 'collection'
import { onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc,
  Timestamp,
  getDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { useCaja } from '../context/CajaContext';
import './PaginaCompras.css';
import { generarTextoTicketCompra } from '../utils/generarTickets';
import { imprimirTicketEnNavegador } from '../utils/imprimirTicket';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

// ¡AÑADE ESTA LÍNEA! (Con la variable correcta de v2)
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


function PaginaCompras() {
  const { userProfile, base, setBase, consecutivos } = useCaja(); // NUEVO
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [articulos, setArticulos] = useState([]);

  const [nombreReciclador, setNombreReciclador] = useState('');
  const [articuloSeleccionadoId, setArticuloSeleccionadoId] = useState('');
  const [nombreArticuloManual, setNombreArticuloManual] = useState('');
  const [precioArticuloManual, setPrecioArticuloManual] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [imagenPreviewUrl, setImagenPreviewUrl] = useState('');

  const [itemsCompra, setItemsCompra] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);
  
  const [compraReciente, setCompraReciente] = useState(null); 
  
  // 1. ESTADO PARA LA EDICIÓN INLINE
  const [editingItemId, setEditingItemId] = useState(null);

// 👇 ESTE ES EL NUEVO CÓDIGO QUE REEMPLAZA A fetchArticulos Y al useEffect
  useEffect(() => {

    // 👇 ¡AÑADE ESTO!
    setLoading(true);

    // (Asumimos que tienes un estado 'setLoading', si no, puedes quitar esta línea)
    // setLoading(true); 

    const articulosRef = collection(db, "articulos");

    // onSnapshot crea el listener y "calienta" el caché
    const unsubscribe = onSnapshot(articulosRef, 
      (querySnapshot) => {
        const articulosLista = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));

        setArticulos(articulosLista); // (Tu estado para la lista de artículos)
        // setLoading(false);

        // 👇 ¡AÑADE ESTO!
        setLoading(false);

        console.log("¡Artículos cargados y cacheados con onSnapshot!");

      }, 
      (error) => {
        // Manejar el error
        console.error("Error al cargar artículos con onSnapshot: ", error);
        // setLoading(false);

        // 👇 ¡AÑADE ESTO TAMBIÉN!
        setLoading(false);
        
      }
    );

    // Esto se ejecuta cuando el componente se desmonta
    // y limpia el listener para que no se acumulen
    return () => {
      console.log("Limpiando listener de Artículos.");
      unsubscribe();
    };
  }, []); // El array vacío [] asegura que se ejecute solo una vez al montar
  // 👆 FIN DEL CÓDIGO NUEVO

  useEffect(() => {
    let nuevoTotal = 0;
    itemsCompra.forEach(item => {
      nuevoTotal += item.subtotal;
    });
    setTotalCompra(nuevoTotal);
  }, [itemsCompra]);


  const handleArticuloChange = (e) => {
    const id = e.target.value;
    setArticuloSeleccionadoId(id);
    if (id !== 'otros') {
      setNombreArticuloManual('');
      setPrecioArticuloManual('');
    }
    if (id === 'otros') {
      setImagenPreviewUrl('/icons/OTRO.jpg');
      return;
    }
    if (id) {
      const articulo = articulos.find(a => a.id === id);
      if (articulo && articulo.imagenUrl) {
        setImagenPreviewUrl(articulo.imagenUrl);
      } else {
        setImagenPreviewUrl('');
      }
    } else {
      setImagenPreviewUrl('');
    }
  };

    const handleAddItem = () => {
    if (!articuloSeleccionadoId || !cantidad || Number(cantidad) <= 0) {
      alert("Seleccione un artículo y una cantidad (peso) válida.");
      return;
    }

    const esArticuloManual = articuloSeleccionadoId === 'otros';

    if (esArticuloManual) {
      const nombreManualLimpio = nombreArticuloManual.trim().toUpperCase();
      const precioManual = Number(precioArticuloManual);
      const cantNum = Number(cantidad);

      if (!nombreManualLimpio || !precioManual || precioManual <= 0) {
        alert("Ingrese un nombre y un precio de compra válido para el material.");
        return;
      }

      const subtotal = cantNum * precioManual;
      setItemsCompra(prevState => ([
        ...prevState,
        {
          localId: Date.now(),
          articuloId: null,
          nombre: nombreManualLimpio,
          cantidad: cantNum,
          precioCompra: precioManual,
          subtotal,
          esManual: true
        }
      ]));

      setArticuloSeleccionadoId('');
      setNombreArticuloManual('');
      setPrecioArticuloManual('');
      setCantidad('');
      setImagenPreviewUrl('');
      return;
    }

    const articulo = articulos.find(a => a.id === articuloSeleccionadoId);
    if (!articulo) {
      alert("Error: Artículo no encontrado.");
      return;
    }
    const cantNum = Number(cantidad);
    const subtotal = cantNum * articulo.precioCompra;
    const itemExistente = itemsCompra.find(item => item.articuloId === articulo.id);
    if (itemExistente) {
      setItemsCompra(prevState => 
        prevState.map(item => 
          item.articuloId === articulo.id
            ? { ...item, cantidad: item.cantidad + cantNum, subtotal: item.subtotal + subtotal }
            : item
        )
      );
    } else {
      setItemsCompra(prevState => [
        ...prevState,
        {
          localId: Date.now(), 
          articuloId: articulo.id,
          nombre: articulo.nombre,
          cantidad: cantNum,
          precioCompra: articulo.precioCompra,
          subtotal: subtotal
        }
      ]);
    }
    setArticuloSeleccionadoId('');
    setCantidad('');
    setImagenPreviewUrl('');
  };

  // 2. ¡FUNCIÓN ANULAR ITEM!
  const handleAnularItem = (localId) => {
    if (window.confirm("¿Desea eliminar este item de la prefactura?")) {
      setItemsCompra(itemsCompra.filter(item => item.localId !== localId));
    }
  };

  // 3. ¡FUNCIÓN EDITAR ITEM! (Cambia al modo edición)
  const handleEditarItem = (localId) => {
    setEditingItemId(prev => (prev === localId ? null : localId));
  };

  // 4. ¡FUNCIÓN ACTUALIZAR CANTIDAD! (Se dispara al cambiar el input)
  const handleActualizarCantidad = (e, localId) => {
    const nuevaCantidad = Number(e.target.value);
    if (nuevaCantidad <= 0) return;

    setItemsCompra(prevState =>
      prevState.map(item => {
        if (item.localId === localId) {
          const nuevoSubtotal = nuevaCantidad * item.precioCompra;
          return { ...item, cantidad: nuevaCantidad, subtotal: nuevoSubtotal };
        }
        return item;
      })
    );
  };

  const handleActualizarPrecio = (e, localId) => {
    const nuevoPrecio = Number(e.target.value);
    if (nuevoPrecio <= 0) return;

    setItemsCompra(prevState =>
      prevState.map(item => {
        if (item.localId === localId) {
          const nuevoSubtotal = item.cantidad * nuevoPrecio;
          return { ...item, precioCompra: nuevoPrecio, subtotal: nuevoSubtotal };
        }
        return item;
      })
    );
  };


  // 5. ¡LÓGICA DE GUARDADO 100% OFFLINE!
  const handleSaveCompra = async () => {
    if (itemsCompra.length === 0) {
      alert("No hay artículos en la compra.");
      return;
    }
    setIsSubmitting(true);

    let compraDataParaTicket = null;
    // Ya no necesitamos 'nuevaBaseParaEstado'

    try {
      // --- 1. LEER DATOS (¡Desde el ESTADO/CONTEXTO!) ---
      // ¡¡Ya no usamos getDoc()!!
      const ultimoNum = consecutivos; // <-- CAMBIO (Viene de useCaja)
      const baseActual = base;         // <-- CAMBIO (Viene de useCaja)

      // --- 2. CALCULAR ---
      const nuevoNum = ultimoNum + 1;
      const nuevoConsecutivoStr = formatConsecutivo(nuevoNum, "FAC");
      
      const nuevaBase = baseActual - totalCompra;
      
      if (totalCompra > baseActual) {
        throw new Error(`¡Error! Fondos insuficientes. Base: $${baseActual.toLocaleString('es-CO')}`);
      }

      const recicladorNombre = nombreReciclador.trim().toUpperCase();

      const compraData = {
        consecutivo: nuevoConsecutivoStr,
        reciclador: recicladorNombre || 'N/A',
        items: itemsCompra,
        total: totalCompra,
        fecha: Timestamp.now(),
        usuario: userProfile?.nombre || 'SISTEMA'
      };
      compraDataParaTicket = compraData;

      // --- 3. PREPARAR EL LOTE DE ESCRITURA ---
      // (Definimos las referencias aquí solo para escribir)
      const batch = writeBatch(db);
      const nuevaCompraRef = doc(collection(db, "compras"));
      const consecRef = doc(db, "configuracion", "consecutivos");
      const cajaRef = doc(db, "configuracion", "caja");

      batch.set(nuevaCompraRef, compraData);
      batch.update(consecRef, { compras: nuevoNum });
      batch.update(cajaRef, { baseActual: nuevaBase });

      // (Tu 'forEach' para los artículos ya estaba PERFECTO)
      itemsCompra.forEach(itemEnCarrito => {
        if (itemEnCarrito.esManual) return;

        const articuloCompleto = articulos.find(a => a.id === itemEnCarrito.articuloId);
        if (!articuloCompleto) {
          throw new Error(`Artículo ${itemEnCarrito.nombre} no encontrado en caché.`);
        }
        const stockActual = articuloCompleto.stock || 0;
        const nuevoStock = stockActual + itemEnCarrito.cantidad;
        const articuloRef = doc(db, "articulos", itemEnCarrito.articuloId);
        batch.update(articuloRef, { stock: nuevoStock });
      });

      // --- 4. EJECUTAR LOTE (se guardará en cola si está offline) ---
      await batch.commit(); // ¡Esto ahora sí funcionará siempre!

      // --- 5. ACTUALIZAR ESTADO (Localmente) ---
      
      // ¡¡YA NO NECESITAMOS setBase()!!
      // El 'onSnapshot' de CajaContext lo hará automáticamente.
      // setBase(nuevaBaseParaEstado); // <-- LÍNEA BORRADA

      setCompraReciente(compraDataParaTicket); 
      setNombreReciclador('');
      setItemsCompra([]); // ¡Limpia el carrito!

    } catch (error) {
      console.error("Error al guardar la compra: ", error);
      alert(`Error al guardar: ${error.message}`);
    }
    setIsSubmitting(false); // ¡Esto quita el "Guardando..."!
  };


  const printCompraEnNavegador = (compraData) => {
    const textoTicket = generarTextoTicketCompra(compraData, userProfile);
    const exito = imprimirTicketEnNavegador({
      titulo: `Ticket ${compraData.consecutivo}`,
      textoTicket,
    });

    if (!exito) {
      alert('No se pudo preparar la impresión del ticket en el navegador. Verifica la configuración de impresión e inténtalo nuevamente.');
    }
  };

  const handleImprimir = async () => {
    if (!compraReciente) return;

    if (!isTauriEnvironment()) {
      // --- Lógica de Navegador (la que tenías) ---
      printCompraEnNavegador(compraReciente);
    } else {
      // --- Lógica de Tauri (la nueva) ---
      localStorage.setItem('ticketData', JSON.stringify(compraReciente));
      localStorage.setItem('ticketUser', JSON.stringify(userProfile));
      localStorage.setItem('ticketType', 'compra');
      
      const label = `ticket-compra-${compraReciente.consecutivo.replace(/\s/g, '-')}`;
      const webview = new WebviewWindow(label, {
        url: '/imprimir',
        title: `Ticket ${compraReciente.consecutivo}`,
        width: 310,
        height: 600,
      });

      webview.once('tauri://error', (e) => {
        console.error('Error al crear ventana de impresión:', e);
        // Fallback al método de navegador si Tauri falla
        printCompraEnNavegador(compraReciente);
      });
    }
  };

  const handleDescargarTicket = () => {
    if (!compraReciente) return;

    const textoTicket = generarTextoTicketCompra(compraReciente, userProfile);
    descargarTxt(textoTicket, compraReciente.consecutivo);
  };

  // Función para limpiar el formulario
  const handleRegistrarNueva = () => {
    setItemsCompra([]);
    setTotalCompra(0);
    setNombreReciclador('');
    setCompraReciente(null);
    setArticuloSeleccionadoId('');
    setNombreArticuloManual('');
    setPrecioArticuloManual('');
    setCantidad('');
    setImagenPreviewUrl('');
  };
  

  if (loading) {
    return <p>Cargando Artículos...</p>;
  }


  return (
    <div className="pagina-compras">
      <h1>Registrar Nueva Compra (a Reciclador)</h1>
      <div style={{textAlign: 'center', fontSize: '18px', marginBottom: '10px'}}>
        Base actual: <strong>${base.toLocaleString('es-CO')}</strong>
      </div>
      
      <div className="layout-compras">
        
        <div className="formulario-compra">
          <h2>Datos de la Compra</h2>
          <div className="form-grupo">
            <label htmlFor="reciclador">Nombre Reciclador (Opcional):</label>
            <input 
              id="reciclador" type="text"
              value={nombreReciclador}
              onChange={(e) => setNombreReciclador(e.target.value.toUpperCase())}
              disabled={compraReciente} 
            />
          </div>
          <hr />
          <h3>Añadir Artículos</h3>
          <div className="form-grupo">
            <label htmlFor="articulo">Artículo:</label>
            <select
              id="articulo"
              value={articuloSeleccionadoId}
              onChange={handleArticuloChange}
              disabled={compraReciente}
            >
              <option value="">-- Seleccione un Artículo --</option>
              <option value="otros">Otros (ingreso manual)</option>
              {articulos.map(a => (
                <option key={a.id} value={a.id}>
                  {a.nombre} (${a.precioCompra}/kg) - Stock: {(Number(a.stock) || 0).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {articuloSeleccionadoId === 'otros' && (
            <>
              <div className="form-grupo">
                <label htmlFor="nombreManual">Nombre del material:</label>
            <input
              id="nombreManual"
              type="text"
              value={nombreArticuloManual}
              onChange={(e) => setNombreArticuloManual(e.target.value.toUpperCase())}
              disabled={compraReciente}
            />
              </div>
              <div className="form-grupo">
                <label htmlFor="precioManual">Precio compra:</label>
                <input
                  id="precioManual"
                  type="number"
                  value={precioArticuloManual}
                  onChange={(e) => setPrecioArticuloManual(e.target.value)}
                  disabled={compraReciente}
                />
              </div>
            </>
          )}

          <div className="imagen-preview-container">
            {imagenPreviewUrl ? (
              <img src={imagenPreviewUrl} alt="Vista previa del material" />
            ) : (
              <span style={{color: '#888'}}>Imagen del material</span>
            )}
          </div>
          
          <div className="form-grupo">
            <label htmlFor="cantidad">Cantidad (Peso):</label>
            <input 
              id="cantidad" type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={compraReciente} 
            />
          </div>
          <button 
            type="button" onClick={handleAddItem} className="btn-anadir-item" 
            disabled={compraReciente} 
          >
            Añadir Item a la Compra
          </button>
        </div>

        <div className="pre-factura">
          <h2>Items de la Compra</h2>
          <table className="pre-factura-tabla">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(compraReciente ? compraReciente.items : itemsCompra).length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center'}}>Añade artículos...</td>
                </tr>
              ) : (
                (compraReciente ? compraReciente.items : itemsCompra).map((item, index) => (
                  <tr key={index}>
                    <td>{item.nombre}</td>
                    {/* Celda de Cantidad con lógica de edición */}
                    <td>
                      {editingItemId === item.localId ? (
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => handleActualizarCantidad(e, item.localId)}
                          autoFocus
                          style={{width: '70px', padding: '3px'}}
                        />
                      ) : (
                        (Number(item.cantidad) || 0).toFixed(2)
                      )}
                    </td>
                    <td>
                      {editingItemId === item.localId ? (
                        <input
                          type="number"
                          value={item.precioCompra}
                          onChange={(e) => handleActualizarPrecio(e, item.localId)}
                          style={{width: '80px', padding: '3px'}}
                        />
                      ) : (
                        `$${item.precioCompra}`
                      )}
                    </td>
                    <td>${item.subtotal.toLocaleString('es-CO')}</td>
                    {/* Botones de acción */}
                    <td className="prefactura-acciones">
                      <button
                        className="btn-pre-editar"
                        onClick={() => handleEditarItem(item.localId)}
                        disabled={compraReciente}
                      >
                        {editingItemId === item.localId ? 'Listo' : 'Editar'}
                      </button>
                      <button 
                        className="btn-pre-borrar" 
                        onClick={() => handleAnularItem(item.localId)}
                        disabled={compraReciente}
                      >
                        Anular
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="total-compra">
            Total: ${(compraReciente ? compraReciente.total : totalCompra).toLocaleString('es-CO')}
          </div>
          <div className="botones-accion">
            {compraReciente ? (
              <>
                <p className="compra-exitosa">¡Compra {compraReciente.consecutivo} guardada!</p>
                <button type="button" onClick={handleImprimir} className="btn-imprimir-ticket">
                  Imprimir Ticket
                </button>
                <button type="button" onClick={handleDescargarTicket} className="btn-descargar-ticket">
                  Descargar Ticket
                </button>
                <button type="button" onClick={handleRegistrarNueva} className="btn-nueva-compra">
                  Registrar Nueva Compra
                </button>
              </>
            ) : (
              <button 
                type="button" onClick={handleSaveCompra} className="btn-guardar-compra"
                disabled={isSubmitting || itemsCompra.length === 0}
              >
                {isSubmitting ? "Guardando..." : "Guardar Compra"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default PaginaCompras;


