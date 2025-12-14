// src/pages/PaginaArticulos.jsx

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
import './PaginaArticulos.css';
import { showMessage } from '../utils/showMessage';

// 1. ¡NUEVO! Lista de todas tus imágenes en la carpeta /public/icons/
const listaDeImagenes = [
  "ACERO.jpg", "ALUMINIO.jpg", "ANTIMONIO.jpg", "ARCHIVO.jpg", 
  "BATERIA_1_GRUPO.jpg", "BATERIA_2_GRUPO.jpg", "BATERIA_3_GRUPO.jpg", 
  "BATERIA_4_GRUPO.jpg", "BATERIA_5_GRUPO.jpg", "BATERIA_7_GRUPO.jpg", 
  "BATERIA_8_GRUPO.jpg", "BATERIA_PEQUEÑA.jpg", "BRONCE.jpg", 
  "CANASTA.jpg", "CARTON.jpg", "COBRE.jpg", "COBRE_CABLE.jpg", 
  "HIERRO.jpg", "OTRO.jpg", "PASTA.jpg", "PERFIL.jpg", "PET.jpg", 
  "PLAQUETA_1.jpg", "PLAQUETA_2.jpg", "PLAQUETA_3.jpg", 
  "PLAQUETA_BAJA.jpg", "PLAQUETA_CELULAR.jpg", "PLAQUETA_DECO.jpg", 
  "PLOMO.jpg", "POTE.jpg", "POTE_DE_ALUMINIO.jpg", "RADIADOR_ALUMINIO.jpg",
  "RADIADOR_BRONCE.jpg", "RADIADOR_COBRE.jpg", "RADIADOR_MIXTO.jpg", "SCARP_LIMPIO.jpg",
  "SCARP_SUCIO.jpg", "SILLA.jpg", "TANQUE.jpg", "TANQUE_METALICO.jpg", 
  "VOLUMEN_HIERRO.jpg"
];


function PaginaArticulos() {
  
  const [loading, setLoading] = useState(true);
  const [articulos, setArticulos] = useState([]);
  
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecioCompra, setNuevoPrecioCompra] = useState('');
  const [nuevoPrecioVenta, setNuevoPrecioVenta] = useState('');
  const [nuevoStock, setNuevoStock] = useState('');
  // 2. ¡CAMBIO! El estado de la imagen ahora es la URL completa
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState(''); 

  const [editingId, setEditingId] = useState(null); 
  const [editFormData, setEditFormData] = useState({
    nombre: '',
    precioCompra: '',
    precioVenta: '',
    stock: '',
    imagenUrl: ''
  });

  // --- (fetchArticulos - sin cambios) ---
  const fetchArticulos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "articulos"));
      const articulosLista = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      setArticulos(articulosLista);
      setLoading(false);
    } catch (error) {
      console.error("Error al traer los datos: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  // --- (handleSubmit - sin cambios) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const precioCompraNum = Number(nuevoPrecioCompra);
    const precioVentaNum = Number(nuevoPrecioVenta);
    const stockNum = Number(nuevoStock);
    if (!nuevoNombre || precioCompraNum <= 0 || precioVentaNum <= 0) {
      await showMessage("Por favor, completa Nombre y ambos Precios con valores válidos.", {
        title: 'Nasashe sas',
        type: 'warning'
      });
      return;
    }
    try {
      await addDoc(collection(db, "articulos"), {
        nombre: nuevoNombre.toUpperCase(),
        precioCompra: precioCompraNum,
        precioVenta: precioVentaNum,
        stock: stockNum || 0,
        imagenUrl: nuevaImagenUrl || '' // Se guarda la URL completa
      });
      setNuevoNombre('');
      setNuevoPrecioCompra('');
      setNuevoPrecioVenta('');
      setNuevoStock('');
      setNuevaImagenUrl(''); // Limpiamos la URL
      await fetchArticulos();
    } catch (error) {
      console.error("Error al añadir el documento: ", error);
    }
  };

  // --- (handleDelete - sin cambios) ---
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      try {
        const docRef = doc(db, "articulos", id);
        await deleteDoc(docRef);
        await fetchArticulos();
      } catch (error) {
        console.error("Error al eliminar el documento: ", error);
      }
    }
  };

  // 3. ¡ACTUALIZADO! (handleEditChange)
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    if (name === 'nombre') {
      finalValue = value.toUpperCase();
    } else if (name === 'precioCompra' || name === 'precioVenta' || name === 'stock') {
      finalValue = value.replace(/[^0-9]/g, '');
    }
    // Para el <select> de imagen, 'value' ya es la URL completa
    
    setEditFormData(prevState => ({
      ...prevState,
      [name]: finalValue
    }));
  };

  // --- (handleEditClick - sin cambios) ---
  const handleEditClick = (articulo) => {
    setEditingId(articulo.id);
    setEditFormData({
      nombre: articulo.nombre,
      precioCompra: articulo.precioCompra,
      precioVenta: articulo.precioVenta,
      stock: articulo.stock,
      imagenUrl: articulo.imagenUrl || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // --- (handleUpdateSubmit - sin cambios) ---
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, "articulos", editingId); 
    const datosActualizados = {
      nombre: editFormData.nombre.toUpperCase(),
      precioCompra: Number(editFormData.precioCompra),
      precioVenta: Number(editFormData.precioVenta),
      stock: Number(editFormData.stock) || 0,
      imagenUrl: editFormData.imagenUrl || ''
    };
    if (!datosActualizados.nombre || datosActualizados.precioCompra <= 0 || datosActualizados.precioVenta <= 0) {
      await showMessage("Por favor, completa Nombre y ambos Precios con valores válidos.", {
        title: 'Nasashe sas',
        type: 'warning'
      });
      return;
    }
    try {
      await updateDoc(docRef, datosActualizados);
      setEditingId(null);
      await fetchArticulos();
    } catch (error) {
      console.error("Error al actualizar el documento: ", error);
    }
  };

  return (
    <div className="pagina-articulos">
      <h1>Módulo de Artículos</h1>
      <p>Aquí puedes gestionar tu inventario.</p>

      {/* 4. ¡FORMULARIO DE AÑADIR ACTUALIZADO! */}
      <div className="form-container">
        <h2>Añadir Nuevo Artículo</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nuevoNombre">Nombre:</label>
            <input 
              id="nuevoNombre" type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label htmlFor="nuevoPrecioCompra">Precio Compra:</label>
            <input 
              id="nuevoPrecioCompra" type="text"
              value={nuevoPrecioCompra}
              onChange={(e) => setNuevoPrecioCompra(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          <div>
            <label htmlFor="nuevoPrecioVenta">Precio Venta:</label>
            <input 
              id="nuevoPrecioVenta" type="text"
              value={nuevoPrecioVenta}
              onChange={(e) => setNuevoPrecioVenta(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          <div>
            <label htmlFor="nuevoStock">Stock:</label>
            <input 
              id="nuevoStock" type="text"
              value={nuevoStock}
              onChange={(e) => setNuevoStock(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>
          
          {/* ¡CAMPO ACTUALIZADO A <select>! */}
          <div>
            <label htmlFor="nuevaImagenUrl">Imagen:</label>
            <select
              id="nuevaImagenUrl"
              value={nuevaImagenUrl}
              onChange={(e) => setNuevaImagenUrl(e.target.value)}
            >
              <option value="">-- Sin imagen --</option>
              {listaDeImagenes.map(imagen => (
                <option key={imagen} value={`/icons/${imagen}`}>
                  {imagen}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit">Guardar Artículo</button>
        </form>
      </div>

      <h2>Inventario Actual en Firebase</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="articulos-table">
          <thead>
            <tr>
              <th className="articulo-imagen-header">Imagen</th>
              <th>Nombre</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th className="acciones-cell">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map(articulo => (
              <tr key={articulo.id} className={editingId === articulo.id ? 'edit-row' : ''}>
                {editingId === articulo.id ? (
                  /* --- MODO EDICIÓN --- */
                  <>
                    {/* 5. ¡CAMPO ACTUALIZADO A <select>! */}
                    <td className="articulo-imagen-cell">
                      <select
                        name="imagenUrl"
                        value={editFormData.imagenUrl}
                        onChange={handleEditChange}
                      >
                        <option value="">-- Sin imagen --</option>
                        {listaDeImagenes.map(imagen => (
                          <option key={imagen} value={`/icons/${imagen}`}>
                            {imagen}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td><input type="text" name="nombre" value={editFormData.nombre} onChange={handleEditChange} /></td>
                    <td><input type="text" name="precioCompra" value={editFormData.precioCompra} onChange={handleEditChange} /></td>
                    <td><input type="text" name="precioVenta" value={editFormData.precioVenta} onChange={handleEditChange} /></td>
                    <td><input type="text" name="stock" value={editFormData.stock} onChange={handleEditChange} /></td>
                    <td className="acciones-cell">
                      <button onClick={handleUpdateSubmit} className="btn-guardar">Guardar</button>
                      <button type="button" onClick={handleCancelEdit} className="btn-cancelar">Cancelar</button>
                    </td>
                  </>
                ) : (
                  /* --- MODO VISTA --- */
                  <>
                    <td className="articulo-imagen-cell">
                      {articulo.imagenUrl && <img src={articulo.imagenUrl} alt={articulo.nombre} />}
                    </td>
                    <td>{articulo.nombre}</td>
                    <td>${articulo.precioCompra.toLocaleString('es-CO')}</td>
                    <td>${articulo.precioVenta.toLocaleString('es-CO')}</td>
                    <td>{(Number(articulo.stock) || 0).toFixed(2)}</td>
                    <td className="acciones-cell">
                      <button onClick={() => handleEditClick(articulo)} className="btn-editar">Editar</button>
                      <button onClick={() => handleDelete(articulo.id)} className="btn-borrar">Borrar</button>
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


export default PaginaArticulos;
