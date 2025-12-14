// src/components/MainLayout.jsx

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCaja } from '../context/CajaContext';

// 1. ¡Importamos nuestro nuevo Modal!
import ModalBase from './ModalBase';

function MainLayout() {
  
  // 2. Traemos los nuevos estados del cerebro
  const { 
    currentUser, 
    baseEstablecida, 
    baseGuardada, 
    establecerBase 
  } = useCaja();

  // --- Lógica de Protección ---

  // 1. Si NO hay usuario, redirige a /login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si SÍ hay usuario, PERO no ha establecido la base...
  if (currentUser && !baseEstablecida) {
    // ¡Mostramos el Modal!
    return (
      <ModalBase 
        baseAnterior={baseGuardada}
        onContinuar={(monto) => establecerBase(monto)}
        onNuevaBase={(monto) => establecerBase(monto)}
      />
    );
  }

  // 3. Si SÍ hay usuario Y SÍ estableció la base...
  //    ¡Mostramos la aplicación!
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet /> {/* Aquí van Dashboard, Artículos, etc. */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;