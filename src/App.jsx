// src/App.jsx

import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './components/MainLayout';

// IMPORTAMOS las páginas
import Dashboard from './pages/Dashboard';
import PaginaArticulos from './pages/PaginaArticulos';
import PaginaProveedores from './pages/PaginaProveedores';
import PaginaCompras from './pages/PaginaCompras';
import PaginaVentas from './pages/PaginaVentas';
import PaginaGastos from './pages/PaginaGastos';
import PaginaReportes from './pages/PaginaReportes';
import PaginaLogin from './pages/PaginaLogin';
import PaginaVentasMenores from './pages/PaginaVentasMenores';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaRemisiones from './pages/PaginaRemisiones';

// --- ¡PASO 3.1: AÑADE ESTA LÍNEA! ---
import PaginaImpresion from './pages/PaginaImpresion';
import PaginaConfiguracion from './pages/PaginaConfiguracion';


function App() {
  return (
    <Routes>
      
      {/* --- RUTAS PÚBLICAS Y DE UTILIDAD --- */}
      <Route element={<Outlet />}>
        <Route path="/login" element={<PaginaLogin />} />
        
        {/* --- ¡PASO 3.2: AÑADE ESTA LÍNEA! --- */}
        <Route path="/imprimir" element={<PaginaImpresion />} />
        
      </Route>

      {/* --- RUTAS PRIVADAS (Protegidas) --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/articulos" element={<PaginaArticulos />} />
        <Route path="/proveedores" element={<PaginaProveedores />} />
        <Route path="/compras" element={<PaginaCompras />} />
        <Route path="/ventas" element={<PaginaVentas />} />
        <Route path="/gastos" element={<PaginaGastos />} />
        <Route path="/reportes" element={<PaginaReportes />} />
        <Route path="/ventas-menores" element={<PaginaVentasMenores />} />
        <Route path="/usuarios" element={<PaginaUsuarios />} />
        <Route path="/remisiones" element={<PaginaRemisiones />} />
        <Route path="/configuracion" element={<PaginaConfiguracion />} />
      </Route>

    </Routes>
  );
}

export default App;
