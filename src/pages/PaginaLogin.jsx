// src/pages/PaginaLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // 1. Importamos 'db'
import { signInWithEmailAndPassword } from 'firebase/auth';
// 2. Importamos las funciones de Firestore para BUSCAR
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import './PaginaLogin.css';

function PaginaLogin() {
  
  // 3. Cambiamos 'email' por 'nombre'
  const [nombre, setNombre] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 4. ¡LA LÓGICA DEL "TRUCO"!
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 5. Paso A: Buscar al usuario en Firestore por su 'nombre'
      const usuariosRef = collection(db, "usuarios");
      // Creamos la consulta: "buscar donde 'nombre' sea igual a lo que escribió el usuario"
      const q = query(usuariosRef, where("nombre", "==", nombre.toUpperCase()));
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Si no encontramos a "SAMI", mostramos error
        throw new Error("Usuario no encontrado.");
      }

      // 6. Paso B: Obtener el email real de ese usuario
      //    (Asumimos que el nombre es único)
      const userDoc = querySnapshot.docs[0].data();
      const emailReal = userDoc.email;

      // 7. Paso C: Iniciar sesión en Firebase Auth con el email y la clave
      await signInWithEmailAndPassword(auth, emailReal, password);
      
      // ¡Éxito!
      setLoading(false);
      navigate('/'); // Redirigimos al Dashboard

    } catch (err) {
      setLoading(false);
      if (err.message === "Usuario no encontrado.") {
        setError('Nombre de usuario incorrecto.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Contraseña incorrecta.');
      } else {
        setError('Error al iniciar sesión. Intente de nuevo.');
      }
      console.error(err);
    }
  };


  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-grupo">
            {/* 8. Cambiamos 'Email' por 'Nombre de Usuario' */}
            <label htmlFor="nombre-usuario">Nombre de Usuario:</label>
            <input 
              id="nombre-usuario"
              type="text" // Cambiado de 'email' a 'text'
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