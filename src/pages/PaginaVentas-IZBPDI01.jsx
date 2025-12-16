// src/pages/PaginaVentas.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  Timestamp,
  runTransaction,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { useCaja } from '../context/CajaContext';
import './PaginaVentas.css';

import { generarTextoTicketVenta } from '../utils/generarTickets';
import { imprimirTicketEnNavegador } from '../utils/imprimirTicket';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

const isTauriEnvironment = () => typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

const formatConsecutivo = (num, prefix) => `${prefix}${String(num).padStart(5, '0')}`;

const descargarTxt = (contenido, nombreArchivo) => {
  const element = document.createElement('a');
  const file = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `${nombreArchivo}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

function PaginaVentas() {
  const { userProfile, base } = useCaja();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);

  // --- Remisiones pendientes ---
  const [remisionesPendientes, setRemisionesPendientes] = useState([]);
  const [remisionSeleccionadaId, setRemisionSeleccionadaId] = useState('');
  const [modoRemision, setModoRemision] = useState('exacta'); // 'exacta' | 'editar'

  // --- Formulario manual ---
  const [proveedorSeleccionadoId, setProveedorSeleccionadoId] = useState('');
  const [articuloSeleccionadoId, setArticuloSeleccionadoId] = useState('');
  const [cantidad, setCantidad] = useState('');

  // --- Venta ---
  const [itemsVenta, setItemsVenta] = useState([]);
  const [totalVenta, setTotalVenta] = useState(0);

  // --- Post-Guardado ---
  const [ventaReciente, setVentaReciente] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const generarIdLocal = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

  const articulosById = useMemo(() => {
    const map = new Map();
    articulos.forEach((a) => map.set(a.id, a));
    return map;
  }, [articulos]);

  const fetchDatosMaestros = async () => {
    setLoading(true);
    try {
      const [proveedoresSnap, articulosSnap, remisionesSnap] = await Promise.all([
        getDocs(collection(db, 'proveedores')),
        getDocs(collection(db, 'articulos')),
        getDocs(
          query(
            collection(db, 'remisiones'),
            where('estado', '==', 'PENDIENTE'),
            orderBy('fecha', 'desc')
          )
        )
      ]);

      setProveedores(proveedoresSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setArticulos(articulosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const remisionesLista = remisionesSnap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
          fecha: d.data()?.fecha?.toDate ? d.data().fecha.toDate() : null
        }))
        .filter((r) => r.stockDescontado !== true);

      setRemisionesPendientes(remisionesLista);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert(error?.message || 'Error cargando datos (posible índice requerido en Firestore).');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatosMaestros();
  }, []);

  useEffect(() => {
    let nuevoTotal = 0;
    itemsVenta.forEach((item) => { nuevoTotal += (Number(item.subtotal) || 0); });
    setTotalVenta(nuevoTotal);
  }, [itemsVenta]);

  const handleSeleccionarRemision = (e) => {
    const id = e.target.value;
    setRemisionSeleccionadaId(id);
    setVentaReciente(null);
    setEditingItemId(null);

    if (!id) {
      setItemsVenta([]);
      setProveedorSeleccionadoId('');
      return;
    }

    const rem = remisionesPendientes.find((r) => r.id === id);
    if (!rem) return;

    setProveedorSeleccionadoId(rem?.destino?.id || '');

    const deseaEditar = window.confirm(
      `¿Quieres EDITAR cantidades/precios antes de guardar la venta?\n\n` +
      `OK = Sí, editar\nCancelar = No, usar EXACTAMENTE la remisión`
    );
    setModoRemision(deseaEditar ? 'editar' : 'exacta');

    const items = Array.isArray(rem.items) ? rem.items : [];
    const itemsConvertidos = items.map((it) => {
      const articulo = articulosById.get(it.articuloId);
      const precioVenta = Number(articulo?.precioVenta ?? 0);

      const cant = Number(it.cantidad) || 0;
      return {
        localId: generarIdLocal(),
        articuloId: it.articuloId,
        nombre: it.nombre,
        cantidad: cant,
        precioVenta,
        subtotal: cant * precioVenta
      };
    });

    setItemsVenta(itemsConvertidos);
  };

  const handleAddItem = () => {
    if (remisionSeleccionadaId) {
      alert('Tienes una remisión seleccionada. Si deseas vender manual, quita la remisión primero.');
      return;
    }

    if (!articuloSeleccionadoId || !cantidad || Number(cantidad) <= 0) {
      alert('Seleccione un artículo y una cantidad (peso) válida.');
      return;
    }

    const articulo = articulos.find((a) => a.id === articuloSeleccionadoId);
    if (!articulo) {
      alert('Error: Artículo no encontrado.');
      return;
    }

    const cantNum = Number(cantidad);
    const stockActual = Number(articulo.stock || 0);

    const itemExistente = itemsVenta.find((item) => item.articuloId === articulo.id);
    const cantidadEnLista = itemExistente ? Number(itemExistente.cantidad || 0) : 0;

    if ((cantNum + cantidadEnLista) > stockActual) {
      alert(`¡No hay stock suficiente! Stock actual: ${stockActual}, Quieres vender: ${cantNum + cantidadEnLista}`);
      return;
    }

    const precioVenta = Number(articulo.precioVenta || 0);
    const subtotal = cantNum * precioVenta;

    if (itemExistente) {
      setItemsVenta((prev) =>
        prev.map((item) =>
          item.articuloId === articulo.id
            ? { ...item, cantidad: item.cantidad + cantNum, subtotal: item.subtotal + subtotal }
            : item
        )
      );
    } else {
      setItemsVenta((prev) => ([
        ...prev,
        {
          localId: generarIdLocal(),
          articuloId: articulo.id,
          nombre: articulo.nombre,
          cantidad: cantNum,
          precioVenta,
          subtotal
        }
      ]));
    }

    setArticuloSeleccionadoId('');
    setCantidad('');
  };

  const handleAnularItem = (localId) => {
    if (window.confirm('¿Desea eliminar este item de la prefactura?')) {
      setItemsVenta((prev) => prev.filter((item) => item.localId !== localId));
      setEditingItemId((prev) => (prev === localId ? null : prev));
    }
  };

  const handleEditarItem = (localId) => {
    if (remisionSeleccionadaId && modoRemision === 'exacta') return;
    setEditingItemId((prev) => (prev === localId ? null : localId));
  };

  const handleActualizarCantidad = (e, localId) => {
    const nuevaCantidad = Number(e.target.value);
    if (nuevaCantidad <= 0) return;

    setItemsVenta((prev) =>
      prev.map((item) =>
        item.localId === localId
          ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * (Number(item.precioVenta) || 0) }
          : item
      )
    );
  };

  const handleActualizarPrecio = (e, localId) => {
    const nuevoPrecio = Number(e.target.value);
    if (nuevoPrecio <= 0) return;

    setItemsVenta((prev) =>
      prev.map((item) =>
        item.localId === localId
          ? { ...item, precioVenta: nuevoPrecio, subtotal: nuevoPrecio * (Number(item.cantidad) || 0) }
          : item
      )
    );
  };

  const handleSaveVenta = async () => {
    if (itemsVenta.length === 0) {
      alert('No hay artículos en la venta.');
      return;
    }
    if (!proveedorSeleccionadoId) {
      alert('Debe seleccionar un Proveedor (Cliente de Venta).');
      return;
    }

    setIsSubmitting(true);

    let ventaDataParaTicket = null;

    try {
      const proveedorObj = proveedores.find((p) => p.id === proveedorSeleccionadoId);
      if (!proveedorObj) throw new Error('Proveedor no encontrado.');

      await runTransaction(db, async (transaction) => {
        const consecRef = doc(db, 'configuracion', 'consecutivos');
        const consecDoc = await transaction.get(consecRef);
        if (!consecDoc.exists()) throw new Error('Consecutivos no encontrados');

        const ultimoNum = Number(consecDoc.data().ventas || 0);
        const nuevoNum = ultimoNum + 1;
        const nuevoConsecutivoStr = formatConsecutivo(nuevoNum, 'FAV');

        let remisionMeta = null;
        if (remisionSeleccionadaId) {
          const remRef = doc(db, 'remisiones', remisionSeleccionadaId);
          const remSnap = await transaction.get(remRef);
          if (!remSnap.exists()) throw new Error('La remisión seleccionada no existe.');
          const rem = remSnap.data();
          if (rem.estado !== 'PENDIENTE') throw new Error('Esta remisión ya no está PENDIENTE.');
          if (rem.stockDescontado === true) throw new Error('Esta remisión ya tiene stock descontado.');

          remisionMeta = { id: remisionSeleccionadaId, consecutivo: rem.consecutivo || '' };
        }

        const articulosRefs = itemsVenta.map((item) => doc(db, 'articulos', item.articuloId));
        const articulosDocs = await Promise.all(articulosRefs.map((ref) => transaction.get(ref)));

        articulosDocs.forEach((artDoc, index) => {
          if (!artDoc.exists()) throw new Error(`Artículo ${itemsVenta[index].nombre} no encontrado`);
          const stockActual = Number(artDoc.data().stock || 0);
          const cantidadVenta = Number(itemsVenta[index].cantidad || 0);
          const nuevoStock = stockActual - cantidadVenta;

          if (nuevoStock < 0) {
            throw new Error(`Stock insuficiente para ${itemsVenta[index].nombre}. Stock: ${stockActual}, venta: ${cantidadVenta}`);
          }

          transaction.update(artDoc.ref, { stock: nuevoStock });
        });

        const nuevaVentaRef = doc(collection(db, 'ventas'));

        const ventaData = {
          consecutivo: nuevoConsecutivoStr,
          proveedor: { id: proveedorObj.id, nombre: proveedorObj.nombre, nit: proveedorObj.nit },
          items: itemsVenta.map((i) => ({
            articuloId: i.articuloId,
            nombre: i.nombre,
            cantidad: Number(i.cantidad || 0),
            precioVenta: Number(i.precioVenta || 0),
            subtotal: Number(i.subtotal || 0)
          })),
          total: Number(totalVenta || 0),
          fecha: Timestamp.now(),
          usuario: userProfile?.nombre || 'SISTEMA',
          remision: remisionMeta || null
        };

        transaction.set(nuevaVentaRef, ventaData);
        transaction.update(consecRef, { ventas: nuevoNum });

        if (remisionSeleccionadaId) {
          const remRef = doc(db, 'remisiones', remisionSeleccionadaId);
          transaction.update(remRef, {
            estado: 'FACTURADA',
            stockDescontado: true,
            ventaId: nuevaVentaRef.id,
            fechaFacturacion: Timestamp.now(),
            facturadoPor: userProfile?.nombre || 'SISTEMA'
          });
        }

        ventaDataParaTicket = ventaData;
      });

      await fetchDatosMaestros();

      setVentaReciente(ventaDataParaTicket);
    } catch (error) {
      console.error('Error al guardar la venta: ', error);
      alert(`Error al guardar: ${error.message}`);
    }

    setIsSubmitting(false);
  };

  const printVentaEnNavegador = (ventaData) => {
    const textoTicket = generarTextoTicketVenta(ventaData, userProfile);
    const exito = imprimirTicketEnNavegador({
      titulo: `Ticket ${ventaData.consecutivo}`,
      textoTicket
    });

    if (!exito) {
      alert('No se pudo preparar la impresión del ticket en el navegador.');
    }
  };

  const handleImprimir = async () => {
    if (!ventaReciente) return;

    if (!isTauriEnvironment()) {
      printVentaEnNavegador(ventaReciente);
      return;
    }

    localStorage.setItem('ticketData', JSON.stringify(ventaReciente));
    localStorage.setItem('ticketUser', JSON.stringify(userProfile));
    localStorage.setItem('ticketType', 'venta');

    const label = `ticket-venta-${ventaReciente.consecutivo.replace(/\s/g, '-')}`;
    const webview = new WebviewWindow(label, {
      url: '/imprimir',
      title: `Ticket ${ventaReciente.consecutivo}`,
      width: 310,
      height: 600
    });

    webview.once('tauri://error', (e) => {
      console.error('Error al crear ventana de impresión:', e);
      printVentaEnNavegador(ventaReciente);
    });
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
    setEditingItemId(null);

    setRemisionSeleccionadaId('');
    setModoRemision('exacta');

    setArticuloSeleccionadoId('');
    setCantidad('');
  };

  const limpiarRemision = () => {
    if (ventaReciente) return;
    setRemisionSeleccionadaId('');
    setModoRemision('exacta');
    setItemsVenta([]);
    setProveedorSeleccionadoId('');
  };

  const disabledPorVentaReciente = Boolean(ventaReciente);

  if (loading) return <p>Cargando datos maestros...</p>;

  return (
    <div className="pagina-ventas">
      <h1>Registrar Nueva Venta (a Proveedor)</h1>

      <div style={{ textAlign: 'center', fontSize: '18px', marginBottom: '10px' }}>
        Base actual: <strong>${base.toLocaleString('es-CO')}</strong>
      </div>

      {/* --- BLOQUE REMISIONES --- */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 14px auto' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 600 }}>
            Extraer de remisión pendiente:
            <select
              value={remisionSeleccionadaId}
              onChange={handleSeleccionarRemision}
              disabled={disabledPorVentaReciente}
              style={{ marginLeft: 8, minWidth: 280 }}
            >
              <option value="">-- (Opcional) Seleccione una remisión --</option>
              {remisionesPendientes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.consecutivo} - {r.destino?.nombre || 'SIN DESTINO'} ({r.fecha ? r.fecha.toLocaleString('es-CO') : 'sin fecha'})
                </option>
              ))}
            </select>
          </label>

          {remisionSeleccionadaId && (
            <>
              <span style={{ fontSize: 13 }}>
                Modo:
                <strong style={{ marginLeft: 6 }}>
                  {modoRemision === 'exacta' ? 'EXACTA (sin editar)' : 'EDITAR (cantidades/precios)'}
                </strong>
              </span>

              <button
                type="button"
                onClick={() => setModoRemision((prev) => (prev === 'exacta' ? 'editar' : 'exacta'))}
                disabled={disabledPorVentaReciente}
                style={{ padding: '6px 10px' }}
              >
                Cambiar modo
              </button>

              <button
                type="button"
                onClick={limpiarRemision}
                disabled={disabledPorVentaReciente}
                style={{ padding: '6px 10px' }}
              >
                Quitar remisión
              </button>
            </>
          )}
        </div>

        {remisionSeleccionadaId && modoRemision === 'exacta' && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
            En modo <strong>EXACTA</strong> no puedes editar items. Si el proveedor recibió diferente peso, cambia a <strong>EDITAR</strong>.
          </div>
        )}
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
              disabled={disabledPorVentaReciente || Boolean(remisionSeleccionadaId)}
            >
              <option value="">-- Seleccione un Cliente --</option>
              {proveedores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.nit})
                </option>
              ))}
            </select>
          </div>

          <hr />

          <h3>Añadir Artículos</h3>

          <div style={{ fontSize: 13, color: remisionSeleccionadaId ? '#a33' : '#555', marginBottom: 10 }}>
            {remisionSeleccionadaId
              ? 'Con remisión seleccionada: los items vienen de la remisión. Para agregar manual, quita la remisión.'
              : 'Venta manual: selecciona artículo y cantidad.'}
          </div>

          <div className="form-grupo">
            <label htmlFor="articulo">Artículo:</label>
            <select
              id="articulo"
              value={articuloSeleccionadoId}
              onChange={(e) => setArticuloSeleccionadoId(e.target.value)}
              disabled={disabledPorVentaReciente || Boolean(remisionSeleccionadaId)}
            >
              <option value="">-- Seleccione un Artículo --</option>
              {articulos.map((a) => (
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
              disabled={disabledPorVentaReciente || Boolean(remisionSeleccionadaId)}
            />
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="btn-anadir-item-venta"
            disabled={disabledPorVentaReciente || Boolean(remisionSeleccionadaId)}
          >
            Añadir Item a la Venta
          </button>
        </div>

        {/* --- PRE-FACTURA --- */}
        <div className="pre-factura">
          <h2>Items de la Venta</h2>

          <table className="pre-factura-tabla">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cant.</th>
                <th>Precio Venta</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {(ventaReciente ? ventaReciente.items : itemsVenta).length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Añade artículos...</td>
                </tr>
              ) : (
                (ventaReciente ? ventaReciente.items : itemsVenta).map((item, index) => {
                  const key = item.localId || `${item.articuloId}-${index}`;
                  const editable = !ventaReciente && (!remisionSeleccionadaId || modoRemision === 'editar');

                  return (
                    <tr key={key}>
                      <td>{item.nombre}</td>

                      <td>
                        {editable && editingItemId === item.localId ? (
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => handleActualizarCantidad(e, item.localId)}
                            style={{ width: '70px', padding: '3px' }}
                            autoFocus
                          />
                        ) : (
                          Number(item.cantidad || 0).toFixed(2)
                        )}
                      </td>

                      <td>
                        {editable && editingItemId === item.localId ? (
                          <input
                            type="number"
                            value={item.precioVenta}
                            onChange={(e) => handleActualizarPrecio(e, item.localId)}
                            style={{ width: '90px', padding: '3px' }}
                          />
                        ) : (
                          `$${Number(item.precioVenta || 0).toLocaleString('es-CO')}`
                        )}
                      </td>

                      <td>${Number(item.subtotal || 0).toLocaleString('es-CO')}</td>

                      <td className="prefactura-acciones">
                        <button
                          className="btn-pre-editar"
                          onClick={() => handleEditarItem(item.localId)}
                          disabled={!editable}
                          title={!editable ? 'En modo exacta no se edita' : ''}
                        >
                          {editingItemId === item.localId ? 'Listo' : 'Editar'}
                        </button>

                        <button
                          className="btn-pre-borrar"
                          onClick={() => handleAnularItem(item.localId)}
                          disabled={Boolean(ventaReciente) || (Boolean(remisionSeleccionadaId) && modoRemision === 'exacta')}
                          title={(remisionSeleccionadaId && modoRemision === 'exacta') ? 'Cambia a modo editar para quitar items' : ''}
                        >
                          Anular
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="total-venta">
            Total: ${(ventaReciente ? ventaReciente.total : totalVenta).toLocaleString('es-CO')}
          </div>

          <div className="botones-accion">
            {ventaReciente ? (
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
              <button
                type="button"
                onClick={handleSaveVenta}
                className="btn-guardar-venta"
                disabled={isSubmitting || itemsVenta.length === 0}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Venta'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaVentas;
