// src/pages/PaginaArticulos.jsx

// 1. IMPORTAMOS 'useState' y 'useEffect' de React
import React, { useState, useEffect } from 'react';

// 2. IMPORTAMOS 'db' y las funciones de Firestore que necesitamos
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore'; // ¡AÑADIMOS 'addDoc'!

function PaginaArticulos() {
  
  // --- Estados de la lista ---
  const [loading, setLoading] = useState(true);
  const [articulos, setArticulos] = useState([]);

  // --- Estados del NUEVO FORMULARIO ---
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoStock, setNuevoStock] = useState('');
  
  // 3. MOVIMOS LA LÓGICA DE 'LEER' A SU PROPIA FUNCIÓN
  //    La llamaremos cada vez que necesitemos refrescar la lista
  const fetchArticulos = async () => {
    setLoading(true); // Empezamos a cargar
    try {
      const querySnapshot = await getDocs(collection(db, "articulos"));
      const articulosLista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticulos(articulosLista);
      setLoading(false); // Terminamos de cargar
    } catch (error) {
      console.error("Error al traer los datos: ", error);
      setLoading(false);
    }
  };

  // 4. useEffect (Esto no cambia)
  //    Se ejecuta 1 sola vez y llama a la función de leer
  useEffect(() => {
    fetchArticulos();
  }, []); // El '[]' vacío asegura que se ejecute solo una vez

  // 5. NUEVA FUNCIÓN: 'handleSubmit' (Manejar envío del formulario)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Convertimos los valores del formulario a los tipos correctos
    const precioNumerico = Number(nuevoPrecio);
    const stockNumerico = Number(nuevoStock);

    // Validación simple
    if (!nuevoNombre || precioNumerico <= 0) {
      alert("Por favor, completa el nombre y un precio válido.");
      return;
    }

    try {
      // Usamos 'addDoc' para AÑADIR un nuevo documento a la colección 'articulos'
      await addDoc(collection(db, "articulos"), {
        nombre: nuevoNombre,
        precio: precioNumerico,
        stock: stockNumerico
      });

      // ¡Éxito! Limpiamos el formulario
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevoStock('');

      // Y lo más importante: ¡Refrescamos la lista de artículos!
      await fetchArticulos();

    } catch (error) {
      console.error("Error al añadir el documento: ", error);
      alert("Hubo un error al guardar el artículo.");
    }
  };

  // 6. RENDERIZADO (lo que se ve)
  return (
    <div>
      <h1>Módulo de Artículos</h1>
      <p>Aquí puedes gestionar tu inventario.</p>

      {/* --- NUEVO FORMULARIO --- */}
      <hr />
      <h2>Añadir Nuevo Artículo</h2>
      {/* - 'onSubmit' llama a nuestra función 'handleSubmit'
        - 'value' conecta el input al estado (ej: nuevoNombre)
        - 'onChange' actualiza el estado cada vez que escribes
      */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre: </label>
          <input 
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
        </div>
        <div>
          <label>Precio: </label>
          <input 
            type="number"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
          />
        </div>
        <div>
          <label>Stock: </label>
          <input 
            type="number"
            value={nuevoStock}
            onChange={(e) => setNuevoStock(e.target.value)}
          />
        </div>
        <button type="submit">Guardar Artículo</button>
      </form>

      {/* --- LISTA DE ARTÍCULOS (Como estaba antes) --- */}
      <hr />
      <h2>Inventario Actual en Firebase</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {articulos.map(articulo => (
            <li key={articulo.id}>
              <strong>{articulo.nombre}</strong> - 
              Precio: ${articulo.precio} - 
              Stock: {articulo.stock}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaginaArticulos;