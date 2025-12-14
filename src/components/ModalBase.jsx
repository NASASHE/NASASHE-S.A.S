// src/components/ModalBase.jsx

import React, { useState } from 'react';
import './ModalBase.css'; // Importamos el estilo

// Este es un componente "tonto". Recibe funciones de su padre.
function ModalBase({ baseAnterior, onContinuar, onNuevaBase }) {
  
  const [mostrarFormNuevaBase, setMostrarFormNuevaBase] = useState(false);
  const [nuevaBase, setNuevaBase] = useState('');

  const handleGuardarNueva = (e) => {
    e.preventDefault();
    const monto = Number(nuevaBase);
    if (monto > 0) {
      onNuevaBase(monto); // Llama a la función del padre
    } else {
      alert("Por favor, ingrese un monto válido.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Bienvenido</h2>
        <p>¿Desea continuar con la base en caja anterior?</p>
        
        <div className="base-anterior">
          ${baseAnterior.toLocaleString('es-CO')}
        </div>

        <div className="modal-actions">
          {/* Botón 1: Continuar */}
          <button 
            className="btn-continuar"
            onClick={() => onContinuar(baseAnterior)} // Llama a la función del padre
          >
            Sí, continuar
          </button>
          
          {/* Botón 2: Ingresar nueva */}
          <button 
            className="btn-nueva"
            onClick={() => setMostrarFormNuevaBase(true)}
          >
            No, ingresar nueva base
          </button>
        </div>

        {/* Formulario que aparece si tocas "No" */}
        {mostrarFormNuevaBase && (
          <form onSubmit={handleGuardarNueva} className="nueva-base-form">
            <label htmlFor="nuevaBase">Monto de la nueva base:</label>
            <input
              id="nuevaBase"
              type="number"
              placeholder="0"
              value={nuevaBase}
              onChange={(e) => setNuevaBase(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-continuar">
              Guardar Nueva Base
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalBase;