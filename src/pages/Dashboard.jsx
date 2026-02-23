// src/pages/Dashboard.jsx

import React from 'react';
import './Dashboard.css';
import ModuleButton from '../components/ModuleButton';
import { useCaja } from '../context/CajaContext';

function Dashboard() {

  const { userProfile } = useCaja();
  const esAdmin = userProfile?.rol === 'admin';

  return (
    <div className="dashboard-container">
      
      <h1 className="dashboard-title">
        Bienvenido(a) a NASASHE. ¡Haz clic en algún módulo para empezar!
      </h1>
      
      <div className="dashboard-grid">
        
        {/* --- 3. BOTONES SOLO PARA ADMIN --- */}
        {esAdmin && (
          <>
            <ModuleButton 
              titulo="Artículos"
              descripcion="Gestionar inventario, precios y categorías."
              icono="/icons/Artículos.png"
              to="/articulos" // <-- VERIFICA ESTA LÍNEA
            />
            
            <ModuleButton 
              titulo="Proveedores"
              descripcion="Administrar lista de proveedores y cuentas."
              icono="/icons/Proveedores.png"
              to="/proveedores"
            />

            <ModuleButton
              titulo="Ventas"
              descripcion="Crear facturas de venta a proveedores."
              icono="/icons/Ventas (F2).png"
              to="/ventas"
            />

            <ModuleButton
              titulo="Remisiones"
              descripcion="Emitir remisiones y generar PDF firmado."
              icono="/icons/Remisiones.png"
              to="/remisiones"
            />

            <ModuleButton
              titulo="Usuarios"
              descripcion="Gestionar cuentas de empleados."
              icono="/icons/usuarios.png"
              to="/usuarios"
            />

            <ModuleButton
              titulo="Configuración"
              descripcion="Restablecer consecutivos y ajustes generales."
              icono="/icons/CONFIG.png"
              to="/configuracion"
            />
          </>
        )}
        
        {/* --- 4. BOTONES PARA TODOS --- */}
        <ModuleButton 
          titulo="Reportes"
          descripcion="Ver resúmenes de ventas, caja e inventario."
          icono="/icons/Reportes.png"
          to="/reportes"
        />
        <ModuleButton 
          titulo="Compras"
          descripcion="Registrar compras a recicladores."
          icono="/icons/Compras.png"
          to="/compras"
        />
        <ModuleButton 
          titulo="Gastos"
          descripcion="Registrar salidas de efectivo (ej. comida)."
          icono="/icons/gastos.png"
          to="/gastos"
        />
        <ModuleButton 
          titulo="Venta Menor"
          descripcion="Registrar ventas a particulares (ej. tubos)."
          icono="/icons/ventas-menores.png"
          to="/ventas-menores"
        />

      </div>
    </div>
  );
}


export default Dashboard;
