// src/components/Header.jsx

import React from 'react';
import './Header.css';
import HeaderButton from './HeaderButton';
import { useCaja } from '../context/CajaContext';
import { Link } from 'react-router-dom';

function Header() {
  
  const { userProfile } = useCaja();
  const esAdmin = userProfile?.rol === 'admin';

  return (
    <header className="header-principal">
      
      <Link to="/" className="header-logo-link">
        {/* 1. ¡AQUÍ ESTÁ EL LOGO! */}
        <img src="/logo.png" alt="Logo Nasashe" className="header-logo-img" />
        
        <div className="header-logo">
          NASASHE
          <span>CHATARRERIA</span>
        </div>
      </Link>
      
      <nav className="header-nav">
        
        {/* --- 1. BOTONES SOLO PARA ADMIN --- */}
        {esAdmin && (
          <>
            <HeaderButton 
              texto="Artículos" 
              icono="/icons/Artículos.png"
              to="/articulos"  // <-- VERIFICA ESTA LÍNEA
            />
            <HeaderButton 
              texto="Proveedores" 
              icono="/icons/Proveedores.png"
              to="/proveedores"
            />
            <HeaderButton
              texto="Ventas"
              icono="/icons/Ventas (F2).png"
              to="/ventas"
            />
            <HeaderButton
              texto="Remisiones"
              icono="/icons/Remisiones.png"
              to="/remisiones"
            />
            <HeaderButton
              texto="Usuarios"
              icono="/icons/usuarios.png"
              to="/usuarios"
            />
            <HeaderButton
              texto="Configuración"
              icono="/icons/CONFIG.png"
              to="/configuracion"
            />
          </>
        )}

        {/* --- 2. BOTONES VISIBLES PARA TODOS --- */}
        <HeaderButton 
          texto="Reportes" 
          icono="/icons/Reportes.png"
          to="/reportes"
        />
        <HeaderButton 
          texto="Compras" 
          icono="/icons/Compras.png"
          to="/compras"
        />
        <HeaderButton 
          texto="Gastos" 
          icono="/icons/gastos.png"
          to="/gastos"
        />
        <HeaderButton 
          texto="Venta Menor" 
          icono="/icons/ventas-menores.png"
          to="/ventas-menores"
        />
        
      </nav>

    </header>
  );
}


export default Header;
