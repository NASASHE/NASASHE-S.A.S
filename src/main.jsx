// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { HashRouter } from 'react-router-dom';
import { CajaProvider } from './context/CajaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CajaProvider>
      {/* HashRouter funciona perfecto en GitHub Pages + Tauri */}
      <HashRouter>
        <App />
      </HashRouter>
    </CajaProvider>
  </React.StrictMode>
);