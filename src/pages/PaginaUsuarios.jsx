// src/pages/PaginaUsuarios.jsx
import React, { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  limit,
} from "firebase/firestore";

import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import "./PaginaUsuarios.css";

// ⚠️ MISMA config de firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBsAP-bhieVtVkPglMBsf5lben2JuUEcf0",
  authDomain: "nasashe-chatarreria.firebaseapp.com",
  projectId: "nasashe-chatarreria",
  storageBucket: "nasashe-chatarreria.firebasestorage.app",
  messagingSenderId: "401122117055",
  appId: "1:401122117055:web:0b48451b9b4d5291cacd0a",
};

const normalizeUser = (v) => (v || "").trim().toUpperCase();
const normalizeName = (v) => (v || "").trim().toUpperCase();
const normalizeEmail = (v) => (v || "").trim().toLowerCase();

function PaginaUsuarios() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // crear
  const [nuevoUsuario, setNuevoUsuario] = useState(""); // usuario login
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [nuevoRol, setNuevoRol] = useState("empleado");

  // cambiar mi contraseña
  const [miClaveActual, setMiClaveActual] = useState("");
  const [miClaveNueva, setMiClaveNueva] = useState("");

  const claveCorta = nuevaClave.length > 0 && nuevaClave.length < 6;

  const formularioInvalido = useMemo(() => {
    const u = normalizeUser(nuevoUsuario);
    const n = normalizeName(nuevoNombre);
    const e = normalizeEmail(nuevoEmail);
    return !u || !n || !e || !nuevaClave || nuevaClave.length < 6;
  }, [nuevoUsuario, nuevoNombre, nuevoEmail, nuevaClave]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "usuarios"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) =>
        (a.usuario || a.nombre || "").localeCompare(b.usuario || b.nombre || "")
      );
      setUsuarios(list);
    } catch (e) {
      console.error("Error trayendo usuarios:", e);
      alert("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ✅ Crear usuario SIN tumbar sesión admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formularioInvalido) return;

    setIsSubmitting(true);

    try {
      const usuarioKey = normalizeUser(nuevoUsuario);
      const nombre = normalizeName(nuevoNombre);
      const email = normalizeEmail(nuevoEmail);
      const password = nuevaClave;

      // 1) Validar: usuario no exista (docId)
      const pubDocRef = doc(db, "usuarios_publicos", usuarioKey);
      const pubSnap = await getDoc(pubDocRef);
      if (pubSnap.exists()) throw new Error("Usuario ya existe.");

      // 2) Validar: email no exista en usuarios_publicos (query)
      const qEmail = query(
        collection(db, "usuarios_publicos"),
        where("email", "==", email),
        limit(1)
      );
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) throw new Error("Correo ya existe.");

      // 3) Crear usuario en Auth con Auth secundario (no tumba admin)
      const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`);
      const secondaryAuth = getAuth(secondaryApp);

      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid = cred.user.uid;

      // cerrar sesión secundaria
      await signOut(secondaryAuth);

      // 4) Guardar en usuarios/{uid}
      await setDoc(doc(db, "usuarios", uid), {
        usuario: usuarioKey,
        nombre,
        email,
        rol: nuevoRol,
        activo: true,
      });

      // 5) Guardar en usuarios_publicos/{USUARIO} ✅ (esto es lo que necesita el login)
      await setDoc(doc(db, "usuarios_publicos", usuarioKey), {
        usuario: usuarioKey,
        nombre: nombre,      // ✅ agregado
        nombreKey: nombre,   // ✅ agregado (para login por nombre sin importar may/min)
        email,
        rol: nuevoRol,
        activo: true,
        uid,
      });

      alert(`✅ Usuario ${usuarioKey} creado correctamente.`);

      setNuevoUsuario("");
      setNuevoNombre("");
      setNuevoEmail("");
      setNuevaClave("");
      setNuevoRol("empleado");

      await fetchUsuarios();
    } catch (err) {
      console.error("Error creando usuario:", err);

      if (err.message === "Usuario ya existe.") alert("❌ Ese USUARIO ya está registrado.");
      else if (err.message === "Correo ya existe.") alert("❌ Ese CORREO ya está registrado.");
      else if (err.code === "auth/email-already-in-use") alert("❌ Ese correo ya está en uso en Auth.");
      else if (err.code === "auth/invalid-email") alert("❌ Correo inválido.");
      else if (err.code === "auth/weak-password") alert("❌ Contraseña muy débil (mínimo 6).");
      else alert(err?.message || "❌ Error al crear usuario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ activar/desactivar (bloquea login si lo validas en PaginaLogin)
  const toggleActivo = async (user) => {
    try {
      const nuevoEstado = !(user.activo === true);

      // usuarios/{uid}
      await updateDoc(doc(db, "usuarios", user.id), { activo: nuevoEstado });

      // usuarios_publicos/{USUARIO}
      const userKey = normalizeUser(user.usuario || user.nombre);
      if (userKey) {
        await updateDoc(doc(db, "usuarios_publicos", userKey), { activo: nuevoEstado });
      }

      await fetchUsuarios();
    } catch (e) {
      console.error(e);
      alert("No se pudo cambiar el estado (activo/inactivo).");
    }
  };

  // ✅ Reset contraseña por correo
  const resetPassword = async (email) => {
    try {
      const primaryAuth = getAuth();
      await sendPasswordResetEmail(primaryAuth, email);
      alert("📩 Se envió correo para restablecer contraseña.");
    } catch (e) {
      console.error(e);
      alert("No se pudo enviar el correo de restablecimiento.");
    }
  };

  // ✅ Cambiar contraseña del usuario LOGUEADO
  const cambiarMiPassword = async () => {
    try {
      const primaryAuth = getAuth();
      const me = primaryAuth.currentUser;
      if (!me?.email) {
        alert("No hay usuario logueado.");
        return;
      }
      if (!miClaveActual || miClaveNueva.length < 6) {
        alert("Escribe tu clave actual y una nueva (mínimo 6).");
        return;
      }

      const cred = EmailAuthProvider.credential(me.email, miClaveActual);
      await reauthenticateWithCredential(me, cred);
      await updatePassword(me, miClaveNueva);

      setMiClaveActual("");
      setMiClaveNueva("");
      alert("✅ Contraseña actualizada.");
    } catch (e) {
      console.error(e);
      alert("No se pudo cambiar la contraseña (¿clave actual incorrecta?).");
    }
  };

  // borrar Firestore (Auth no se borra desde cliente)
  const handleDelete = async (user) => {
    if (!window.confirm(`¿Eliminar a ${user.usuario || user.nombre}?`)) return;

    try {
      await deleteDoc(doc(db, "usuarios", user.id));

      const userKey = normalizeUser(user.usuario || user.nombre);
      if (userKey) await deleteDoc(doc(db, "usuarios_publicos", userKey));

      alert("✅ Usuario eliminado de Firestore (Auth NO se borra desde cliente).");
      await fetchUsuarios();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar.");
    }
  };

  return (
    <div className="pagina-usuarios">
      <h1>Gestión de Usuarios</h1>
      <p>
        Crea usuarios por <b>USUARIO</b> (login), guarda email real y controla si pueden entrar.
      </p>

      <div className="form-container">
        <h2>Añadir Nuevo Usuario</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuario (para Login):</label>
            <input
              type="text"
              value={nuevoUsuario}
              onChange={(e) => setNuevoUsuario(e.target.value)}
              placeholder="Ej: SAMI"
            />
          </div>

          <div>
            <label>Nombre (interno):</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej: SAMI PEREZ"
            />
          </div>

          <div>
            <label>Email (real - Auth):</label>
            <input
              type="email"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
              placeholder="correo@..."
            />
          </div>

          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
            />
            {claveCorta && (
              <small style={{ color: "red", display: "block", marginTop: 6 }}>
                La contraseña debe tener mínimo 6 caracteres.
              </small>
            )}
          </div>

          <div>
            <label>Rol:</label>
            <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitting || formularioInvalido}>
            {isSubmitting ? "Creando..." : "Crear Usuario"}
          </button>
        </form>
      </div>

      <div className="form-container" style={{ marginTop: 20 }}>
        <h2>Cambiar mi contraseña</h2>
        <div>
          <label>Clave actual:</label>
          <input
            type="password"
            value={miClaveActual}
            onChange={(e) => setMiClaveActual(e.target.value)}
          />
        </div>
        <div>
          <label>Nueva clave (mínimo 6):</label>
          <input
            type="password"
            value={miClaveNueva}
            onChange={(e) => setMiClaveNueva(e.target.value)}
          />
        </div>
        <button type="button" onClick={cambiarMiPassword}>
          Cambiar contraseña
        </button>
      </div>

      <h2>Lista de Usuarios</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Activo</th>
              <th className="acciones-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.usuario || u.nombre}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>{u.activo === false ? "NO" : "SI"}</td>
                <td className="acciones-cell">
                  {/* ✅ SOLO CAMBIO: className */}
                  <button
                    onClick={() => toggleActivo(u)}
                    className={u.activo === false ? "btn-activar" : "btn-desactivar"}
                  >
                    {u.activo === false ? "Activar" : "Desactivar"}
                  </button>

                  {/* ✅ SOLO CAMBIO: className */}
                  <button
                    onClick={() => resetPassword(u.email)}
                    className="btn-reset"
                  >
                    Reset Pass
                  </button>

                  {u.rol !== "admin" && (
                    <button onClick={() => handleDelete(u)} className="btn-borrar">
                      Borrar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaginaUsuarios;
