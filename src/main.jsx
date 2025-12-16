// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { CajaProvider } from './context/CajaContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CajaProvider>
      <BrowserRouter basename="/NASASHE-SAS">
        <App />
      </BrowserRouter>
    </CajaProvider>
  </React.StrictMode>
);
