import { isTauri } from '../tauriSafe'; 
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import React, { useState, useEffect, useRef } from 'react'; 
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
  generarTextoTicketVenta,
  generarTextoTicketVentaMenor,
  generarTextoTicketGasto 
} from '../utils/generarTickets'; 

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import GraficaBarras from '../components/GraficaBarras';
import { useReactToPrint } from 'react-to-print';

const [activeTab, setActiveTab] = useState('cierre'); // Estado para manejar las pestañas activas

// Función para obtener la fecha actual en formato ISO
const getTodayDate = () => new Date().toISOString().split('T')[0];

// Función para parsear una fecha en formato 'YYYY-MM-DD' a un objeto Date
const parseDateString = (dateString) => {
  const parts = dateString.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]); 
};

// Paso 1: La función handleFetchInventario
// Lógica de carga de inventario
  const handleFetchInventario = async () => {
    setLoadingInventario(true);
    if (navigator.onLine) {
      try {
        const q = query(collection(db, "inventario"));
        const querySnapshot = await getDocs(q);
        const inventarioData = [];
        querySnapshot.forEach((doc) => {
          inventarioData.push({ id: doc.id, ...doc.data() });
        });
        setInventario(inventarioData);
        localStorage.setItem('inventarioData', JSON.stringify(inventarioData));
      } catch (error) {
        console.error("Error al cargar el inventario desde Firebase: ", error);
      }
    } else {
      const localInventario = JSON.parse(localStorage.getItem('inventarioData'));
      if (localInventario) {
        setInventario(localInventario);
      } else {
        alert("No hay conexión y no se han guardado datos de inventario previamente.");
      }
    }
    setLoadingInventario(false);
  };


  // Paso 2: El useEffect que se activa cuando se cambia a la pestaña "Inventario"
  useEffect(() => {
    if (activeTab === 'inventario') {
      handleFetchInventario(); // Llama a la función cuando la pestaña de Inventario esté activa
    }
  }, [activeTab]); // Dependencia de activeTab para que solo se ejecute cuando se cambie la pestaña

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
});

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
    const stock = item.stock.toString();
    contenido += nombre.padEnd(30) + stock.padStart(15) + "\n";
  });
  contenido += "-".repeat(ancho) + "\n";
  contenido += `Total de Artículos: ${inventario.length}\n`;
  contenido += "-".repeat(ancho) + "\n";
  return contenido;
};

function PaginaReportes() {
  const { base, userProfile } = useCaja();
  
  const [activeTab, setActiveTab] = useState('cierre');
  const [loading, setLoading] = useState(false);

  const [fechaCierre, setFechaCierre] = useState(getTodayDate);
  const [totalCompras, setTotalCompras] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalVentasMenores, setTotalVentasMenores] = useState(0);

  const [fechaInicio, setFechaInicio] = useState(getTodayDate);
  const [fechaFin, setFechaFin] = useState(getTodayDate);
  const [historialCompras, setHistorialCompras] = useState([]);
  const [historialVentas, setHistorialVentas] = useState([]);
  const [historialVentasMenores, setHistorialVentasMenores] = useState([]);
  const [historialGastos, setHistorialGastos] = useState([]);

  const [inventario, setInventario] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(false);
  
  const inventarioPrintRef = useRef(null);
  const handlePrintInventario = useReactToPrint({
    content: () => inventarioPrintRef.current,
  });

  const [analisisData, setAnalisisData] = useState(null);
 
  // Definir el estado de activeTab
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const parseDateString = (dateString) => {
    const parts = dateString.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]); 
  };



  const handleGenerateCierre = async () => {
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
    } catch (error) { console.error("Error al generar el reporte: ", error); alert("Error al generar el reporte."); }
    setTotalCompras(sumaCompras);
    setTotalGastos(sumaGastos);
    setTotalVentasMenores(sumaVentasMenores);
    setLoading(false);
  };

  const totalEgresos = totalCompras + totalGastos;
  const baseInicialCalculada = base + totalEgresos - totalVentasMenores;

  // Las funciones de historial, reimpresión y otros ya estaban definidas antes, las puedes dejar igual aquí

  return (
    <div className="pagina-reportes">
      <h1>Módulo de Reportes</h1>

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
        {/* Controles para seleccionar fechas y buscar compras */}
        <label htmlFor="fecha-inicio">Desde:</label>
        <input 
          type="date" 
          id="fecha-inicio" 
          value={fechaInicio} 
          onChange={(e) => setFechaInicio(e.target.value)} 
        />
        
        <label htmlFor="fecha-fin">Hasta:</label>
        <input 
          type="date" 
          id="fecha-fin" 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)} 
        />
        
        <button 
          onClick={handleFetchHistorialCompras} 
          className="btn-generar" 
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar Compras"}
        </button>
      </div>

      <h2>Historial de Compras</h2>
      <table className="historial-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Consecutivo</th>
            <th>Reciclador</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Buscando...</td>
            </tr>
          ) : historialCompras.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron compras.</td>
            </tr>
          ) : (
            historialCompras.map(compra => (
              <tr key={compra.id}>
                <td>{compra.fecha.toLocaleString('es-CO')}</td>
                <td>{compra.consecutivo}</td>
                <td>{compra.reciclador}</td>
                <td>${compra.total.toLocaleString('es-CO')}</td>
                <td>
                  <button 
                    onClick={() => handleReimprimirCompra(compra)} 
                    className="btn-reimprimir"
                  >
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
    <div>
      <div className="reporte-controles">
        {/* Controles para seleccionar fechas y buscar ventas */}
        <label htmlFor="fecha-inicio">Desde:</label>
        <input 
          type="date" 
          id="fecha-inicio" 
          value={fechaInicio} 
          onChange={(e) => setFechaInicio(e.target.value)} 
        />
        
        <label htmlFor="fecha-fin">Hasta:</label>
        <input 
          type="date" 
          id="fecha-fin" 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)} 
        />
        
        <button 
          onClick={handleFetchHistorialVentas} 
          className="btn-generar" 
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar Ventas"}
        </button>
      </div>

      <h2>Historial de Ventas</h2>
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
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Buscando...</td>
            </tr>
          ) : historialVentas.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron ventas.</td>
            </tr>
          ) : (
            historialVentas.map(venta => (
              <tr key={venta.id}>
                <td>{venta.fecha.toLocaleString('es-CO')}</td>
                <td>{venta.consecutivo}</td>
                <td>{venta.proveedor.nombre}</td>
                <td>${venta.total.toLocaleString('es-CO')}</td>
                <td>
                  <button 
                    onClick={() => handleReimprimirVenta(venta)} 
                    className="btn-reimprimir"
                  >
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
    <div>
      <div className="reporte-controles">
        {/* Controles para seleccionar fechas y buscar ventas menores */}
        <label htmlFor="fecha-inicio">Desde:</label>
        <input 
          type="date" 
          id="fecha-inicio" 
          value={fechaInicio} 
          onChange={(e) => setFechaInicio(e.target.value)} 
        />
        
        <label htmlFor="fecha-fin">Hasta:</label>
        <input 
          type="date" 
          id="fecha-fin" 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)} 
        />
        
        <button 
          onClick={handleFetchHistorialVentasMenores} 
          className="btn-generar" 
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar Ventas Menores"}
        </button>
      </div>

      <h2>Historial de Ventas Menores</h2>
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
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Buscando...</td>
            </tr>
          ) : historialVentasMenores.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No se encontraron ventas menores.</td>
            </tr>
          ) : (
            historialVentasMenores.map(venta => (
              <tr key={venta.id}>
                <td>{venta.fecha.toLocaleString('es-CO')}</td>
                <td>{venta.consecutivo}</td>
                <td>{venta.cliente}</td>
                <td>${venta.total.toLocaleString('es-CO')}</td>
                <td>
                  <button 
                    onClick={() => handleReimprimirVentaMenor(venta)} 
                    className="btn-reimprimir"
                  >
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
    <div>
      <div className="reporte-controles">
        {/* Controles para seleccionar fechas y buscar gastos */}
        <label htmlFor="fecha-inicio">Desde:</label>
        <input 
          type="date" 
          id="fecha-inicio" 
          value={fechaInicio} 
          onChange={(e) => setFechaInicio(e.target.value)} 
        />
        
        <label htmlFor="fecha-fin">Hasta:</label>
        <input 
          type="date" 
          id="fecha-fin" 
          value={fechaFin} 
          onChange={(e) => setFechaFin(e.target.value)} 
        />
        
        <button 
          onClick={handleFetchHistorialGastos} 
          className="btn-generar" 
          disabled={loading}
        >
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
          {loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Buscando...</td>
            </tr>
          ) : historialGastos.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No se encontraron gastos.</td>
            </tr>
          ) : (
            historialGastos.map(gasto => (
              <tr key={gasto.id}>
                <td>{gasto.fecha.toLocaleString('es-CO')}</td>
                <td>{gasto.consecutivo}</td>
                <td>{gasto.concepto}</td>
                <td>{gasto.descripcion}</td>
                <td>${gasto.monto.toLocaleString('es-CO')}</td>
                <td>
                  <button 
                    onClick={() => handleReimprimirGasto(gasto)} 
                    className="btn-reimprimir"
                  >
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

  {/* --- PESTAÑA 6: INVENTARIO --- */}
  {activeTab === 'inventario' && (
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
            Imprimir (8cm)
          </button>
        </div>
      </div>

      {/* Mostrar el inventario en una tabla */}
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
                <td>${item.precioCompra.toLocaleString('es-CO')}</td>
                <td>{item.stock}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )}


        {/* Aquí irían las otras pestañas de ventas, gastos, inventario, análisis */}
      </div>
    </div>
  );
}

export default PaginaReportes;


