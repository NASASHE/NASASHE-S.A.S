// src/pages/PaginaLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  getDocsFromServer,
  query,
  where
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import './PaginaLogin.css';

const normalizar = (valor) => String(valor || '').trim().toUpperCase();
const normalizarEmail = (valor) => String(valor || '').trim().toLowerCase();

async function resolverEmailPorIdentificador(identificadorInput) {
  const identificador = identificadorInput.trim();
  if (!identificador) {
    throw new Error('Usuario no encontrado.');
  }

  const usuariosRef = collection(db, 'usuarios');
  const nombreNormalizado = normalizar(identificador);

  // Intento 1: coincidencia exacta por campo principal.
  const exactaPorNombre = await getDocsFromServer(
    query(usuariosRef, where('nombre', '==', nombreNormalizado))
  );

  if (!exactaPorNombre.empty) {
    const email = exactaPorNombre.docs[0].data()?.email;
    if (email) return email;
  }

  // Intento 2: compatibilidad con otros campos o nombres no normalizados.
  const todos = await getDocsFromServer(usuariosRef);
  const emailPorBusquedaFlexible = todos.docs
    .map((docSnap) => docSnap.data())
    .find((data) => {
      const candidatos = [
        data?.nombre,
        data?.nombreUsuario,
        data?.username,
        data?.usuario
      ].map(normalizar);

      return candidatos.includes(nombreNormalizado);
    })?.email;

  if (emailPorBusquedaFlexible) {
    return emailPorBusquedaFlexible;
  }

  // Intento 3: si escribieron email directamente.
  if (identificador.includes('@')) {
    return normalizarEmail(identificador);
  }

  throw new Error('Usuario no encontrado.');
}

function PaginaLogin() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const emailReal = await resolverEmailPorIdentificador(nombre);
      await signInWithEmailAndPassword(auth, emailReal, password);
      navigate('/');
    } catch (err) {
      if (err?.code === 'permission-denied' || err?.code === 'firestore/permission-denied') {
        setError('No hay permiso para leer usuarios en Firestore.');
      } else if (err?.message === 'Usuario no encontrado.') {
        setError('Nombre de usuario incorrecto.');
      } else if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else if (err?.code === 'auth/user-not-found') {
        setError('Usuario no existe en Authentication.');
      } else {
        setError('Error al iniciar sesión. Intente de nuevo.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-grupo">
            <label htmlFor="nombre-usuario">Nombre de Usuario:</label>
            <input
              id="nombre-usuario"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-grupo">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default PaginaLogin;
