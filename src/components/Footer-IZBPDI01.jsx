// src/components/Footer.jsx

import React from 'react';
import './Footer.css';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useCaja } from '../context/CajaContext';

function Footer() {
  const { base, userProfile, sumarALaBase, currentUser } = useCaja();

  const fechaActual = new Date().toLocaleDateString('es-CO');

  const baseEsNumero = typeof base === 'number' && !Number.isNaN(base);
  const baseBaja = baseEsNumero && base < 300000;

  const nombreUsuario =
    userProfile?.nombre ||
    currentUser?.email ||
    'Usuario';

  const handleLogout = async () => {
    const ok = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (!ok) return;

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
      alert("Error al cerrar sesión.");
    }
  };

  const handleAgregarBase = async () => {
    const montoIngresado = window.prompt("¿Cuánto deseas agregar a la base?", "0");
    if (montoIngresado === null) return;

    const montoSanitizado = montoIngresado
      .replace(/[^0-9.,-]/g, '')
      .replace(',', '.');

    const montoNum = Number(montoSanitizado);

    if (Number.isNaN(montoNum) || montoNum <= 0) {
      alert("Ingresa un monto válido mayor que cero.");
      return;
    }

    try {
      await sumarALaBase(montoNum);
    } catch (e) {
      console.error("Error al agregar base:", e);
      alert("No se pudo agregar a la base.");
    }
  };

  return (
    <footer className="footer-principal">
      <div className="footer-user">
        Usuario: <strong>{nombreUsuario}</strong> |{" "}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            color: 'black',
            marginLeft: '40px',
            textDecoration: 'underline',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit'
          }}
        >
          Salir
        </button>
      </div>

      <div className="footer-base">
        <div className="base-valor">
          Base en Caja:{" "}
          {baseEsNumero ? `$${base.toLocaleString('es-CO')}` : 'Cargando...'}
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
