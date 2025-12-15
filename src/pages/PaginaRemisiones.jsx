// src/pages/PaginaRemisiones.jsx

import React, { useEffect, useMemo, useState } from 'react';
import './PaginaRemisiones.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collection, doc, getDocs, runTransaction, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useCaja } from '../context/CajaContext';

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

const cargarImagenComoBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

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
  const [ultimoPdf, setUltimoPdf] = useState(null);
  const [ultimoConsecutivo, setUltimoConsecutivo] = useState('');

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

    // ✅ IMPORTANTE: aunque NO descontamos stock aquí, sí validamos para no crear remisiones imposibles
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

  const generarPdf = async (remisionData) => {
    const pdf = new jsPDF({ unit: 'mm', format: 'letter' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    let cursorY = margin;

    // Logo
    try {
      const logoPath = encodeURI(`${BASE}logo con fondo.png`);
      const logoData = await cargarImagenComoBase64(logoPath);
      pdf.addImage(logoData, 'PNG', margin, cursorY, 40, 20);
    } catch (error) {
      console.warn('No se pudo cargar el logo para el PDF:', error);
    }

    pdf.setFontSize(16);
    pdf.text('NASASHE S.A.S.', pageWidth / 2, cursorY + 6, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('901.907.763-3', pageWidth / 2, cursorY + 12, { align: 'center' });
    pdf.text('Calle 98 9B 35', pageWidth / 2, cursorY + 18, { align: 'center' });
    pdf.text('Tel: 3227377140', pageWidth / 2, cursorY + 24, { align: 'center' });

    pdf.setFontSize(14);
    pdf.text('REMISIÓN', pageWidth - margin, cursorY + 10, { align: 'right' });
    pdf.setFontSize(12);
    pdf.text(remisionData.consecutivo, pageWidth - margin, cursorY + 18, { align: 'right' });

    cursorY += 30;
    pdf.setFontSize(11);
    pdf.text(`Destino: ${remisionData.destino.nombre}`, margin, cursorY);
    pdf.text(`Dirección: ${remisionData.destino.direccion || 'N/D'}`, pageWidth / 2, cursorY);

    cursorY += 6;
    pdf.text(`NIT: ${remisionData.destino.nit || 'N/D'}`, margin, cursorY);
    pdf.text(`Teléfono: ${remisionData.destino.telefono || 'N/D'}`, pageWidth / 2, cursorY);

    cursorY += 10;
    pdf.text(`Fecha emisión: ${new Date(remisionData.fecha.toDate()).toLocaleString('es-CO')}`, margin, cursorY);

    cursorY += 6;
    pdf.text(`Conductor: ${remisionData.conductor.nombre}`, margin, cursorY);
    pdf.text(`Cédula: ${remisionData.conductor.cedula}`, pageWidth / 2, cursorY);

    cursorY += 6;
    pdf.text(`Dirección: ${remisionData.conductor.direccion || 'N/D'}`, margin, cursorY);

    cursorY += 6;
    pdf.text(`Vínculo: ${remisionData.conductor.vinculo}`, margin, cursorY);
    pdf.text(`Placa: ${remisionData.conductor.placa}`, pageWidth / 2, cursorY);

    cursorY += 6;
    pdf.text(`Celular: ${remisionData.conductor.celular || 'N/D'}`, margin, cursorY);

    cursorY += 6;
    if (remisionData.observaciones) {
      pdf.text(`Observaciones: ${remisionData.observaciones}`, margin, cursorY);
      cursorY += 6;
    }

    autoTable(pdf, {
      startY: cursorY + 4,
      head: [['Ítem', 'Detalle del material', 'Cantidad (Kg)']],
      body: remisionData.items.map((item, idx) => ([
        String(idx + 1),
        item.nombre,
        Number(item.cantidad || 0).toLocaleString('es-CO')
      ])),
      styles: { fontSize: 10, cellPadding: 2 },
      theme: 'grid',
      headStyles: { fillColor: [26, 71, 77] },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 120 },
        2: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });

    // ----- Firmas -----
    const finalY = pdf.lastAutoTable.finalY + 10;
    pdf.line(margin, finalY, pageWidth - margin, finalY);

    const colW = (pageWidth - margin * 2) / 3;

    // ✅ Imagen de firma (quien diligencia) encima del texto
    try {
      const firmaPath = encodeURI(`${BASE}icons/Firma.jpg`);
      const firmaData = await cargarImagenComoBase64(firmaPath);

      const firmaX = margin + 4;
      const firmaY = finalY + 1;
      const firmaW = colW - 8;
      const firmaH = 12; // ajusta si quieres más alta

      pdf.addImage(firmaData, 'JPEG', firmaX, firmaY, firmaW, firmaH);
    } catch (error) {
      console.warn('No se pudo cargar Firma.jpg:', error);
    }

    // Textos debajo (dejando espacio para la imagen)
    const labelY = finalY + 16;
    pdf.setFontSize(10);
    pdf.text('Firma y sello quien diligencia', margin + 6, labelY);
    pdf.text('Firma Conductor', margin + colW + 20, labelY);
    pdf.text('Firma cliente y/o Recibidor', margin + colW * 2 + 10, labelY);

    // Paginación
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i += 1) {
      pdf.setPage(i);
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    return pdf;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    setGuardando(true);

    const destinoSeleccionado = proveedores.find((p) => p.id === destinoId);

    try {
      const remisionRef = doc(collection(db, 'remisiones'));
      let remisionParaPdf = null;

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
          estado: 'PENDIENTE',         // ✅ clave para jalar en ventas
          stockDescontado: false,      // ✅ se vuelve true al facturar (venta)
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
          creadoPor: userProfile?.nombre || 'SISTEMA'
        };

        remisionParaPdf = remisionData;

        transaction.set(remisionRef, remisionData);
        transaction.update(consecRef, { remisiones: ultimoNum });
      });

      const pdf = await generarPdf(remisionParaPdf);

      setUltimoPdf(pdf);
      setUltimoConsecutivo(remisionParaPdf.consecutivo);

      // limpiar form
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

      window.open(pdf.output('bloburl'), '_blank');
    } catch (error) {
      console.error('Error al guardar la remisión:', error);
      alert(error.message || 'No se pudo guardar la remisión.');
    }

    setGuardando(false);
  };

  const handleDescargar = () => {
    if (ultimoPdf && ultimoConsecutivo) {
      ultimoPdf.save(`${ultimoConsecutivo}.pdf`);
    }
  };

  const handleImprimir = () => {
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
        <button type="button" onClick={handleImprimir} disabled={!ultimoPdf}>
          Imprimir última remisión
        </button>
        <button type="button" onClick={handleDescargar} disabled={!ultimoPdf}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}

export default PaginaRemisiones;
