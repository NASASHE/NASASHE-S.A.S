// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { CajaProvider } from './context/CajaContext';

// En dev la app vive en '/', en produccion en '/NASASHE-SAS/'.
const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CajaProvider>
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </CajaProvider>
  </React.StrictMode>,
);
