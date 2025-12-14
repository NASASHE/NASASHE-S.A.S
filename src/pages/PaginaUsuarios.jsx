// src/pages/PaginaUsuarios.jsx

import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Importamos 'auth'
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, // Usamos 'setDoc' para poner un ID personalizado
  deleteDoc 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword // ¡La función para crear usuarios!
} from 'firebase/auth';

import './PaginaUsuarios.css';

function PaginaUsuarios() {
  
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estados del formulario ---
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [nuevoRol, setNuevoRol] = useState('empleado'); // Por defecto

  // --- FUNCIÓN LEER ---
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const usuariosLista = querySnapshot.docs.map(doc => ({
        id: doc.id, // El ID es el UID de Auth
        ...doc.data()
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

  // --- FUNCIÓN AÑADIR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoEmail || !nuevaClave) {
      alert("Complete todos los campos.");
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Crear el usuario en AUTHENTICATION
      //    (Usamos un 'auth' secundario temporal para no desloguear al admin)
      //    ¡Corrección! No necesitamos un auth secundario.
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        nuevoEmail, 
        nuevaClave
      );
      
      const newUserUid = userCredential.user.uid;

      // 2. Guardar los detalles en FIRESTORE (colección 'usuarios')
      //    Usamos el UID como ID del documento
      await setDoc(doc(db, "usuarios", newUserUid), {
        nombre: nuevoNombre.toUpperCase(),
        email: nuevoEmail,
        rol: nuevoRol
      });
      
      alert(`¡Usuario ${nuevoNombre.toUpperCase()} creado!`);
      
      // Limpiar formulario y refrescar
      setNuevoNombre('');
      setNuevoEmail('');
      setNuevaClave('');
      setNuevoRol('empleado');
      await fetchUsuarios();

    } catch (error) {
      console.error("Error al crear usuario: ", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("Error: Este correo electrónico ya está en uso.");
      } else {
        alert("Error al crear el usuario. Verifique la consola.");
      }
    }
    setIsSubmitting(false);
  };

  // --- FUNCIÓN BORRAR ---
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      try {
        // Borrar de FIRESTORE
        await deleteDoc(doc(db, "usuarios", id));
        
        // (Nota: Borrar de AUTHENTICATION es más complejo
        // y requiere Cloud Functions. Por ahora, solo lo borramos
        // de la base de datos de la app.)
        
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
          </div>
          <div>
            <label>Rol:</label>
            <select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value)}>
              <option value="empleado">Empleado</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting}>
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
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td className="acciones-cell">
                  {/* No permitimos borrar el usuario "SAMI" (o el admin) */}
                  {user.rol !== 'admin' && (
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