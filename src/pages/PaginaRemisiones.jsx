// src/pages/PaginaRemisiones.jsx

import React, { useEffect, useMemo, useState } from 'react';
import './PaginaRemisiones.css';

import {
  collection,
  doc,
  getDocs,
  runTransaction,
  Timestamp,
  updateDoc
} from 'firebase/firestore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db, storage } from '../firebase';
import { useCaja } from '../context/CajaContext';
import { generarPdfRemision } from '../utils/remisionPdf';

const BASE = import.meta.env.BASE_URL;

const formatConsecutivo = (numero) => `REM-${String(numero).padStart(6, '0')}`;

const toNumber = (valor) => {
  const num = Number(valor);
  return Number.isNaN(num) ? 0 : num;
};

const generarId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

function PaginaRemisiones() {
  const { userProfile, consecutivosData } = useCaja();
  const esAdmin = userProfile?.rol === 'admin';

  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);

  const [destinoId, setDestinoId] = useState('');
  const [destinoInfo, setDestinoInfo] = useState({ nombre: '', nit: '', direccion: '', telefono: '' });

  const [datosConductor, setDatosConductor] = useState({
    nombre: '',
    cedula: '',
    direccion: '',
    vinculo: 'CONTRATISTA DE FLETE',
    placa: '',
    celular: ''
  });

  const [itemSeleccionado, setItemSeleccionado] = useState({
    articuloId: '',
    cantidad: '',
    modoCantidad: 'manual'
  });

  const [items, setItems] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Para imprimir/descargar el último PDF generado (en memoria)
  const [ultimoPdf, setUltimoPdf] = useState(null);
  const [ultimoConsecutivo, setUltimoConsecutivo] = useState('');
  const [ultimoPdfUrl, setUltimoPdfUrl] = useState(''); // ✅ NUEVO: URL guardada en Storage

  const siguienteNumeroRemision = useMemo(
    () => (consecutivosData?.remisiones ?? 0) + 1,
    [consecutivosData]
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [proveedoresSnap, articulosSnap] = await Promise.all([
          getDocs(collection(db, 'proveedores')),
          getDocs(collection(db, 'articulos'))
        ]);

        const proveedoresData = proveedoresSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

        const articulosData = articulosSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

        setProveedores(proveedoresData);
        setArticulos(articulosData);
      } catch (error) {
        console.error('Error al cargar datos para la remisión:', error);
      }
    };

    cargarDatos();
  }, []);

  const handleDestinoChange = (e) => {
    const id = e.target.value;
    setDestinoId(id);

    const proveedor = proveedores.find((p) => p.id === id);
    if (proveedor) {
      setDestinoInfo({
        nombre: proveedor.nombre || '',
        nit: proveedor.nit || '',
        direccion: proveedor.direccion || '',
        telefono: proveedor.telefono || ''
      });
    } else {
      setDestinoInfo({ nombre: '', nit: '', direccion: '', telefono: '' });
    }
  };

  const handleConductorChange = (e) => {
    const { name, value } = e.target;
    setDatosConductor((prev) => ({
      ...prev,
      [name]: name === 'vinculo' ? value : value.toUpperCase()
    }));
  };

  const handleArticuloChange = (e) => {
    const articuloId = e.target.value;
    const articulo = articulos.find((a) => a.id === articuloId);

    setItemSeleccionado((prev) => ({
      ...prev,
      articuloId,
      cantidad: articulo && prev.modoCantidad === 'stock' ? (articulo.stock || 0) : ''
    }));
  };

  const handleModoCantidadChange = (modo) => {
    const articulo = articulos.find((a) => a.id === itemSeleccionado.articuloId);

    setItemSeleccionado((prev) => ({
      ...prev,
      modoCantidad: modo,
      cantidad: modo === 'stock' && articulo ? (articulo.stock || 0) : ''
    }));
  };

  const handleAgregarItem = () => {
    if (!itemSeleccionado.articuloId) {
      alert('Selecciona un material antes de agregarlo.');
      return;
    }

    const articulo = articulos.find((a) => a.id === itemSeleccionado.articuloId);
    if (!articulo) {
      alert('No se pudo identificar el material.');
      return;
    }

    const cantidad = itemSeleccionado.modoCantidad === 'stock'
      ? (Number(articulo.stock) || 0)
      : toNumber(itemSeleccionado.cantidad);

    if (cantidad <= 0) {
      alert('Ingresa una cantidad válida.');
      return;
    }

    // ✅ Validación stock (sin descontar)
    if (cantidad > (Number(articulo.stock) || 0)) {
      alert(`La cantidad supera el stock disponible (${Number(articulo.stock) || 0}).`);
      return;
    }

    setItems((prev) => ([
      ...prev,
      {
        localId: generarId(),
        articuloId: articulo.id,
        nombre: articulo.nombre,
        cantidad,
        modoCantidad: itemSeleccionado.modoCantidad
      }
    ]));

    setItemSeleccionado({ articuloId: '', cantidad: '', modoCantidad: 'manual' });
  };

  const handleEliminarItem = (localId) => {
    setItems((prev) => prev.filter((item) => item.localId !== localId));
  };

  const validarFormulario = () => {
    if (!esAdmin) {
      alert('Solo los administradores pueden crear remisiones.');
      return false;
    }
    if (!destinoId) {
      alert('Selecciona un destino (proveedor).');
      return false;
    }
    if (items.length === 0) {
      alert('Agrega al menos un material a la remisión.');
      return false;
    }
    if (!datosConductor.nombre || !datosConductor.cedula || !datosConductor.placa) {
      alert('Completa los datos del conductor (nombre, cédula y placa son obligatorios).');
      return false;
    }
    return true;
  };

  const limpiarFormulario = () => {
    setItems([]);
    setObservaciones('');
    setDestinoId('');
    setDestinoInfo({ nombre: '', nit: '', direccion: '', telefono: '' });
    setDatosConductor({
      nombre: '',
      cedula: '',
      direccion: '',
      vinculo: 'CONTRATISTA DE FLETE',
      placa: '',
      celular: ''
    });
    setItemSeleccionado({ articuloId: '', cantidad: '', modoCantidad: 'manual' });
  };

  // ✅ GUARDA REMISIÓN + GENERA PDF + SUBE A STORAGE + GUARDA pdfUrl EN FIRESTORE
  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    setGuardando(true);

    const destinoSeleccionado = proveedores.find((p) => p.id === destinoId);

    try {
      const remisionRef = doc(collection(db, 'remisiones'));
      let remisionParaPdf = null;
      let remisionDocId = null;

      await runTransaction(db, async (transaction) => {
        const consecRef = doc(db, 'configuracion', 'consecutivos');
        const consecSnap = await transaction.get(consecRef);
        if (!consecSnap.exists()) throw new Error('No se encontró la configuración de consecutivos.');

        // ✅ SOLO VALIDAMOS stock (NO descontamos)
        const articulosRefs = items.map((item) => doc(db, 'articulos', item.articuloId));
        const articulosDocs = await Promise.all(articulosRefs.map((ref) => transaction.get(ref)));

        articulosDocs.forEach((artDoc, idx) => {
          if (!artDoc.exists()) throw new Error(`No se encontró el artículo ${items[idx].nombre} en inventario.`);
          const stockActual = Number(artDoc.data().stock || 0);
          const cant = Number(items[idx].cantidad || 0);
          if (cant > stockActual) {
            throw new Error(`Stock insuficiente para ${items[idx].nombre}. Stock: ${stockActual}, remisión: ${cant}`);
          }
        });

        const ultimoNum = (consecSnap.data().remisiones ?? 0) + 1;
        const consecutivoStr = formatConsecutivo(ultimoNum);

        const remisionData = {
          consecutivo: consecutivoStr,
          estado: 'PENDIENTE',
          stockDescontado: false,
          ventaId: null,
          fechaFacturacion: null,
          facturadoPor: null,

          destino: {
            id: destinoSeleccionado.id,
            nombre: destinoSeleccionado.nombre,
            nit: destinoSeleccionado.nit || '',
            direccion: destinoSeleccionado.direccion || '',
            telefono: destinoSeleccionado.telefono || ''
          },
          conductor: datosConductor,
          items: items.map((it) => ({
            articuloId: it.articuloId,
            nombre: it.nombre,
            cantidad: Number(it.cantidad || 0)
          })),
          observaciones: observaciones || '',
          fecha: Timestamp.now(),
          creadoPor: userProfile?.nombre || 'SISTEMA',

          // ✅ se llenan después
          pdfUrl: '',
          pdfPath: '',
          impresa: false,
          impresaEn: null,
          impresaPor: null
        };

        remisionParaPdf = remisionData;
        remisionDocId = remisionRef.id;

        transaction.set(remisionRef, remisionData);
        transaction.update(consecRef, { remisiones: ultimoNum });
      });

      // 1) Generar el PDF (Letter) con el mismo formato siempre
      const pdf = await generarPdfRemision(remisionParaPdf);

      setUltimoPdf(pdf);
      setUltimoConsecutivo(remisionParaPdf.consecutivo);

      // 2) Subir a Storage
      const blob = pdf.output('blob');
      const pdfPath = `remisiones/${remisionParaPdf.consecutivo}.pdf`;
      const storageRef = ref(storage, pdfPath);

      await uploadBytes(storageRef, blob, { contentType: 'application/pdf' });
      const pdfUrl = await getDownloadURL(storageRef);

      // 3) Guardar URL en Firestore (mismo doc creado en transacción)
      await updateDoc(doc(db, 'remisiones', remisionDocId), {
        pdfUrl,
        pdfPath,
        impresa: true,
        impresaEn: Timestamp.now(),
        impresaPor: userProfile?.nombre || 'SISTEMA'
      });

      setUltimoPdfUrl(pdfUrl);

      // 4) Limpiar formulario
      limpiarFormulario();

      // 5) Abrir PDF guardado (este será el mismo para reimpresión)
      window.open(pdfUrl, '_blank');

    } catch (error) {
      console.error('Error al guardar la remisión:', error);
      alert(error?.message || 'No se pudo guardar la remisión.');
    }

    setGuardando(false);
  };

  const handleDescargar = () => {
    if (ultimoPdf && ultimoConsecutivo) {
      ultimoPdf.save(`${ultimoConsecutivo}.pdf`);
    } else if (ultimoPdfUrl) {
      // Alternativa: abrir el URL guardado
      window.open(ultimoPdfUrl, '_blank');
    }
  };

  const handleImprimir = () => {
    // ✅ Preferimos imprimir desde el PDF guardado (idéntico)
    if (ultimoPdfUrl) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = ultimoPdfUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => iframe.contentWindow?.print();
      return;
    }

    // Fallback: imprimir el PDF en memoria
    if (!ultimoPdf) return;
    const blobUrl = ultimoPdf.output('bloburl');
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  };

  if (!esAdmin) {
    return (
      <div className="remisiones-container">
        <h1>Remisiones</h1>
        <p className="remisiones-alerta">Solo los administradores pueden gestionar las remisiones.</p>
      </div>
    );
  }

  return (
    <div className="remisiones-container">
      <div className="remisiones-encabezado">
        <div className="remisiones-encabezado-textos">
          <h1>Remisiones</h1>
          <p>Genera y guarda remisiones con consecutivo y genera el PDF listo para impresión.</p>
          <p className="remisiones-consecutivo">
            Próximo consecutivo: <strong>{formatConsecutivo(siguienteNumeroRemision)}</strong>
          </p>
        </div>

        <img
          src={`${BASE}logo con fondo.png`}
          alt="Logo Nasashe"
          className="remisiones-logo"
        />
      </div>

      <section className="remisiones-panel">
        <h2>Destino</h2>
        <div className="remisiones-grid">
          <label>
            Destino (proveedor)
            <select value={destinoId} onChange={handleDestinoChange}>
              <option value="">Seleccione...</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            NIT / CC
            <input type="text" value={destinoInfo.nit} readOnly />
          </label>
          <label>
            Dirección
            <input type="text" value={destinoInfo.direccion} readOnly />
          </label>
          <label>
            Teléfono
            <input type="text" value={destinoInfo.telefono} readOnly />
          </label>
        </div>
      </section>

      <section className="remisiones-panel">
        <h2>Datos del conductor</h2>
        <div className="remisiones-grid">
          <label>
            Nombre
            <input name="nombre" value={datosConductor.nombre} onChange={handleConductorChange} />
          </label>
          <label>
            Cédula
            <input name="cedula" value={datosConductor.cedula} onChange={handleConductorChange} />
          </label>
          <label>
            Dirección de residencia
            <input name="direccion" value={datosConductor.direccion} onChange={handleConductorChange} />
          </label>
          <label>
            Placa vehículo
            <input name="placa" value={datosConductor.placa} onChange={handleConductorChange} />
          </label>
          <label>
            Celular
            <input name="celular" value={datosConductor.celular} onChange={handleConductorChange} />
          </label>

          <div className="remisiones-vinculo">
            <span>Vínculo con la razón social</span>
            <label className="remisiones-check">
              <input
                type="radio"
                name="vinculo"
                value="CONTRATISTA DE FLETE"
                checked={datosConductor.vinculo === 'CONTRATISTA DE FLETE'}
                onChange={handleConductorChange}
              />
              Contr. Flete
            </label>
            <label className="remisiones-check">
              <input
                type="radio"
                name="vinculo"
                value="EMPLEADO"
                checked={datosConductor.vinculo === 'EMPLEADO'}
                onChange={handleConductorChange}
              />
              Empleado
            </label>
          </div>
        </div>
      </section>

      <section className="remisiones-panel">
        <h2>Materiales</h2>
        <div className="remisiones-articulos">
          <label>
            Material
            <select value={itemSeleccionado.articuloId} onChange={handleArticuloChange}>
              <option value="">Seleccione...</option>
              {articulos.map((articulo) => (
                <option key={articulo.id} value={articulo.id}>
                  {articulo.nombre} (stock: {Number(articulo.stock) || 0} Kg)
                </option>
              ))}
            </select>
          </label>

          <div className="remisiones-cantidad-opciones">
            <span>Cantidad</span>
            <div className="remisiones-radios">
              <label>
                <input
                  type="radio"
                  checked={itemSeleccionado.modoCantidad === 'stock'}
                  onChange={() => handleModoCantidadChange('stock')}
                />
                Usar stock disponible
              </label>
              <label>
                <input
                  type="radio"
                  checked={itemSeleccionado.modoCantidad === 'manual'}
                  onChange={() => handleModoCantidadChange('manual')}
                />
                Ingresar manualmente
              </label>
            </div>

            {itemSeleccionado.modoCantidad === 'manual' && (
              <input
                type="number"
                min="0"
                value={itemSeleccionado.cantidad}
                onChange={(e) => setItemSeleccionado((prev) => ({ ...prev, cantidad: e.target.value }))}
                placeholder="Cantidad en Kg"
              />
            )}
          </div>

          <button type="button" className="remisiones-add" onClick={handleAgregarItem}>
            Añadir material
          </button>
        </div>

        {items.length > 0 && (
          <table className="remisiones-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Cantidad (Kg)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.localId}>
                  <td>{index + 1}</td>
                  <td>{item.nombre}</td>
                  <td>{Number(item.cantidad || 0).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="remisiones-delete"
                      onClick={() => handleEliminarItem(item.localId)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="remisiones-panel">
        <h2>Observaciones</h2>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value.toUpperCase())}
          placeholder="Datos adicionales, sellos, etc."
          rows={3}
        />
      </section>

      <div className="remisiones-acciones">
        <button type="button" onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar y generar PDF'}
        </button>

        <button type="button" onClick={handleImprimir} disabled={!ultimoPdf && !ultimoPdfUrl}>
          Imprimir última remisión
        </button>

        <button type="button" onClick={handleDescargar} disabled={!ultimoPdf && !ultimoPdfUrl}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}

export default PaginaRemisiones;
