// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import { useCaja } from './context/CajaContext';

import Dashboard from './pages/Dashboard';
import PaginaLogin from './pages/PaginaLogin';

import PaginaCompras from './pages/PaginaCompras';
import PaginaGastos from './pages/PaginaGastos';
import PaginaVentas from './pages/PaginaVentas';
import PaginaVentasMenores from './pages/PaginaVentasMenores';

import PaginaArticulos from './pages/PaginaArticulos';
import PaginaProveedores from './pages/PaginaProveedores';
import PaginaUsuarios from './pages/PaginaUsuarios';
import PaginaConfiguracion from './pages/PaginaConfiguracion';

import PaginaReportes from './pages/PaginaReportes';
import PaginaRemisiones from './pages/PaginaRemisiones';
import PaginaImpresion from './pages/PaginaImpresion';

function App() {
  const { currentUser, loadingAuth } = useCaja();

  if (loadingAuth) return null;

  // ✅ SI NO HAY SESIÓN: solo permitimos /login
  if (!currentUser) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          {/* Cualquier otra ruta manda a /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  // ✅ SI HAY SESIÓN: app normal
  return (
    <>
      <Header />

      <Routes>
        {/* si ya está logueado y entra a /login, mandarlo al dashboard */}
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route path="/" element={<Dashboard />} />

        <Route path="/compras" element={<PaginaCompras />} />
        <Route path="/gastos" element={<PaginaGastos />} />
        <Route path="/ventas" element={<PaginaVentas />} />
        <Route path="/ventas-menores" element={<PaginaVentasMenores />} />

        <Route path="/articulos" element={<PaginaArticulos />} />
        <Route path="/proveedores" element={<PaginaProveedores />} />
        <Route path="/usuarios" element={<PaginaUsuarios />} />
        <Route path="/configuracion" element={<PaginaConfiguracion />} />

        <Route path="/reportes" element={<PaginaReportes />} />
        <Route path="/remisiones" element={<PaginaRemisiones />} />

        <Route path="/imprimir" element={<PaginaImpresion />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
