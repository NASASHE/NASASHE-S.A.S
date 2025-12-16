// src/pages/PaginaUsuarios.jsx

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Importamos 'auth'
import {
  collection,
  getDocs,
  doc,
  setDoc, // Usamos 'setDoc' para poner un ID personalizado
  deleteDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

import "./PaginaUsuarios.css";

function PaginaUsuarios() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estados del formulario ---
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [nuevoRol, setNuevoRol] = useState("empleado"); // Por defecto

  // --- FUNCIÓN LEER ---
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const usuariosLista = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id, // El ID es el UID de Auth
        ...docSnap.data(),
      }));
      setUsuarios(usuariosLista);
    } catch (error) {
      console.error("Error al traer usuarios: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Helpers para UX
  const nombreTrim = nuevoNombre.trim();
  const emailTrim = nuevoEmail.trim();
  const claveTrim = nuevaClave; // password no se suele trim()
  const claveCorta = claveTrim.length > 0 && claveTrim.length < 6;

  const formularioInvalido =
    !nombreTrim || !emailTrim || !claveTrim || claveTrim.length < 6;

  // --- FUNCIÓN AÑADIR ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!nombreTrim || !emailTrim || !claveTrim) {
      alert("Complete todos los campos.");
      return;
    }

    // Validación mínimo 6 caracteres
    if (claveTrim.length < 6) {
      alert("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Crear el usuario en AUTHENTICATION
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailTrim.toLowerCase(),
        claveTrim
      );

      const newUserUid = userCredential.user.uid;

      // 2. Guardar los detalles en FIRESTORE (colección 'usuarios')
      await setDoc(doc(db, "usuarios", newUserUid), {
        nombre: nombreTrim.toUpperCase(),
        email: emailTrim.toLowerCase(),
        rol: nuevoRol, // ya es "empleado" o "admin"
      });

      alert(`¡Usuario ${nombreTrim.toUpperCase()} creado!`);

      // Limpiar formulario y refrescar
      setNuevoNombre("");
      setNuevoEmail("");
      setNuevaClave("");
      setNuevoRol("empleado");
      await fetchUsuarios();
    } catch (error) {
      console.error("Error al crear usuario: ", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Error: Este correo electrónico ya está en uso.");
      } else if (error.code === "auth/weak-password") {
        alert("Error: La contraseña debe tener mínimo 6 caracteres.");
      } else if (error.code === "auth/invalid-email") {
        alert("Error: El correo electrónico no es válido.");
      } else {
        alert("Error al crear el usuario. Verifique la consola.");
      }
    }

    setIsSubmitting(false);
  };

  // --- FUNCIÓN BORRAR ---
  const handleDelete = async (id, nombre) => {
    if (
      window.confirm(
        `¿Seguro que deseas eliminar a ${nombre}? Esta acción no se puede deshacer.`
      )
    ) {
      try {
        // Borrar de FIRESTORE
        await deleteDoc(doc(db, "usuarios", id));

        // Nota: Borrar de AUTHENTICATION es más complejo y requiere Cloud Functions.
        alert(`Usuario ${nombre} eliminado.`);
        await fetchUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario: ", error);
      }
    }
  };

  return (
    <div className="pagina-usuarios">
      <h1>Gestión de Usuarios</h1>
      <p>Aquí puedes crear y administrar las cuentas de los empleados.</p>

      {/* --- Formulario de Añadir --- */}
      <div className="form-container">
        <h2>Añadir Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre (para Login):</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
            />
          </div>

          <div>
            <label>Email (real):</label>
            <input
              type="email"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
            />

            {/* Aviso en vivo */}
            {claveCorta && (
              <small style={{ color: "red", display: "block", marginTop: 6 }}>
                La contraseña debe tener mínimo 6 caracteres.
              </small>
            )}
          </div>

          <div>
            <label>Rol:</label>
            <select
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
            >
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitting || formularioInvalido}>
            {isSubmitting ? "Creando..." : "Crear Usuario"}
          </button>
        </form>
      </div>

      {/* --- Tabla de Usuarios --- */}
      <h2>Lista de Usuarios</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th className="acciones-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td className="acciones-cell">
                  {/* No permitimos borrar admins */}
                  {user.rol !== "admin" && (
                    <button
                      onClick={() => handleDelete(user.id, user.nombre)}
                      className="btn-borrar"
                    >
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
