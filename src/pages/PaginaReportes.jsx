// src/pages/PaginaReportes.jsx

//        import React, { useState, useRef } from 'react';
import React, { useState, useRef } from 'react';
// import { WebviewWindow } from '@tauri-apps/api/window';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  query,
  where,
  Timestamp,
  orderBy
} from 'firebase/firestore';
//        import { useCaja } from '../context/CajaContext';
//        import './PaginaReportes.css';

//        ¡YA NO USAMOS 'generarTextoTicketCompra'!
//        import { 
  //        generarTextoTicketCompra, (La quitamos)
//          generarTextoTicketVenta,
//          generarTextoTicketVentaMenor,
//          generarTextoTicketGasto 
//}         from '../utils/generarTickets'; 

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

//
// --- CÓDIGO ANTIGUO COMENTADO (useReactToPrint) ---
//                         import { useReactToPrint } from 'react-to-print';
//

// ¡AÑADE ESTA LÍNEA! (Y CORRIGE LA RUTA)
// Se cambió de '@tauri-apps/api/window' a '@tauri-apps/api/webviewWindow'
//                        import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

// ¡AÑADE ESTA LÍNEA!
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { showMessage } from '../utils/showMessage';                                                                                                                  

const isTauriEnvironment = () =>
  typeof window !== 'undefined' && (Boolean(window.__TAURI__) || Boolean(window.__TAURI_INTERNALS__));

// --- ¡PASO 1: IMPORTAR EL COMPONENTE! ---
// import TicketCompra from '../components/TicketCompra'; // (Ajusta la ruta si es necesario) //

const getTodayDate = () => new Date().toISOString().split('T')[0];

const parseDateString = (dateString) => {
  const parts = dateString.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]); 
};


/* // --- CÓDIGO ANTIGUO COMENTADO (TicketInventario y generarTextoTicketInventario) ---

// Componente de Ticket de Inventario (para imprimir 8cm)
const TicketInventario = React.forwardRef(({ inventario }, ref) => {
  if (!inventario || inventario.length === 0) return null;
  
  return (
    <div ref={ref} className="ticket-container">
      <div className="ticket-header"><h3>Reporte de Inventario</h3><p>{new Date().toLocaleString('es-CO')}</p></div>
      <div className="ticket-items">
        <table>
          <thead><tr><th className="col-mat">Material</th><th className="col-tot">Stock</th></tr></thead>
          <tbody>
            {inventario.map(item => (
              <tr key={item.id}><td className="col-mat">{item.nombre}</td><td className="col-tot">{item.stock}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="ticket-footer"><p>Total de {inventario.length} artículos.</p></div>
    </div>
  );
}); */

// Función de TXT de inventario
//          const generarTextoTicketInventario = (inventario, usuario) => {


  
// Función de TXT de inventario
const generarTextoTicketInventario = (inventario, usuario) => {
  const fecha = new Date().toLocaleString('es-CO');
  const centrar = (texto, ancho) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };
  const ancho = 45;
  let contenido = centrar("REPORTE DE INVENTARIO", ancho) + "\n";
  contenido += centrar("RECICLADORA NASASHE S.A.S", ancho) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += `Fecha: ${fecha}\n`;
  contenido += `Generado por: ${usuario?.nombre || 'SISTEMA'}\n`;
  contenido += "-".repeat(ancho) + "\n";
  contenido += "Material".padEnd(30) + "Stock (kg/und)".padStart(15) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  inventario.forEach(item => {
    const nombre = item.nombre.length > 29 ? item.nombre.substring(0, 29) : item.nombre;
    const stock = (Number(item.stock) || 0).toFixed(2);
    contenido += nombre.padEnd(30) + stock.padStart(15) + "\n";
  });
  contenido += "-".repeat(ancho) + "\n";
  contenido += `Total de Artículos: ${inventario.length}\n`;
  contenido += "-".repeat(ancho) + "\n";
  return contenido;
};

// ... (Fin del código de inventario)

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
  
  //
  // --- CÓDIGO ANTIGUO COMENTADO (Lógica de Impresión Inventario) ---
  //                                 const inventarioPrintRef = useRef(null);
  //                                 const handlePrintInventario = useReactToPrint({
  //                                 content: () => inventarioPrintRef.current,
  //                                });
  

  
  // --- Lógica de Impresión Inventario ---
  const inventarioPrintRef = useRef(null);

  // --- Estado Análisis ---
  const [analisisData, setAnalisisData] = useState(null);
  const [usarEscalaLogaritmica, setUsarEscalaLogaritmica] = useState(false);




  // --- ¡PASO 2: AÑADIR ESTADO Y USEEFFECT! ---
  // const [ticketParaImprimir, setTicketParaImprimir] = useState(null); //

  // useEffect(() => {
  //   if (ticketParaImprimir) {
  //     // Retraso breve para asegurar que React renderizó el ticket
  //     const timer = setTimeout(() => {
  //       window.print(); // Llama a la impresión
  //       setTicketParaImprimir(null); // Limpia el estado después de imprimir
  //     }, 50); 
  //     
  //     return () => clearTimeout(timer); // Limpieza
  //     }
  // }, [ticketParaImprimir]); // Se ejecuta cada vez que 'ticketParaImprimir' cambia
  // --- FIN DEL PASO 2 ---

  
  // --- Función Cierre de Caja ---
  const handleGenerateCierre = async () => {
    // ... (tu código de cierre sigue igual)
    setLoading(true);
    const fechaSeleccionada = parseDateString(fechaCierre);
    const inicioDelDia = new Date(fechaSeleccionada.setHours(0, 0, 0, 0));
    const finDelDia = new Date(fechaSeleccionada.setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicioDelDia);
    const endTimestamp = Timestamp.fromDate(finDelDia);
    let sumaCompras = 0, sumaGastos = 0, sumaVentasMenores = 0;
    try {
      const qCompras = query(collection(db, "compras"), where("fecha", ">=", startTimestamp), where("fecha", "<=", endTimestamp));
      const comprasSnap = await getDocs(qCompras);
      comprasSnap.forEach(doc => sumaCompras += doc.data().total);
      const qGastos = query(collection(db, "gastos"), where("fecha", ">=", startTimestamp), where("fecha", "<=", endTimestamp));
      const gastosSnap = await getDocs(qGastos);
      gastosSnap.forEach(doc => sumaGastos += doc.data().monto);
      const qVentasMenores = query(collection(db, "ventasMenores"), where("fecha", ">=", startTimestamp), where("fecha", "<=", endTimestamp));
      const ventasMenoresSnap = await getDocs(qVentasMenores);
      ventasMenoresSnap.forEach(doc => sumaVentasMenores += doc.data().total);
    } catch (error) { console.error("Error al generar el reporte: ", error); await showMessage("Error al generar el reporte.", {
      title: 'Nasashe sas',
      type: 'error' }); 
    }
    setTotalCompras(sumaCompras);
    setTotalGastos(sumaGastos);
    setTotalVentasMenores(sumaVentasMenores);
    setLoading(false);
  };
  const totalEgresos = totalCompras + totalGastos;
  const baseInicialCalculada = base + totalEgresos - totalVentasMenores;

  // --- Función Historial Compras ---
  const handleFetchHistorialCompras = async () => {
    // ... (tu código sigue igual)
    setLoading(true);
    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);
    let compras = [];
    try {
      const q = query(collection(db, "compras"), where("fecha", ">=", startTimestamp), where("fecha", "<=", endTimestamp), orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => { const data = doc.data(); compras.push({ id: doc.id, ...data, fecha: data.fecha.toDate() }); });
      setHistorialCompras(compras);
    } catch (error) { console.error("Error al buscar historial: ", error); await showMessage("Error al buscar historial.", {
      title: 'Nasashe sas',
      type: 'warning'});
    }
    setLoading(false);
  };

  // --- Función Historial Ventas ---
  const handleFetchHistorialVentas = async () => {
    // ... (tu código sigue igual)
    setLoading(true);
    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);
    let ventas = [];
    try {
      const q = query(collection(db, "ventas"), where("fecha", ">=", startTimestamp), where("fecha", "<=", endTimestamp), orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => { const data = doc.data(); ventas.push({ id: doc.id, ...data, fecha: data.fecha.toDate() }); });
      setHistorialVentas(ventas);
    } catch (error) { console.error("Error al buscar historial de ventas: ", error); await showMessage("Error al buscar historial.", {
      title: 'Nasashe sas',
      type: 'error' 
    }); 
  }
    setLoading(false);
  };
  
  // --- Función Historial Ventas Menores ---
  const handleFetchHistorialVentasMenores = async () => {
    // ... (tu código sigue igual)
    setLoading(true);
    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);
    let ventas = [];
    try {
      const q = query(collection(db, "ventasMenores"), where("fecha", ">=", startTimestamp), where("fecha", "<=", endTimestamp), orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => { const data = doc.data(); ventas.push({ id: doc.id, ...data, fecha: data.fecha.toDate() }); });
      setHistorialVentasMenores(ventas);
    } catch (error) { console.error("Error al buscar historial de ventas menores: ", error); await showMessage("Error al buscar historial.", {
      title: 'Nasashe sas',
      type: 'error' // Puedes usar 'info', 'warning', o 'error'
    }); 
    }
    setLoading(false);
  };
  
  // --- Función Historial Gastos ---
  const handleFetchHistorialGastos = async () => {
    // ... (tu código sigue igual)
    setLoading(true);
    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);
    let gastos = [];
    try {
      const q = query(collection(db, "gastos"), where("fecha", ">=", startTimestamp), where("fecha", "<=", endTimestamp), orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => { const data = doc.data(); gastos.push({ id: doc.id, ...data, fecha: data.fecha.toDate() }); });
      setHistorialGastos(gastos);
    } catch (error) { console.error("Error al buscar historial de gastos: ", error); alert("Error al buscar historial."); }
    setLoading(false);
  };


  // --- Función Historial Remisiones ---
  const handleFetchHistorialRemisiones = async () => {
    setLoading(true);

    const consecutivoBusqueda = busquedaConsecutivoRemision.trim().toUpperCase();

    const inicio = new Date(parseDateString(remisionesFechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(remisionesFechaFin).setHours(23, 59, 59, 999));

    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    try {
      let querySnapshot;

      if (consecutivoBusqueda) {
        const q = query(collection(db, "remisiones"), where("consecutivo", "==", consecutivoBusqueda));
        querySnapshot = await getDocs(q);
      } else {
        const q = query(
          collection(db, "remisiones"),
          where("fecha", ">=", startTimestamp),
          where("fecha", "<=", endTimestamp),
          orderBy("fecha", "desc")
        );
        querySnapshot = await getDocs(q);
      }

      const remisiones = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date(),
        };
      });

      setHistorialRemisiones(remisiones);
    } catch (error) {
      console.error("Error al buscar historial de remisiones: ", error);
      alert("Error al buscar remisiones.");
    }

    setLoading(false);
  };




  // --- Funciones de Re-impresión ---

/*          // ¡ESTA ES LA NUEVA VERSIÓN!
          const handleReimprimirCompra = async (compra) => {
            if (!compra) return;

            // 1. Guardar los datos en localStorage (la nueva ventana leerá esto)
            //    JSON.stringify convierte el objeto en texto
            localStorage.setItem('ticketData', JSON.stringify(compra));
            localStorage.setItem('ticketUser', JSON.stringify(userProfile));
            localStorage.setItem('ticketType', 'compra'); // Le dice a la ventana qué ticket mostrar

            // 2. Crear una etiqueta única para la ventana
            //    (Esto evita que se abran 10 ventanas si el usuario hace clic rápido)
            const label = `ticket-compra-${compra.consecutivo.replace(/\s/g, '-')}`;

            // 3. Crear la ventana de Tauri
            const webview = new WebviewWindow(label, {
              url: '/imprimir', // La ruta que creamos en App.jsx
              title: `Ticket ${compra.consecutivo}`,
              width: 310, // Ancho de 80mm (aprox 302px) + márgenes
              height: 600,
              resizable: true,
              decorations: true, // Que tenga la barra de título
            });

            // 4. Manejar eventos
            webview.once('tauri://created', function () {
              console.log('Ventana de impresión creada');
            });
            webview.once('tauri://error', function (e) {
              console.error('Error al crear ventana de impresión:', e);
              alert('Error al abrir la ventana de impresión. ¿Reiniciaste la app (npm run tauri dev) después de cambiar los permisos?');
            });
            
          }; */



  /* const printCompraEnNavegador = (compraData) => {
    const textoTicket = generarTextoTicketCompra(compraData, userProfile);
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('El navegador bloqueó la ventana emergente del ticket. Habilita las ventanas emergentes e inténtalo nuevamente.');
      return;
    }
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Ticket ${compraData.consecutivo}</title><style>body { font-family: 'Courier New', Courier, monospace; font-size: 10px; width: 80mm; margin: 0; padding: 8px; } @page { margin: 2mm; size: 80mm auto; }</style></head><body><pre>${textoTicket}</pre><script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); window.onfocus = () => setTimeout(() => window.close(), 500); };</script></body></html>`);
    printWindow.document.close();
  }; */

  const imprimirTicketEnNavegador = (contenido, titulo) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><title>${titulo}</title><style>body { font-family: 'Courier New', Courier, monospace; font-size: 10px; width: 80mm; margin: 0; padding: 8px; } @page { margin: 2mm; size: 80mm auto; }</style></head><body><pre>${contenido}</pre></body></html>`);
    doc.close();

    const ejecutarImpresion = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 1000);
    };

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(ejecutarImpresion);
    } else {
      setTimeout(ejecutarImpresion, 0);
    }
  };

  const printCompraEnNavegador = (compraData) => {
    const textoTicket = generarTextoTicketCompra(compraData, userProfile);
    imprimirTicketEnNavegador(textoTicket, `Ticket ${compraData.consecutivo}`);
  };

  const printVentaEnNavegador = (ventaData) => {
    const textoTicket = generarTextoTicketVenta(ventaData, userProfile);
    imprimirTicketEnNavegador(textoTicket, `Ticket ${ventaData.consecutivo}`);
  };

  const printVentaMenorEnNavegador = (ventaData) => {
    const textoTicket = generarTextoTicketVentaMenor(ventaData, userProfile);
    imprimirTicketEnNavegador(textoTicket, `Ticket ${ventaData.consecutivo}`);
  };

  const printGastoEnNavegador = (gastoData) => {
    const textoTicket = generarTextoTicketGasto(gastoData, userProfile);
    imprimirTicketEnNavegador(textoTicket, `Comprobante ${gastoData.consecutivo}`);
  };

  const formatearFechaRemision = (fecha) => {
    if (!fecha) return '';
    return fecha instanceof Date ? fecha.toLocaleString('es-CO') : new Date(fecha).toLocaleString('es-CO');
  };

  const generarPdfRemision = async (remisionData) => {
    const doc = new jsPDF({ unit: 'mm', format: 'letter' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 12;
    let cursorY = margin;

    doc.setFontSize(16);
    doc.text('NASASHE S.A.S.', pageWidth / 2, cursorY + 6, { align: 'center' });
    doc.setFontSize(10);
    doc.text('901.907.763-3', pageWidth / 2, cursorY + 12, { align: 'center' });
    doc.text('Calle 98 9B 35', pageWidth / 2, cursorY + 18, { align: 'center' });
    doc.text('Tel: 3227377140', pageWidth / 2, cursorY + 24, { align: 'center' });

    doc.setFontSize(14);
    doc.text('REMISIÓN', pageWidth - margin, cursorY + 10, { align: 'right' });
    doc.setFontSize(12);
    doc.text(remisionData.consecutivo, pageWidth - margin, cursorY + 18, { align: 'right' });

    cursorY += 30;
    doc.setFontSize(11);
    doc.text(`Destino: ${remisionData.destino?.nombre || 'N/D'}`, margin, cursorY);
    doc.text(`Dirección: ${remisionData.destino?.direccion || 'N/D'}`, pageWidth / 2, cursorY);
    cursorY += 6;
    doc.text(`NIT: ${remisionData.destino?.nit || 'N/D'}`, margin, cursorY);
    doc.text(`Teléfono: ${remisionData.destino?.telefono || 'N/D'}`, pageWidth / 2, cursorY);
    cursorY += 10;

    doc.text(`Fecha emisión: ${formatearFechaRemision(remisionData.fecha)}`, margin, cursorY);
    cursorY += 6;
    doc.text(`Conductor: ${remisionData.conductor?.nombre || 'N/D'}`, margin, cursorY);
    doc.text(`Cédula: ${remisionData.conductor?.cedula || 'N/D'}`, pageWidth / 2, cursorY);
    cursorY += 6;
    doc.text(`Dirección: ${remisionData.conductor?.direccion || 'N/D'}`, margin, cursorY);
    cursorY += 6;
    doc.text(`Vínculo: ${remisionData.conductor?.vinculo || 'N/D'}`, margin, cursorY);
    doc.text(`Placa: ${remisionData.conductor?.placa || 'N/D'}`, pageWidth / 2, cursorY);
    cursorY += 6;
    doc.text(`Celular: ${remisionData.conductor?.celular || 'N/D'}`, margin, cursorY);

    cursorY += 6;
    if (remisionData.observaciones) {
      doc.text(`Observaciones: ${remisionData.observaciones}`, margin, cursorY);
      cursorY += 6;
    }

    autoTable(doc, {
      startY: cursorY + 4,
      head: [['Ítem', 'Detalle del material', 'Cantidad (Kg)']],
      body: (remisionData.items || []).map((item, idx) => [
        (idx + 1).toString(),
        item.nombre,
        (item.cantidad ?? 0).toLocaleString('es-CO'),
      ]),
      styles: { fontSize: 10, cellPadding: 2 },
      theme: 'grid',
      headStyles: { fillColor: [26, 71, 77] },
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 120 },
        2: { cellWidth: 30, halign: 'right' },
      },
      margin: { left: margin, right: margin },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.line(margin, finalY, pageWidth - margin, finalY);
    doc.text('Firma y sello quien diligencia', margin + 10, finalY + 8);
    doc.text('Firma Conductor', pageWidth / 2 - 10, finalY + 8);
    doc.text('Firma cliente y/or Recibidor', pageWidth - margin - 50, finalY + 8);

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i += 1) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );
    }

    return doc;
  };

  const handleReimprimirRemision = async (remisionData) => {
    try {
      const pdf = await generarPdfRemision(remisionData);
      const blobUrl = pdf.output('bloburl');
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error('Error al reimprimir la remisión:', error);
      alert('No se pudo generar el PDF de la remisión.');
    }
  };

  const prepararEImprimir = async (tipo, datos) => {
    if (!datos) return;

    const ejecutarFallback = () => {
      switch (tipo) {
        case 'compra':
          return printCompraEnNavegador(datos);
        case 'venta':
          return printVentaEnNavegador(datos);
        case 'ventaMenor':
          return printVentaMenorEnNavegador(datos);
        case 'gasto':
          return printGastoEnNavegador(datos);
        case 'inventario':
          return printInventarioEnNavegador(datos);
        default:
          console.warn(`Tipo de ticket no soportado para impresión en navegador: ${tipo}`);
      }
    };

    if (!isTauriEnvironment()) {
      ejecutarFallback();
      return;
    }

    try {
      localStorage.setItem('ticketData', JSON.stringify(datos));
      localStorage.setItem('ticketUser', JSON.stringify(userProfile));
      localStorage.setItem('ticketType', tipo);
    } catch (error) {
      console.error('Error al preparar datos para impresión:', error);
      ejecutarFallback();
      return;
    }

    const normalizarConsecutivo = (valor) =>
      (valor ? String(valor) : `${Date.now()}`).replace(/\s/g, '-');

    const consecutivoNormalizado = normalizarConsecutivo(datos.consecutivo);

    let label = `ticket-${tipo}-${consecutivoNormalizado}`;
    let tituloVentana = 'Impresión de ticket';

    if (tipo === 'gasto') {
      tituloVentana = `Comprobante ${datos.consecutivo || ''}`.trim();
    } else if (tipo === 'inventario') {
      tituloVentana = 'Reporte de Inventario';
    } else if (datos.consecutivo) {
      tituloVentana = `Ticket ${datos.consecutivo}`;
    }

    const webview = new WebviewWindow(label, {
      url: '/imprimir',
      title: tituloVentana,
      width: 310,
      height: 600,
      resizable: true,
      decorations: true,
    });

    webview.once('tauri://created', () => {
      console.log('Ventana de impresión creada');
    });

    webview.once('tauri://error', (e) => {
      console.error('Error al crear ventana de impresión:', e);
      ejecutarFallback();
    });
  };
  // --- FIN DE LA MODIFICACIÓN ---
  
  // --- Funciones de Inventario ---
  const handleFetchInventario = async () => {
    // ... (tu código sigue igual)
    setLoadingInventario(true);
    let inventarioLista = [];
    try {
      const q = query(collection(db, "articulos"), orderBy("nombre", "asc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => { inventarioLista.push({ id: doc.id, ...doc.data() }); });
      setInventario(inventarioLista);
    } catch (error) { console.error("Error al cargar inventario: ", error); await showMessage("Error al cargar inventario."), {
      title: 'Nasashe sas',
      type: 'error'}; 
    }
    setLoadingInventario(false);
  };

  const handleExportarPDF = async () => {
    if (inventario.length === 0) {
      await showMessage("No hay datos de inventario para exportar." , {
        title: 'Nasashe sas',
        type: 'warning'});
      return;
    }

    const doc = new jsPDF();
    doc.text("Reporte de Inventario Actual", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado por: ${userProfile?.nombre || 'SISTEMA'}`, 14, 20);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 14, 25);

    const tableColumn = ["Nombre", "Precio Compra ($)", "Stock Actual (kg/und)"];
    const tableRows = [];

    inventario.forEach((item) => {
      const precioCompra = Number(item?.precioCompra ?? 0);
      const stockActual = Number(item?.stock ?? 0);
      const itemData = [
        item?.nombre || 'Sin nombre',
        precioCompra.toLocaleString('es-CO'),
        stockActual.toLocaleString('es-CO'),
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });

    const fechaHoy = new Date().toISOString().split('T')[0];

    try {
      doc.save(`Reporte_Inventario_${fechaHoy}.pdf`);
      await showMessage('Su archivo se exportó con éxito en la carpeta de descargas.' , {
        title: 'Nasashe sas',
        type: 'info'});
    } 
    catch (error) {
      console.error('Error al exportar el inventario a PDF:', error);
      await showMessage('Ocurrió un error al exportar el PDF. Por favor, inténtalo de nuevo.' , {
        title: 'Nasashe sas',
        type: 'error'});
    }
  };

  const printInventarioEnNavegador = async (payload) => {
    const itemsParaImprimir = Array.isArray(payload?.items) && payload.items.length > 0
      ? payload.items
      : inventario;

    if (!itemsParaImprimir || itemsParaImprimir.length === 0) {
      await showMessage('No hay datos de inventario para imprimir.' , {
        title: 'Nasashe sas',
        type: 'warning'});
      return;
    }

    const textoTicket = generarTextoTicketInventario(itemsParaImprimir, userProfile);
    const htmlTicket = `<!DOCTYPE html><html><head><title>Reporte Inventario</title><style>body { font-family: 'Courier New', Courier, monospace; font-size: 10px; width: 80mm; margin: 0; padding: 8px; } @page { margin: 2mm; size: 80mm auto; }</style></head><body><pre>${textoTicket}</pre></body></html>`;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const handleAfterPrint = () => {
      setTimeout(() => {
        if (printFrame.parentNode) {
          printFrame.parentNode.removeChild(printFrame);
        }
      }, 500);
    };

    printFrame.onload = () => {
      const frameWindow = printFrame.contentWindow;
      if (frameWindow) {
        frameWindow.focus();
        frameWindow.print();
        frameWindow.onafterprint = handleAfterPrint;
        setTimeout(handleAfterPrint, 5000);
      } else {
        handleAfterPrint();
      }
    };

    printFrame.srcdoc = htmlTicket;
  };

  
  // (Esta función de inventario seguirá fallando hasta que la actualicemos)
  //            const handleImprimirInventario = () => {
  //               if (inventario.length === 0) { alert("No hay datos de inventario para imprimir."); return; }
    
    /* // --- CÓDIGO ANTIGUO COMENTADO (generarTextoTicketInventario) ---
    const textoTicket = generarTextoTicketInventario(inventario, userProfile); 
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Reporte Inventario</title><style>body { font-family: 'Courier New', Courier, monospace; font-size: 10px; width: 80mm; } @page { margin: 2mm; size: 80mm auto; }</style></head><body><pre>${textoTicket}</pre><script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); window.onfocus = () => setTimeout(() => window.close(), 500); };</script></body></html>`);
    printWindow.document.close();
    */
    
    // --- CÓDIGO NUEVO (Aún por implementar) ---
    // En la próxima respuesta, reemplazaremos la lógica comentada de arriba
    // con la lógica de WebviewWindow, igual que handleReimprimirCompra
    // alert("Función de imprimir inventario pendiente de actualizar a WebviewWindow.");

  //};

  const handleImprimirInventario = async () => {
    if (inventario.length === 0) {
      await showMessage('No hay datos de inventario para imprimir.', {
        title: 'Nasashe sas',
        type: 'error'});
      return;
    }

    const ticketPayload = {
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
      printInventarioEnNavegador(ticketPayload);
    }
  };

  // --- Función de Análisis ---
  const handleGenerateAnalisis = async () => {
    // ... (tu código sigue igual)
    setLoading(true);
    setAnalisisData(null); 
    const inicio = new Date(parseDateString(fechaInicio).setHours(0, 0, 0, 0));
    const fin = new Date(parseDateString(fechaFin).setHours(23, 59, 59, 999));
    const startTimestamp = Timestamp.fromDate(inicio);
    const endTimestamp = Timestamp.fromDate(fin);

    const agregador = {};

    try {
      const qCompras = query(collection(db, "compras"), 
        where("fecha", ">=", startTimestamp), 
        where("fecha", "<=", endTimestamp)
      );
      const comprasSnap = await getDocs(qCompras);
      
      comprasSnap.forEach(doc => {
        const items = doc.data().items;
        items.forEach(item => {
          agregador[item.nombre] = (agregador[item.nombre] || 0) + item.cantidad;
        });
      });

      const labels = Object.keys(agregador);
      const data = Object.values(agregador);

      if (labels.length === 0) {
        setAnalisisData({ labels: [], datasets: [] });
      } else {
        setAnalisisData({
          labels: labels,
          datasets: [
            {
              label: 'Total Comprado (kg/und)',
              data: data,
              backgroundColor: 'rgba(220, 53, 69, 0.6)',
              borderColor: 'rgba(220, 53, 69, 1)',
              borderWidth: 1,
              minBarLength: 8,
            },
          ],
        });
      }

    } catch (error) {
      console.error("Error al generar análisis: ", error);
      await showMessage("Error al generar análisis.", {
        title: 'Error de analisis',
        type: 'error'});
    }
    setLoading(false);
  };


  return (
    <div className="pagina-reportes">
      <h1>Módulo de Reportes</h1>
      
      {/* --- Pestañas --- */}
      <div className="tabs-container">
        {/* ... (tus botones de pestañas siguen igual) ... */}
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
        <button className={`tab-button ${activeTab === 'inventario' ? 'active' : ''}`} onClick={() => setActiveTab('inventario')}>
          Inventario
        </button>
        <button className={`tab-button ${activeTab === 'analisis' ? 'active' : ''}`} onClick={() => setActiveTab('analisis')}>
          Análisis de Materiales
        </button>
      </div>

      <div className="tab-content">

        {/* --- PESTAÑA 1: CIERRE DE CAJA --- */}
        {activeTab === 'cierre' && (
          // ... (tu código de cierre sigue igual)
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-cierre">Seleccione la fecha:</label>
              <input type="date" id="fecha-cierre" value={fechaCierre} onChange={(e) => setFechaCierre(e.target.value)} />
              <button onClick={handleGenerateCierre} className="btn-generar" disabled={loading}>
                {loading ? "Calculando..." : "Generar Cierre"}
              </button>
            </div>
            <h2>Resumen del Día ({fechaCierre})</h2>
            <div className="reporte-grid">
              <div className="summary-card card-ingresos"><h3>(+) Total Ventas Menores</h3><div className="monto">${totalVentasMenores.toLocaleString('es-CO')}</div></div>
              <div className="summary-card card-egresos"><h3>(-) Total Compras</h3><div className="monto">${totalCompras.toLocaleString('es-CO')}</div></div>
              <div className="summary-card card-egresos"><h3>(-) Total Gastos</h3><div className="monto">${totalGastos.toLocaleString('es-CO')}</div></div>
              <div className="summary-card card-base"><h3>(=) Efectivo Actual en Caja</h3><div className="monto">${base.toLocaleString('es-CO')}</div></div>
              <div className="summary-card card-calculada"><h3>(=) Base Inicial (Calculada)</h3><div className="monto">${baseInicialCalculada.toLocaleString('es-CO')}</div></div>
            </div>
          </div>
        )}

        {/* --- PESTAÑA 2: HISTORIAL COMPRAS --- */}
        {activeTab === 'historialCompras' && (
          <div>
            <div className="reporte-controles">
              {/* ... (controles de fecha) ... */}
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <button onClick={handleFetchHistorialCompras} className="btn-generar" disabled={loading}>
                {loading ? "Buscando..." : "Buscar Compras"}
              </button>
            </div>
            <h2>Historial de Compras</h2>
            <table className="historial-table">
              <thead>
                <tr><th>Fecha</th><th>Consecutivo</th><th>Reciclador</th><th>Total</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {loading ? ( <tr><td colSpan="5" style={{textAlign: 'center'}}>Buscando...</td></tr>
                ) : historialCompras.length === 0 ? ( <tr><td colSpan="5" style={{textAlign: 'center'}}>No se encontraron compras.</td></tr>
                ) : (
                  historialCompras.map(compra => (
                    <tr key={compra.id}>
                      <td>{compra.fecha.toLocaleString('es-CO')}</td>
                      <td>{compra.consecutivo}</td>
                      <td>{compra.reciclador}</td>
                      <td>${compra.total.toLocaleString('es-CO')}</td>
                      <td>
                        {/* ¡Este botón ahora usa la nueva función! */}
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
        
        {/* --- PESTAÑA 3: HISTORIAL VENTAS --- */}
        {activeTab === 'historialVentas' && (
          // ... (tu código de Hist. Ventas sigue igual)
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <button onClick={handleFetchHistorialVentas} className="btn-generar" disabled={loading}>
                {loading ? "Buscando..." : "Buscar Ventas"}
              </button>
            </div>
            <h2>Historial de Ventas (a Proveedores)</h2>
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Consecutivo</th>
                  <th>Cliente (Proveedor)</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? ( <tr><td colSpan="5" style={{textAlign: 'center'}}>Buscando...</td></tr>
                ) : historialVentas.length === 0 ? ( <tr><td colSpan="5" style={{textAlign: 'center'}}>No se encontraron ventas.</td></tr>
                ) : (
                  historialVentas.map(venta => (
                    <tr key={venta.id}>
                      <td>{venta.fecha.toLocaleString('es-CO')}</td>
                      <td>{venta.consecutivo}</td>
                      <td>{venta.proveedor.nombre}</td>
                      <td>${venta.total.toLocaleString('es-CO')}</td>
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
        
        {/* --- PESTAÑA 4: HISTORIAL VENTAS MENORES --- */}
        {activeTab === 'historialVentasMenores' && (
          // ... (tu código de Hist. Ventas Menores sigue igual)
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.g.value)} />
              <button onClick={handleFetchHistorialVentasMenores} className="btn-generar" disabled={loading}>
                {loading ? "Buscando..." : "Buscar Ventas Menores"}
              </button>
            </div>
            <h2>Historial de Ventas Menores (a Particulares)</h2>
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Consecutivo</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? ( <tr><td colSpan="5" style={{textAlign: 'center'}}>Buscando...</td></tr>
                ) : historialVentasMenores.length === 0 ? ( <tr><td colSpan="5" style={{textAlign: 'center'}}>No se encontraron ventas.</td></tr>
                ) : (
                  historialVentasMenores.map(venta => (
                    <tr key={venta.id}>
                      <td>{venta.fecha.toLocaleString('es-CO')}</td>
                      <td>{venta.consecutivo}</td>
                      <td>{venta.cliente}</td>
                      <td>${venta.total.toLocaleString('es-CO')}</td>
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
        
        {/* --- PESTAÑA 5: HISTORIAL GASTOS --- */}
        {activeTab === 'historialGastos' && (
          // ... (tu código de Hist. Gastos sigue igual)
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <button onClick={handleFetchHistorialGastos} className="btn-generar" disabled={loading}>
                {loading ? "Buscando..." : "Buscar Gastos"}
              </button>
            </div>
            <h2>Historial de Gastos</h2>
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Consecutivo</th>
                  <th>Concepto</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? ( <tr><td colSpan="6" style={{textAlign: 'center'}}>Buscando...</td></tr>
                ) : historialGastos.length === 0 ? ( <tr><td colSpan="6" style={{textAlign: 'center'}}>No se encontraron gastos.</td></tr>
                ) : (
                  historialGastos.map(gasto => (
                    <tr key={gasto.id}>
                      <td>{gasto.fecha.toLocaleString('es-CO')}</td>
                      <td>{gasto.consecutivo}</td>
                      <td>{gasto.concepto}</td>
                      <td>{gasto.descripcion}</td>
                      <td>${gasto.monto.toLocaleString('es-CO')}</td>
                      <td>
                      <button onClick={() => prepararEImprimir('gasto', gasto, userProfile)} className="btn-reimprimir">
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

        {/* --- PESTAÑA 6: HISTORIAL REMISIONES --- */}
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
                {loading ? "Buscando..." : "Buscar Remisiones"}
              </button>
            </div>

            <h2>Historial de Remisiones</h2>
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Consecutivo</th>
                  <th>Destino</th>
                  <th>Conductor</th>
                  <th>Items</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>Buscando...</td></tr>
                ) : historialRemisiones.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>No se encontraron remisiones.</td></tr>
                ) : (
                  historialRemisiones.map((remision) => (
                    <tr key={remision.id}>
                      <td>{formatearFechaRemision(remision.fecha)}</td>
                      <td>{remision.consecutivo}</td>
                      <td>{remision.destino?.nombre || 'N/D'}</td>
                      <td>{remision.conductor?.nombre || 'N/D'}</td>
                      <td>{Array.isArray(remision.items) ? remision.items.length : 0}</td>
                      <td>
                        <button onClick={() => handleReimprimirRemision(remision)} className="btn-reimprimir">
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

        {/* --- PESTAÑA 8: ANÁLISIS --- */}
        {activeTab === 'analisis' && (
          // ... (tu código de Análisis sigue igual)
          <div>
            <div className="inventario-header">
              <h2>Reporte de Inventario Actual</h2>
              <div className="inventario-header-botones">
                <button onClick={handleFetchInventario} className="btn-generar" disabled={loadingInventario}>
                  {loadingInventario ? "Cargando..." : "Cargar Inventario"}
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
                  <tr><td colSpan="3" style={{textAlign: 'center'}}>Cargando...</td></tr>
                ) : inventario.length === 0 ? (
                  <tr><td colSpan="3" style={{textAlign: 'center'}}>No se encontró inventario.</td></tr>
                ) : (
                  inventario.map(item => (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>${item.precioCompra.toLocaleString('es-CO')}</td>
                      <td>{(Number(item.stock) || 0).toFixed(2)}</td> 
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* --- PESTAÑA 7: ANÁLISIS --- */}
        {activeTab === 'analisis' && (
          // ... (tu código de Análisis sigue igual)
          <div>
            <div className="reporte-controles">
              <label htmlFor="fecha-inicio">Desde:</label>
              <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <label htmlFor="fecha-fin">Hasta:</label>
              <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
              <label className="checkbox-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={usarEscalaLogaritmica}
                  onChange={(e) => setUsarEscalaLogaritmica(e.target.checked)}
                />
                Usar escala logarítmica
              </label>
              <button onClick={handleGenerateAnalisis} className="btn-generar" disabled={loading}>
                {loading ? "Generando..." : "Generar Análisis"}
              </button>
            </div>
            
            <h2>Análisis de Materiales Comprados (por Cantidad)</h2>
            
            <div className="chart-container">
              {loading ? (
                <p>Generando gráfica...</p>
              ) : analisisData ? (
                (analisisData.labels.length > 0 ? (
                  <GraficaBarras
                    chartData={analisisData}
                    titulo={`Materiales Comprados (${fechaInicio} a ${fechaFin})`}
                    useLogScale={usarEscalaLogaritmica}
                  />
                ) : (
                  <p>No se encontraron datos de compras para este rango de fechas.</p>
                ))
              ) : (
                <p>Seleccione un rango de fechas y haga clic en "Generar Análisis" para ver la gráfica.</p>
              )}
            </div>
          </div>
        )}
        
      </div>
      
      {/* --- CÓDIGO ANTIGUO COMENTADO (Contenedor invisible) --- */}
      {/* <div className="inventario-print-container">
        <TicketInventario ref={inventarioPrintRef} inventario={inventario} />
      </div>
      */}

      {/* --- ¡PASO 4: AÑADIR EL ÁREA DE IMPRESIÓN! --- */}
      {/* --- FIN DEL PASO 4 --- */}
      
    </div>
  );
}


export default PaginaReportes;
