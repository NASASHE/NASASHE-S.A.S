// src/pages/PaginaReportes.jsx

import React, { useState, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy
} from 'firebase/firestore';

import { useCaja } from '../context/CajaContext';
import './PaginaReportes.css';

import {
  generarTextoTicketCompra,
  generarTextoTicketVenta,
  generarTextoTicketVentaMenor,
  generarTextoTicketGasto
} from '../utils/generarTickets';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import GraficaBarras from '../components/GraficaBarras';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { showMessage } from '../utils/showMessage';

const isTauriEnvironment = () =>
  typeof window !== 'undefined' && (Boolean(window.__TAURI__) || Boolean(window.__TAURI_INTERNALS__));

const getTodayDate = () => new Date().toISOString().split('T')[0];

const parseDateString = (dateString) => {
  const parts = dateString.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

// --- TXT Inventario ---
const generarTextoTicketInventario = (inventario, usuario) => {
  const fecha = new Date().toLocaleString('es-CO');
  const centrar = (texto, ancho) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return ' '.repeat(espacios) + texto;
  };
  const ancho = 45;

  let contenido = centrar('REPORTE DE INVENTARIO', ancho) + '\n';
  contenido += centrar('RECICLADORA NASASHE S.A.S', ancho) + '\n';
  contenido += '-'.repeat(ancho) + '\n';
  contenido += `Fecha: ${fecha}\n`;
  contenido += `Generado por: ${usuario?.nombre || 'SISTEMA'}\n`;
  contenido += '-'.repeat(ancho) + '\n';
  contenido += 'Material'.padEnd(30) + 'Stock (kg/und)'.padStart(15) + '\n';
  contenido += '-'.repeat(ancho) + '\n';

  inventario.forEach(item => {
    const nombre = (item.nombre || '').length > 29 ? item.nombre.substring(0, 29) : (item.nombre || 'SIN NOMBRE');
    const stock = (Number(item.stock) || 0).toFixed(2);
    contenido += nombre.padEnd(30) + stock.padStart(15) + '\n';
  });

  contenido += '-'.repeat(ancho) + '\n';
  contenido += `Total de Artículos: ${inventario.length}\n`;
  contenido += '-'.repeat(ancho) + '\n';
  return contenido;
};

function PaginaReportes() {
  const { base, userProfile } = useCaja();

  const [activeTab, setActiveTab] = useState('cierre');
  const [loading, setLoading] = useState(false);

  // --- Estados Cierre ---
  const [fechaCierre, setFechaCierre] = useState(getTodayDate);
  const [totalCompras, setTotalCompras] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalVentasMenores, setTotalVentasMenores] = useState(0);

  // --- Estados Historial ---
  const [fechaInicio, setFechaInicio] = useState(getTodayDate);
  const [fechaFin, setFechaFin] = useState(getTodayDate);

  const [historialCompras, setHistorialCompras] = useState([]);
  const [historialVentas, setHistorialVentas] = useState([]);
  const [historialVentasMenores, setHistorialVentasMenores] = useState([]);
  const [historialGastos, setHistorialGastos] = useState([]);
  const [historialRemisiones, setHistorialRemisiones] = useState([]);

  const [remisionesFechaInicio, setRemisionesFechaInicio] = useState(getTodayDate);
  const [remisionesFechaFin, setRemisionesFechaFin] = useState(getTodayDate);
  const [busquedaConsecutivoRemision, setBusquedaConsecutivoRemision] = useState('');

  // --- Estados Inventario ---
  const [inventario, setInventario] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(false);

  // ✅ Cache en memoria (para no pedir a Firebase cada vez)
  const inventarioCargadoRef = useRef(false);

  // --- Estado Análisis ---
  const [analisisData, setAnalisisData] = useState(null);
  const [usarEscalaLogaritmica, setUsarEscalaLogaritmica] = useState(false);

  // --- Cierre de Caja ---
  const handleGenerateCierre = async () => {
    setLoading(true);

    const fechaSeleccionada = parseDateString(fechaCierre);
    const inicioDelDia = new Date(fechaSeleccionada.setHours(0, 0, 0, 0));
    const finDelDia = new Date(fechaSeleccionada.setHours(23, 59, 59, 999));

    const startTimestamp = Timestamp.fromDate(inicioDelDia);
    const endTimestamp = Timestamp.fromDate(finDelDia);

    let sumaCompras = 0, sumaGastos = 0, sumaVentasMenores = 0;

    try {
      const qCompras = query(
        collection(db, 'compras'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp)
      );
      const comprasSnap = await getDocs(qCompras);
      comprasSnap.forEach(d => (sumaCompras += Number(d.data().total || 0)));

      const qGastos = query(
        collection(db, 'gastos'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp)
      );
      const gastosSnap = await getDocs(qGastos);
      gastosSnap.forEach(d => (sumaGastos += Number(d.data().monto || 0)));

      const qVentasMenores = query(
        collection(db, 'ventasMenores'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp)
      );
      const ventasMenoresSnap = await getDocs(qVentasMenores);
      ventasMenoresSnap.forEach(d => (sumaVentasMenores += Number(d.data().total || 0)));
    } catch (error) {
      console.error('Error al generar el reporte: ', error);
      await showMessage('Error al generar el reporte.', { title: 'Nasashe sas', type: 'error' });
    }

    setTotalCompras(sumaCompras);
    setTotalGastos(sumaGastos);
    setTotalVentasMenores(sumaVentasMenores);
    setLoading(false);
  };

  const totalEgresos = totalCompras + totalGastos;
  const baseInicialCalculada = base + totalEgresos - totalVentasMenores;

  // --- Historial Compras ---
  const handleFetchHistorialCompras = async () => {
    setLoading(true);

    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    try {
      const q = query(
        collection(db, 'compras'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp),
        orderBy('fecha', 'desc')
      );

      const snap = await getDocs(q);
      const compras = snap.docs.map(docSnap => {
        const data = docSnap.data();
        return { id: docSnap.id, ...data, fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date() };
      });

      setHistorialCompras(compras);
    } catch (error) {
      console.error('Error al buscar historial: ', error);
      await showMessage('Error al buscar historial.', { title: 'Nasashe sas', type: 'warning' });
    }

    setLoading(false);
  };

  // --- Historial Ventas ---
  const handleFetchHistorialVentas = async () => {
    setLoading(true);

    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    try {
      const q = query(
        collection(db, 'ventas'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp),
        orderBy('fecha', 'desc')
      );

      const snap = await getDocs(q);
      const ventas = snap.docs.map(docSnap => {
        const data = docSnap.data();
        return { id: docSnap.id, ...data, fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date() };
      });

      setHistorialVentas(ventas);
    } catch (error) {
      console.error('Error al buscar historial de ventas: ', error);
      await showMessage('Error al buscar historial.', { title: 'Nasashe sas', type: 'error' });
    }

    setLoading(false);
  };

  // --- Historial Ventas Menores ---
  const handleFetchHistorialVentasMenores = async () => {
    setLoading(true);

    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    try {
      const q = query(
        collection(db, 'ventasMenores'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp),
        orderBy('fecha', 'desc')
      );

      const snap = await getDocs(q);
      const ventas = snap.docs.map(docSnap => {
        const data = docSnap.data();
        return { id: docSnap.id, ...data, fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date() };
      });

      setHistorialVentasMenores(ventas);
    } catch (error) {
      console.error('Error al buscar historial de ventas menores: ', error);
      await showMessage('Error al buscar historial.', { title: 'Nasashe sas', type: 'error' });
    }

    setLoading(false);
  };

  // --- Historial Gastos ---
  const handleFetchHistorialGastos = async () => {
    setLoading(true);

    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    try {
      const q = query(
        collection(db, 'gastos'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp),
        orderBy('fecha', 'desc')
      );

      const snap = await getDocs(q);
      const gastos = snap.docs.map(docSnap => {
        const data = docSnap.data();
        return { id: docSnap.id, ...data, fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date() };
      });

      setHistorialGastos(gastos);
    } catch (error) {
      console.error('Error al buscar historial de gastos: ', error);
      await showMessage('Error al buscar historial.', { title: 'Nasashe sas', type: 'error' });
    }

    setLoading(false);
  };

  // --- Historial Remisiones ---
  const handleFetchHistorialRemisiones = async () => {
    setLoading(true);

    const consecutivoBusqueda = busquedaConsecutivoRemision.trim().toUpperCase();

    const inicio = new Date(parseDateString(remisionesFechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(remisionesFechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    try {
      let snap;

      if (consecutivoBusqueda) {
        const q = query(collection(db, 'remisiones'), where('consecutivo', '==', consecutivoBusqueda));
        snap = await getDocs(q);
      } else {
        const q = query(
          collection(db, 'remisiones'),
          where('fecha', '>=', startTimestamp),
          where('fecha', '<=', endTimestamp),
          orderBy('fecha', 'desc')
        );
        snap = await getDocs(q);
      }

      const remisiones = snap.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date()
        };
      });

      setHistorialRemisiones(remisiones);
    } catch (error) {
      console.error('Error al buscar historial de remisiones: ', error);
      await showMessage('Error al buscar remisiones.', { title: 'Nasashe sas', type: 'error' });
    }

    setLoading(false);
  };

  // --- Impresión (iframe) ---
  const imprimirTicketEnNavegador = (contenido, titulo) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><title>${titulo}</title>
      <style>
        body { font-family: 'Courier New', Courier, monospace; font-size: 10px; width: 80mm; margin: 0; padding: 8px; }
        @page { margin: 2mm; size: 80mm auto; }
      </style></head><body><pre>${contenido}</pre></body></html>`);
    doc.close();

    const ejecutarImpresion = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 1000);
    };

    if (window.requestAnimationFrame) window.requestAnimationFrame(ejecutarImpresion);
    else setTimeout(ejecutarImpresion, 0);
  };

  const printCompraEnNavegador = (data) => {
    imprimirTicketEnNavegador(generarTextoTicketCompra(data, userProfile), `Ticket ${data.consecutivo}`);
  };
  const printVentaEnNavegador = (data) => {
    imprimirTicketEnNavegador(generarTextoTicketVenta(data, userProfile), `Ticket ${data.consecutivo}`);
  };
  const printVentaMenorEnNavegador = (data) => {
    imprimirTicketEnNavegador(generarTextoTicketVentaMenor(data, userProfile), `Ticket ${data.consecutivo}`);
  };
  const printGastoEnNavegador = (data) => {
    imprimirTicketEnNavegador(generarTextoTicketGasto(data, userProfile), `Comprobante ${data.consecutivo}`);
  };

  const printInventarioEnNavegador = async (payload) => {
    const itemsParaImprimir = Array.isArray(payload?.items) && payload.items.length > 0
      ? payload.items
      : inventario;

    if (!itemsParaImprimir || itemsParaImprimir.length === 0) {
      await showMessage('No hay datos de inventario para imprimir.', { title: 'Nasashe sas', type: 'warning' });
      return;
    }

    const textoTicket = generarTextoTicketInventario(itemsParaImprimir, userProfile);
    imprimirTicketEnNavegador(textoTicket, 'Reporte Inventario');
  };

  const prepararEImprimir = async (tipo, datos) => {
    if (!datos) return;

    const fallback = () => {
      switch (tipo) {
        case 'compra': return printCompraEnNavegador(datos);
        case 'venta': return printVentaEnNavegador(datos);
        case 'ventaMenor': return printVentaMenorEnNavegador(datos);
        case 'gasto': return printGastoEnNavegador(datos);
        case 'inventario': return printInventarioEnNavegador(datos);
        default: return;
      }
    };

    if (!isTauriEnvironment()) {
      fallback();
      return;
    }

    try {
      localStorage.setItem('ticketData', JSON.stringify(datos));
      localStorage.setItem('ticketUser', JSON.stringify(userProfile));
      localStorage.setItem('ticketType', tipo);
    } catch (e) {
      console.error('Error preparando impresión:', e);
      fallback();
      return;
    }

    const normalizar = (v) => (v ? String(v) : `${Date.now()}`).replace(/\s/g, '-');
    const label = `ticket-${tipo}-${normalizar(datos.consecutivo)}`;

    const webview = new WebviewWindow(label, {
      url: '/imprimir',
      title: tipo === 'inventario' ? 'Reporte de Inventario' : `Ticket ${datos.consecutivo || ''}`.trim(),
      width: 310,
      height: 600,
      resizable: true,
      decorations: true,
    });

    webview.once('tauri://error', (e) => {
      console.error('Error al crear ventana de impresión:', e);
      fallback();
    });
  };

  // --- Inventario ---
  const handleFetchInventario = async (force = false) => {
    // ✅ cache: si ya se cargó y NO es force, no vuelve a pedir
    if (inventarioCargadoRef.current && !force) return;

    setLoadingInventario(true);
    try {
      const q = query(collection(db, 'articulos'), orderBy('nombre', 'asc'));
      const snap = await getDocs(q);
      const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      setInventario(lista);
      inventarioCargadoRef.current = true;
    } catch (error) {
      console.error('Error al cargar inventario: ', error);
      await showMessage('Error al cargar inventario.', { title: 'Nasashe sas', type: 'error' });
    }
    setLoadingInventario(false);
  };

  const handleExportarPDF = async () => {
    if (inventario.length === 0) {
      await showMessage('No hay datos de inventario para exportar.', { title: 'Nasashe sas', type: 'warning' });
      return;
    }

    const doc = new jsPDF();
    doc.text('Reporte de Inventario Actual', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado por: ${userProfile?.nombre || 'SISTEMA'}`, 14, 20);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 14, 25);

    const tableColumn = ['Nombre', 'Precio Compra ($)', 'Stock Actual (kg/und)'];
    const tableRows = inventario.map(item => ([
      item?.nombre || 'Sin nombre',
      Number(item?.precioCompra ?? 0).toLocaleString('es-CO'),
      Number(item?.stock ?? 0).toLocaleString('es-CO'),
    ]));

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });

    const fechaHoy = new Date().toISOString().split('T')[0];
    try {
      doc.save(`Reporte_Inventario_${fechaHoy}.pdf`);
      await showMessage('Su archivo se exportó con éxito en la carpeta de descargas.', { title: 'Nasashe sas', type: 'info' });
    } catch (error) {
      console.error('Error al exportar el inventario a PDF:', error);
      await showMessage('Ocurrió un error al exportar el PDF. Inténtalo de nuevo.', { title: 'Nasashe sas', type: 'error' });
    }
  };

  const handleImprimirInventario = async () => {
    if (inventario.length === 0) {
      await showMessage('No hay datos de inventario para imprimir.', { title: 'Nasashe sas', type: 'warning' });
      return;
    }

    const ticketPayload = {
      consecutivo: `INV-${new Date().toISOString().slice(0, 10)}`,
      items: inventario.map(({ id, nombre, stock, precioCompra }) => ({
        id,
        nombre,
        stock,
        precioCompra,
      })),
      fechaGeneracion: new Date().toISOString(),
    };

    try {
      await prepararEImprimir('inventario', ticketPayload);
    } catch (error) {
      console.error('Error al preparar la impresión del inventario:', error);
      await printInventarioEnNavegador(ticketPayload);
    }
  };

  // --- Análisis ---
  const handleGenerateAnalisis = async () => {
    setLoading(true);
    setAnalisisData(null);

    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    const agregador = {};

    try {
      const qCompras = query(
        collection(db, 'compras'),
        where('fecha', '>=', startTimestamp),
        where('fecha', '<=', endTimestamp)
      );

      const comprasSnap = await getDocs(qCompras);
      comprasSnap.forEach(d => {
        const items = d.data().items || [];
        items.forEach(item => {
          const nombre = item.nombre || 'SIN NOMBRE';
          agregador[nombre] = (agregador[nombre] || 0) + Number(item.cantidad || 0);
        });
      });

      const labels = Object.keys(agregador);
      const data = Object.values(agregador);

      if (labels.length === 0) {
        setAnalisisData({ labels: [], datasets: [] });
      } else {
        setAnalisisData({
          labels,
          datasets: [
            {
              label: 'Total Comprado (kg/und)',
              data,
              backgroundColor: 'rgba(220, 53, 69, 0.6)',
              borderColor: 'rgba(220, 53, 69, 1)',
              borderWidth: 1,
              minBarLength: 8,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error al generar análisis: ', error);
      await showMessage('Error al generar análisis.', { title: 'Error de analisis', type: 'error' });
    }

    setLoading(false);
  };

  // ✅ Extra recomendado + cache:
  // al abrir Inventario por primera vez, carga automático (sin repetir peticiones)
  const irAInventario = async () => {
    setActiveTab('inventario');
    await handleFetchInventario(false);
  };

  return (
    <div className="pagina-reportes">
      <h1>Módulo de Reportes</h1>

      {/* --- Pestañas --- */}
      <div className="tabs-container">
        <button className={`tab-button ${activeTab === 'cierre' ? 'active' : ''}`} onClick={() => setActiveTab('cierre')}>
          Cierre de Caja
        </button>

        <button className={`tab-button ${activeTab === 'historialCompras' ? 'active' : ''}`} onClick={() => setActiveTab('historialCompras')}>
          Hist. Compras
        </button>

        <button className={`tab-button ${activeTab === 'historialVentas' ? 'active' : ''}`} onClick={() => setActiveTab('historialVentas')}>
          Hist. Ventas
        </button>

        <button className={`tab-button ${activeTab === 'historialVentasMenores' ? 'active' : ''}`} onClick={() => setActiveTab('historialVentasMenores')}>
          Hist. Ventas Menores
        </button>

        <button className={`tab-button ${activeTab === 'historialGastos' ? 'active' : ''}`} onClick={() => setActiveTab('historialGastos')}>
          Hist. Gastos
        </button>

        <button className={`tab-button ${activeTab === 'historialRemisiones' ? 'active' : ''}`} onClick={() => setActiveTab('historialRemisiones')}>
          Hist. Remisiones
        </button>

        {/* ✅ EXTRA: carga inventario al entrar (cacheado) */}
        <button className={`tab-button ${activeTab === 'inventario' ? 'active' : ''}`} onClick={irAInventario}>
          Inventario
        </button>

        <button className={`tab-button ${activeTab === 'analisis' ? 'active' : ''}`} onClick={() => setActiveTab('analisis')}>
          Análisis de Materiales
        </button>
      </div>

      <div className="tab-content">

        {/* --- CIERRE --- */}
        {activeTab === 'cierre' && (
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-cierre">Seleccione la fecha:</label>
              <input
                type="date"
                id="fecha-cierre"
                value={fechaCierre}
                onChange={(e) => setFechaCierre(e.target.value)}
              />
              <button onClick={handleGenerateCierre} className="btn-generar" disabled={loading}>
                {loading ? 'Calculando...' : 'Generar Cierre'}
              </button>
            </div>

            <h2>Resumen del Día ({fechaCierre})</h2>
            <div className="reporte-grid">
              <div className="summary-card card-ingresos">
                <h3>(+) Total Ventas Menores</h3>
                <div className="monto">${totalVentasMenores.toLocaleString('es-CO')}</div>
              </div>
              <div className="summary-card card-egresos">
                <h3>(-) Total Compras</h3>
                <div className="monto">${totalCompras.toLocaleString('es-CO')}</div>
              </div>
              <div className="summary-card card-egresos">
                <h3>(-) Total Gastos</h3>
                <div className="monto">${totalGastos.toLocaleString('es-CO')}</div>
              </div>
              <div className="summary-card card-base">
                <h3>(=) Efectivo Actual en Caja</h3>
                <div className="monto">${base.toLocaleString('es-CO')}</div>
              </div>
              <div className="summary-card card-calculada">
                <h3>(=) Base Inicial (Calculada)</h3>
                <div className="monto">${baseInicialCalculada.toLocaleString('es-CO')}</div>
              </div>
            </div>
          </div>
        )}

        {/* --- HISTORIAL COMPRAS --- */}
        {activeTab === 'historialCompras' && (
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <button onClick={handleFetchHistorialCompras} className="btn-generar" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Compras'}
              </button>
            </div>

            <h2>Historial de Compras</h2>
            <table className="historial-table">
              <thead>
                <tr><th>Fecha</th><th>Consecutivo</th><th>Reciclador</th><th>Total</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Buscando...</td></tr>
                ) : historialCompras.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron compras.</td></tr>
                ) : (
                  historialCompras.map(compra => (
                    <tr key={compra.id}>
                      <td>{compra.fecha.toLocaleString('es-CO')}</td>
                      <td>{compra.consecutivo}</td>
                      <td>{compra.reciclador}</td>
                      <td>${Number(compra.total || 0).toLocaleString('es-CO')}</td>
                      <td>
                        <button onClick={() => prepararEImprimir('compra', compra)} className="btn-reimprimir">
                          Re-imprimir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- HISTORIAL VENTAS --- */}
        {activeTab === 'historialVentas' && (
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <button onClick={handleFetchHistorialVentas} className="btn-generar" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Ventas'}
              </button>
            </div>

            <h2>Historial de Ventas (a Proveedores)</h2>
            <table className="historial-table">
              <thead>
                <tr><th>Fecha</th><th>Consecutivo</th><th>Cliente (Proveedor)</th><th>Total</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Buscando...</td></tr>
                ) : historialVentas.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron ventas.</td></tr>
                ) : (
                  historialVentas.map(venta => (
                    <tr key={venta.id}>
                      <td>{venta.fecha.toLocaleString('es-CO')}</td>
                      <td>{venta.consecutivo}</td>
                      <td>{venta.proveedor?.nombre || 'N/D'}</td>
                      <td>${Number(venta.total || 0).toLocaleString('es-CO')}</td>
                      <td>
                        <button onClick={() => prepararEImprimir('venta', venta)} className="btn-reimprimir">
                          Re-imprimir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- HISTORIAL VENTAS MENORES --- */}
        {activeTab === 'historialVentasMenores' && (
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <button onClick={handleFetchHistorialVentasMenores} className="btn-generar" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Ventas Menores'}
              </button>
            </div>

            <h2>Historial de Ventas Menores (a Particulares)</h2>
            <table className="historial-table">
              <thead>
                <tr><th>Fecha</th><th>Consecutivo</th><th>Cliente</th><th>Total</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>Buscando...</td></tr>
                ) : historialVentasMenores.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron ventas.</td></tr>
                ) : (
                  historialVentasMenores.map(venta => (
                    <tr key={venta.id}>
                      <td>{venta.fecha.toLocaleString('es-CO')}</td>
                      <td>{venta.consecutivo}</td>
                      <td>{venta.cliente || 'N/D'}</td>
                      <td>${Number(venta.total || 0).toLocaleString('es-CO')}</td>
                      <td>
                        <button onClick={() => prepararEImprimir('ventaMenor', venta)} className="btn-reimprimir">
                          Re-imprimir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- HISTORIAL GASTOS --- */}
        {activeTab === 'historialGastos' && (
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <button onClick={handleFetchHistorialGastos} className="btn-generar" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Gastos'}
              </button>
            </div>

            <h2>Historial de Gastos</h2>
            <table className="historial-table">
              <thead>
                <tr><th>Fecha</th><th>Consecutivo</th><th>Concepto</th><th>Descripción</th><th>Monto</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>Buscando...</td></tr>
                ) : historialGastos.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>No se encontraron gastos.</td></tr>
                ) : (
                  historialGastos.map(gasto => (
                    <tr key={gasto.id}>
                      <td>{gasto.fecha.toLocaleString('es-CO')}</td>
                      <td>{gasto.consecutivo}</td>
                      <td>{gasto.concepto}</td>
                      <td>{gasto.descripcion}</td>
                      <td>${Number(gasto.monto || 0).toLocaleString('es-CO')}</td>
                      <td>
                        <button onClick={() => prepararEImprimir('gasto', gasto)} className="btn-reimprimir">
                          Re-imprimir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- HISTORIAL REMISIONES --- */}
        {activeTab === 'historialRemisiones' && (
          <div>
            <div className="reporte-controles">
              <label htmlFor="remision-fecha-inicio">Desde:</label>
              <input
                type="date"
                id="remision-fecha-inicio"
                value={remisionesFechaInicio}
                onChange={(e) => setRemisionesFechaInicio(e.target.value)}
              />

              <label htmlFor="remision-fecha-fin">Hasta:</label>
              <input
                type="date"
                id="remision-fecha-fin"
                value={remisionesFechaFin}
                onChange={(e) => setRemisionesFechaFin(e.target.value)}
              />

              <label htmlFor="remision-consecutivo">Consecutivo (opcional)</label>
              <input
                id="remision-consecutivo"
                type="text"
                placeholder="REM-000001"
                value={busquedaConsecutivoRemision}
                onChange={(e) => setBusquedaConsecutivoRemision(e.target.value)}
              />

              <button onClick={handleFetchHistorialRemisiones} className="btn-generar" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar Remisiones'}
              </button>
            </div>

            <h2>Historial de Remisiones</h2>
            <table className="historial-table">
              <thead>
                <tr><th>Fecha</th><th>Consecutivo</th><th>Destino</th><th>Conductor</th><th>Items</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>Buscando...</td></tr>
                ) : historialRemisiones.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center' }}>No se encontraron remisiones.</td></tr>
                ) : (
                  historialRemisiones.map(remision => (
                    <tr key={remision.id}>
                      <td>{(remision.fecha instanceof Date ? remision.fecha : new Date(remision.fecha)).toLocaleString('es-CO')}</td>
                      <td>{remision.consecutivo}</td>
                      <td>{remision.destino?.nombre || 'N/D'}</td>
                      <td>{remision.conductor?.nombre || 'N/D'}</td>
                      <td>{Array.isArray(remision.items) ? remision.items.length : 0}</td>
                      <td>
                        {/* Aquí podrías agregar reimpresión PDF si quieres */}
                        <span>-</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ INVENTARIO (YA SEPARADO) */}
        {activeTab === 'inventario' && (
          <div>
            <div className="inventario-header">
              <h2>Reporte de Inventario Actual</h2>

              <div className="inventario-header-botones">
                <button
                  onClick={() => handleFetchInventario(true)}   // fuerza recarga
                  className="btn-generar"
                  disabled={loadingInventario}
                >
                  {loadingInventario ? 'Cargando...' : 'Cargar Inventario'}
                </button>

                <button
                  onClick={handleExportarPDF}
                  className="btn-exportar-pdf"
                  disabled={inventario.length === 0}
                >
                  Exportar a PDF
                </button>

                <button
                  onClick={handleImprimirInventario}
                  className="btn-imprimir-inventario"
                  disabled={inventario.length === 0}
                >
                  Imprimir
                </button>
              </div>
            </div>

            <table className="inventario-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio Compra</th>
                  <th>Stock Actual (kg/und)</th>
                </tr>
              </thead>
              <tbody>
                {loadingInventario ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>Cargando...</td></tr>
                ) : inventario.length === 0 ? (
                  <tr><td colSpan="3" style={{ textAlign: 'center' }}>No se encontró inventario.</td></tr>
                ) : (
                  inventario.map(item => (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>${Number(item.precioCompra || 0).toLocaleString('es-CO')}</td>
                      <td>{(Number(item.stock) || 0).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ ANÁLISIS (YA SEPARADO) */}
        {activeTab === 'analisis' && (
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio-analisis">Desde:</label>
              <input
                type="date"
                id="fecha-inicio-analisis"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />

              <label htmlFor="fecha-fin-analisis">Hasta:</label>
              <input
                type="date"
                id="fecha-fin-analisis"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />

              <label className="checkbox-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={usarEscalaLogaritmica}
                  onChange={(e) => setUsarEscalaLogaritmica(e.target.checked)}
                />
                Usar escala logarítmica
              </label>

              <button onClick={handleGenerateAnalisis} className="btn-generar" disabled={loading}>
                {loading ? 'Generando...' : 'Generar Análisis'}
              </button>
            </div>

            <h2>Análisis de Materiales Comprados (por Cantidad)</h2>

            <div className="chart-container">
              {loading ? (
                <p>Generando gráfica...</p>
              ) : analisisData ? (
                analisisData.labels.length > 0 ? (
                  <GraficaBarras
                    chartData={analisisData}
                    titulo={`Materiales Comprados (${fechaInicio} a ${fechaFin})`}
                    useLogScale={usarEscalaLogaritmica}
                  />
                ) : (
                  <p>No se encontraron datos de compras para este rango de fechas.</p>
                )
              ) : (
                <p>Seleccione un rango de fechas y haga clic en "Generar Análisis" para ver la gráfica.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PaginaReportes;
