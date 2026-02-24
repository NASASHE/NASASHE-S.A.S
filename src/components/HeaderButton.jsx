import React from 'react';
import './HeaderButton.css';
// 1. IMPORTAMOS 'Link'
import { Link } from 'react-router-dom';

// 2. AÑADIMOS 'to' A LAS PROPS
function HeaderButton({ texto, icono, to }) {

  return (
    // 3. REEMPLAZAMOS 'a' POR 'Link' Y 'href' POR 'to'
    <Link to={to} className="header-button">
      
      <img 
        src={icono} 
        alt={texto} 
        className="header-button-icon" 
      />
      
      <span>{texto}</span>

    </Link> // 4. Cerramos con Link
  );
}

export default HeaderButton;