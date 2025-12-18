// src/pages/PaginaLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import "./PaginaLogin.css";

function PaginaLogin() {
  const [usuario, setUsuario] = useState(""); // puede ser usuario, nombre o email
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const normalizeKey = (v) => (v || "").trim().toUpperCase();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const input = usuario.trim();
      if (!input || !password) throw new Error("Completa los campos.");

      // ✅ Si escriben un correo, login directo
      if (input.includes("@")) {
        await signInWithEmailAndPassword(auth, input.toLowerCase(), password);
        navigate("/");
        return;
      }

      const key = normalizeKey(input);

      const usuariosPubRef = collection(db, "usuarios_publicos");

      // ✅ 1) Buscar por USUARIO
      let q = query(usuariosPubRef, where("usuario", "==", key), limit(1));
      let snap = await getDocs(q);

      // ✅ 2) Si no existe por usuario, buscar por NOMBRE (nombreKey)
      if (snap.empty) {
        q = query(usuariosPubRef, where("nombreKey", "==", key), limit(1));
        snap = await getDocs(q);
      }

      if (snap.empty) {
        throw new Error("Usuario no encontrado.");
      }

      const data = snap.docs[0].data();

      // ✅ 3) Validar activo
      if (data.activo === false) {
        throw new Error("Usuario desactivado.");
      }

      const emailReal = (data.email || "").toLowerCase();

      if (!emailReal) {
        throw new Error("Usuario sin email asociado (usuarios_publicos).");
      }

      await signInWithEmailAndPassword(auth, emailReal, password);
      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.message === "Usuario no encontrado.") {
        setError("Usuario o nombre incorrecto.");
      } else if (err.message === "Usuario desactivado.") {
        setError("Usuario desactivado. Contacte al administrador.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Contraseña incorrecta.");
      } else if (err.code === "permission-denied") {
        setError("No hay permisos para leer usuarios_publicos. Revisa Firestore Rules.");
      } else {
        setError("Error al iniciar sesión. Intente de nuevo.");
      }
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
            <label htmlFor="usuario">Usuario o correo:</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          {error && <p className="login-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default PaginaLogin;
