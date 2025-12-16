// src/App.jsx

import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";

// Páginas
import Dashboard from "./pages/Dashboard";
import PaginaLogin from "./pages/PaginaLogin";
import PaginaArticulos from "./pages/PaginaArticulos";
import PaginaProveedores from "./pages/PaginaProveedores";
import PaginaCompras from "./pages/PaginaCompras";
import PaginaVentas from "./pages/PaginaVentas";
import PaginaGastos from "./pages/PaginaGastos";
import PaginaReportes from "./pages/PaginaReportes";
import PaginaVentasMenores from "./pages/PaginaVentasMenores";
import PaginaUsuarios from "./pages/PaginaUsuarios";
import PaginaRemisiones from "./pages/PaginaRemisiones";
import PaginaConfiguracion from "./pages/PaginaConfiguracion";
import PaginaImpresion from "./pages/PaginaImpresion";

function App() {
  return (
    <Routes>

      {/* 🔓 RUTA PÚBLICA */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* 🔒 RUTAS PROTEGIDAS */}
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

      {/* Ruta auxiliar */}
      <Route path="/imprimir" element={<PaginaImpresion />} />

    </Routes>
  );
}

export default App;
