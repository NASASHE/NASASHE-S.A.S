// src/components/Footer.jsx

import React from 'react';
import './Footer.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useCaja } from '../context/CajaContext';

function Footer() {

  // 1. Traemos el nuevo 'userProfile'
  const { base, userProfile, sumarALaBase } = useCaja();

  const fechaActual = new Date().toLocaleDateString();

  const baseBaja = base < 300000;

  const handleLogout = async () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error al cerrar sesión: ", error);
        alert("Error al cerrar sesión.");
      }
    }
  };

  // 2. Verificamos si el perfil ya cargó
  const nombreUsuario = userProfile ? userProfile.nombre : 'Cargando...';

  const handleAgregarBase = async () => {
    const montoIngresado = window.prompt("¿Cuánto deseas agregar a la base?", "0");
    if (montoIngresado === null) return;

    const montoSanitizado = montoIngresado.replace(/[^0-9.,-]/g, '').replace(',', '.');
    const montoNum = Number(montoSanitizado);

    if (Number.isNaN(montoNum) || montoNum <= 0) {
      alert("Ingresa un monto válido mayor que cero.");
      return;
    }

    await sumarALaBase(montoNum);
  };

  return (
    <footer className="footer-principal">

      <div className="footer-user">
        {/* 3. Mostramos el 'nombre' del perfil */}
        Usuario: **{nombreUsuario}** |
        <a
          href="#"
          onClick={handleLogout}
          style={{color: 'black', marginLeft: '40px', textDecoration: 'underline', cursor: 'pointer'}}
        >
          Salir
        </a>
      </div>

      <div className="footer-base">
        <div className="base-valor">
          Base en Caja: ${base.toLocaleString('es-CO')}
        </div>
        {baseBaja && (
          <div className="base-alerta">
            ⚠️ Base por debajo de $300.000. Agrega más base.
          </div>
        )}
      </div>

      <div className="footer-actions">
        <button type="button" className="btn-agregar-base" onClick={handleAgregarBase}>
          Añadir base
        </button>
        <div className="footer-fecha">{fechaActual}</div>
      </div>

    </footer>
  );
}

export default Footer;