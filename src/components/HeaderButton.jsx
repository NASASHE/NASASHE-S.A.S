import React from 'react';
import './HeaderButton.css';
// 1. IMPORTAMOS 'Link'
import { Link } from 'react-router-dom';
import { resolveAssetPath } from '../utils/assetPath';

// 2. AÑADIMOS 'to' A LAS PROPS
function HeaderButton({ texto, icono, to }) {
  const iconoResuelto = resolveAssetPath(icono);

  return (
    // 3. REEMPLAZAMOS 'a' POR 'Link' Y 'href' POR 'to'
    <Link to={to} className="header-button">
      
      <img 
        src={iconoResuelto} 
        alt={texto} 
        className="header-button-icon" 
      />
      
      <span>{texto}</span>

    </Link> // 4. Cerramos con Link
  );
}

export default HeaderButton;
