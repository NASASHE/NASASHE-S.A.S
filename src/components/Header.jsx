// src/components/Header.jsx

import React from 'react'
import './Header.css'
import HeaderButton from './HeaderButton'
import { useCaja } from '../context/CajaContext'
import { Link } from 'react-router-dom'

// ✅ BASE_URL para que funcione en GitHub Pages
const BASE = import.meta.env.BASE_URL

function Header() {
  const { userProfile } = useCaja()
  const esAdmin = userProfile?.rol === 'admin'

  return (
    <header className="header-principal">

      <Link to="/" className="header-logo-link">
        {/* LOGO */}
        <img
          src={`${BASE}logo.png`}
          alt="Logo Nasashe"
          className="header-logo-img"
        />

        <div className="header-logo">
          NASASHE
          <span>CHATARRERIA</span>
        </div>
      </Link>

      <nav className="header-nav">

        {/* --- BOTONES SOLO PARA ADMIN --- */}
        {esAdmin && (
          <>
            <HeaderButton
              texto="Artículos"
              icono={`${BASE}icons/Artículos.png`}
              to="/articulos"
            />
            <HeaderButton
              texto="Proveedores"
              icono={`${BASE}icons/Proveedores.png`}
              to="/proveedores"
            />
            <HeaderButton
              texto="Ventas"
              icono={`${BASE}icons/Ventas (F2).png`}
              to="/ventas"
            />
            <HeaderButton
              texto="Remisiones"
              icono={`${BASE}icons/Remisiones.png`}
              to="/remisiones"
            />
            <HeaderButton
              texto="Usuarios"
              icono={`${BASE}icons/usuarios.png`}
              to="/usuarios"
            />
            <HeaderButton
              texto="Configuración"
              icono={`${BASE}icons/CONFIG.png`}
              to="/configuracion"
            />
          </>
        )}

        {/* --- BOTONES PARA TODOS --- */}
        <HeaderButton
          texto="Reportes"
          icono={`${BASE}icons/Reportes.png`}
          to="/reportes"
        />
        <HeaderButton
          texto="Compras"
          icono={`${BASE}icons/Compras.png`}
          to="/compras"
        />
        <HeaderButton
          texto="Gastos"
          icono={`${BASE}icons/gastos.png`}
          to="/gastos"
        />
        <HeaderButton
          texto="Venta Menor"
          icono={`${BASE}icons/ventas-menores.png`}
          to="/ventas-menores"
        />

      </nav>
    </header>
  )
}

export default Header
