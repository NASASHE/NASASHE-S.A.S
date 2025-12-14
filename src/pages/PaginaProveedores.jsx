// src/pages/PaginaProveedores.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import './PaginaProveedores.css'; // Importamos el CSS de Proveedores

function PaginaProveedores() {
  
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);
  
  // --- Estados del formulario para AÑADIR (actualizados) ---
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoTelefono, setNuevoTelefono] = useState('');
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoNit, setNuevoNit] = useState('');
  const [nuevoDireccion, setNuevoDireccion] = useState('');
  const [nuevoMaterial, setNuevoMaterial] = useState('');

  // --- Estados para EDITAR (actualizados) ---
  const [editingId, setEditingId] = useState(null); 
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    nit: '',
    direccion: '',
    material: ''
  });

  // --- FUNCIÓN LEER ---
  const fetchProveedores = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "proveedores"));
      const proveedoresLista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProveedores(proveedoresLista);
      setLoading(false);
    } catch (error) {
      console.error("Error al traer los datos: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // --- FUNCIÓN AÑADIR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoNit) { // Validamos nombre y NIT
      alert("Por favor, completa el Nombre y el NIT.");
      return;
    }
    try {
      await addDoc(collection(db, "proveedores"), {
        nombre: nuevoNombre.toUpperCase(),
        telefono: nuevoTelefono,
        email: nuevoEmail,
        nit: nuevoNit,
        direccion: nuevoDireccion,
        material: nuevoMaterial.toUpperCase()
      });
      
      // Limpiamos todos los campos
      setNuevoNombre('');
      setNuevoTelefono('');
      setNuevoEmail('');
      setNuevoNit('');
      setNuevoDireccion('');
      setNuevoMaterial('');
      
      await fetchProveedores(); // Refrescamos
    } catch (error) {
      console.error("Error al añadir el documento: ", error);
    }
  };

  // --- FUNCIÓN BORRAR (sin cambios) ---
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      try {
        const docRef = doc(db, "proveedores", id);
        await deleteDoc(docRef);
        await fetchProveedores();
      } catch (error) {
        console.error("Error al eliminar el documento: ", error);
      }
    }
  };

  // --- FUNCIONES PARA EDITAR ---
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    // Forzamos mayúsculas en nombre y material
    if (name === 'nombre' || name === 'material') {
      finalValue = value.toUpperCase();
    }
    setEditFormData(prevState => ({
      ...prevState,
      [name]: finalValue
    }));
  };

  const handleEditClick = (proveedor) => {
    setEditingId(proveedor.id);
    setEditFormData({ // Rellenamos con todos los datos
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      email: proveedor.email,
      nit: proveedor.nit,
      direccion: proveedor.direccion,
      material: proveedor.material
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "proveedores", editingId);
    
    if (!editFormData.nombre || !editFormData.nit) {
      alert("Por favor, completa el Nombre y el NIT.");
      return;
    }
    
    const datosActualizados = {
      nombre: editFormData.nombre.toUpperCase(),
      telefono: editFormData.telefono,
      email: editFormData.email,
      nit: editFormData.nit,
      direccion: editFormData.direccion,
      material: editFormData.material.toUpperCase()
    };

    try {
      await updateDoc(docRef, datosActualizados);
      setEditingId(null);
      await fetchProveedores();
    } catch (error) {
      console.error("Error al actualizar el documento: ", error);
    }
  };

  // --- RENDERIZADO (con Tabla) ---
  return (
    <div className="pagina-proveedores">
      <h1>Módulo de Proveedores</h1>
      
      <div className="form-container">
        <h2>Añadir Nuevo Proveedor</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nuevoNombre">Nombre:</label>
            <input 
              id="nuevoNombre" type="text" name="nombre"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label htmlFor="nuevoNit">NIT:</label>
            <input 
              id="nuevoNit" type="text" name="nit"
              value={nuevoNit}
              onChange={(e) => setNuevoNit(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nuevoTelefono">Teléfono:</label>
            <input 
              id="nuevoTelefono" type="text" name="telefono"
              value={nuevoTelefono}
              onChange={(e) => setNuevoTelefono(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nuevoEmail">Email:</label>
            <input 
              id="nuevoEmail" type="email" name="email"
              value={nuevoEmail}
              onChange={(e) => setNuevoEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nuevoDireccion">Dirección:</label>
            <input 
              id="nuevoDireccion" type="text" name="direccion"
              value={nuevoDireccion}
              onChange={(e) => setNuevoDireccion(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="nuevoMaterial">Material:</label>
            <input 
              id="nuevoMaterial" type="text" name="material"
              value={nuevoMaterial}
              onChange={(e) => setNuevoMaterial(e.target.value.toUpperCase())}
            />
          </div>
          <button type="submit">Guardar Proveedor</button>
        </form>
      </div>

      <h2>Lista de Proveedores</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="proveedores-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>NIT</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Material</th>
              <th className="acciones-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map(proveedor => (
              <tr key={proveedor.id} className={editingId === proveedor.id ? 'edit-row' : ''}>
                
                {editingId === proveedor.id ? (
                  /* --- MODO EDICIÓN --- */
                  <>
                    <td><input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditChange} /></td>
                    <td><input type="text" name="nit" value={editFormData.nit} onChange={handleEditChange} /></td>
                    <td><input type="text" name="telefono" value={editFormData.telefono} onChange={handleEditChange} /></td>
                    <td><input type="email" name="email" value={editFormData.email} onChange={handleEditChange} /></td>
                    <td><input type="text" name="direccion" value={editFormData.direccion} onChange={handleEditChange} /></td>
                    <td><input type="text" name="material" value={editFormData.material} onChange={handleEditChange} /></td>
                    <td className="acciones-cell">
                      <button onClick={handleUpdateSubmit} className="btn-guardar">Guardar</button>
                      <button type="button" onClick={handleCancelEdit} className="btn-cancelar">Cancelar</button>
                    </td>
                  </>
                ) : (
                  /* --- MODO VISTA --- */
                  <>
                    <td>{proveedor.nombre}</td>
                    <td>{proveedor.nit}</td>
                    <td>{proveedor.telefono}</td>
                    <td>{proveedor.email}</td>
                    <td>{proveedor.direccion}</td>
                    <td>{proveedor.material}</td>
                    <td className="acciones-cell">
                      <button onClick={() => handleEditClick(proveedor)} className="btn-editar">
                        Editar
                      </button>
                      <button onClick={() => handleDelete(proveedor.id)} className="btn-borrar">
                        Borrar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaginaProveedores;