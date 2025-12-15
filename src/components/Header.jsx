// src/components/Header.jsx
import React from 'react'
import './Header.css'
import HeaderButton from './HeaderButton'
import { useCaja } from '../context/CajaContext'
import { Link } from 'react-router-dom'

// ✅ IMPORTAR IMÁGENES
import logo from '../assets/logo.png'
import iconArticulos from '../assets/icons/Artículos.png'
import iconProveedores from '../assets/icons/Proveedores.png'
import iconVentas from '../assets/icons/Ventas (F2).png'
import iconRemisiones from '../assets/icons/Remisiones.png'
import iconUsuarios from '../assets/icons/usuarios.png'
import iconConfig from '../assets/icons/CONFIG.png'
import iconReportes from '../assets/icons/Reportes.png'
import iconCompras from '../assets/icons/Compras.png'
import iconGastos from '../assets/icons/gastos.png'
import iconVentaMenor from '../assets/icons/ventas-menores.png'

function Header() {
  const { userProfile } = useCaja()
  const esAdmin = userProfile?.rol === 'admin'

  return (
    <header className="header-principal">

      <Link to="/" className="header-logo-link">
        <img src={logo} alt="Logo Nasashe" className="header-logo-img" />
        <div className="header-logo">
          NASASHE
          <span>CHATARRERIA</span>
        </div>
      </Link>

      <nav className="header-nav">
        {esAdmin && (
          <>
            <HeaderButton texto="Artículos" icono={iconArticulos} to="/articulos" />
            <HeaderButton texto="Proveedores" icono={iconProveedores} to="/proveedores" />
            <HeaderButton texto="Ventas" icono={iconVentas} to="/ventas" />
            <HeaderButton texto="Remisiones" icono={iconRemisiones} to="/remisiones" />
            <HeaderButton texto="Usuarios" icono={iconUsuarios} to="/usuarios" />
            <HeaderButton texto="Configuración" icono={iconConfig} to="/configuracion" />
          </>
        )}

        <HeaderButton texto="Reportes" icono={iconReportes} to="/reportes" />
        <HeaderButton texto="Compras" icono={iconCompras} to="/compras" />
        <HeaderButton texto="Gastos" icono={iconGastos} to="/gastos" />
        <HeaderButton texto="Venta Menor" icono={iconVentaMenor} to="/ventas-menores" />
      </nav>
    </header>
  )
}

export default Header
