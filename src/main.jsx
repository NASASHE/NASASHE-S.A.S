// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom';

// 1. ¡Importamos nuestro nuevo Proveedor de Contexto!
import { CajaProvider } from './context/CajaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolvemos TODA la aplicación (incluyendo el Router)
           con el CajaProvider. Ahora CUALQUIER página
           podrá acceder al estado de la "Base".
    */}
    <CajaProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CajaProvider>
  </React.StrictMode>,
)