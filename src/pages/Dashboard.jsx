// src/pages/Dashboard.jsx

import React from 'react'
import './Dashboard.css'
import ModuleButton from '../components/ModuleButton'
import { useCaja } from '../context/CajaContext'

// ✅ BASE_URL para GitHub Pages
const BASE = import.meta.env.BASE_URL

function Dashboard() {
  const { userProfile } = useCaja()
  const esAdmin = userProfile?.rol === 'admin'

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Bienvenido(a) a NASASHE. ¡Haz clic en algún módulo para empezar!
      </h1>

      <div className="dashboard-grid">

        {/* --- BOTONES SOLO PARA ADMIN --- */}
        {esAdmin && (
          <>
            <ModuleButton
              titulo="Artículos"
              descripcion="Gestionar inventario, precios y categorías."
              icono={`${BASE}icons/Artículos.png`}
              to="/articulos"
            />

            <ModuleButton
              titulo="Proveedores"
              descripcion="Administrar lista de proveedores y cuentas."
              icono={`${BASE}icons/Proveedores.png`}
              to="/proveedores"
            />

            <ModuleButton
              titulo="Ventas"
              descripcion="Crear facturas de venta a proveedores."
              icono={`${BASE}icons/Ventas (F2).png`}
              to="/ventas"
            />

            <ModuleButton
              titulo="Remisiones"
              descripcion="Emitir remisiones y generar PDF firmado."
              icono={`${BASE}icons/Remisiones.png`}
              to="/remisiones"
            />

            <ModuleButton
              titulo="Usuarios"
              descripcion="Gestionar cuentas de empleados."
              icono={`${BASE}icons/usuarios.png`}
              to="/usuarios"
            />

            <ModuleButton
              titulo="Configuración"
              descripcion="Restablecer consecutivos y ajustes generales."
              icono={`${BASE}icons/CONFIG.png`}
              to="/configuracion"
            />
          </>
        )}

        {/* --- BOTONES PARA TODOS --- */}
        <ModuleButton
          titulo="Reportes"
          descripcion="Ver resúmenes de ventas, caja e inventario."
          icono={`${BASE}icons/Reportes.png`}
          to="/reportes"
        />

        <ModuleButton
          titulo="Compras"
          descripcion="Registrar compras a recicladores."
          icono={`${BASE}icons/Compras.png`}
          to="/compras"
        />

        <ModuleButton
          titulo="Gastos"
          descripcion="Registrar salidas de efectivo (ej. comida)."
          icono={`${BASE}icons/gastos.png`}
          to="/gastos"
        />

        <ModuleButton
          titulo="Venta Menor"
          descripcion="Registrar ventas a particulares (ej. tubos)."
          icono={`${BASE}icons/ventas-menores.png`}
          to="/ventas-menores"
        />

      </div>
    </div>
  )
}

export default Dashboard
