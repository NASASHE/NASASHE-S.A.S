import React from 'react';
import './ModuleButton.css';
// 1. IMPORTAMOS 'Link'
import { Link } from 'react-router-dom';

// 2. AÑADIMOS 'to' A LAS PROPS
function ModuleButton({ titulo, descripcion, icono, to }) {
  
  return (
    // 3. REEMPLAZAMOS 'a' POR 'Link' Y 'href' POR 'to'
    <Link to={to} className="module-button">
      
      <img src={icono} alt={titulo} className="module-icon" />
      
      <div className="module-text">
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
      </div>

    </Link> // 4. Cerramos con Link
  );
}

export default ModuleButton;