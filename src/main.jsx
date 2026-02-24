// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { CajaProvider } from './context/CajaContext';
import { isTauri } from './tauriSafe';

// Solo aplica basename cuando la base es absoluta (hosting web).
const baseUrl = import.meta.env.BASE_URL || '/';
const routerBasename =
  baseUrl.startsWith('/') && baseUrl !== '/' ? baseUrl.replace(/\/$/, '') : undefined;
const Router = isTauri ? HashRouter : BrowserRouter;
const routerProps = isTauri ? {} : { basename: routerBasename };

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CajaProvider>
      <Router {...routerProps}>
        <App />
      </Router>
    </CajaProvider>
  </React.StrictMode>,
);
