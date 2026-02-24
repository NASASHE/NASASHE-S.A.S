// src/components/MainLayout.jsx

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCaja } from '../context/CajaContext';
import ModalBase from './ModalBase';

function MainLayout() {
  const {
    currentUser,
    baseEstablecida,
    baseGuardada,
    establecerBase,
    isOnline,
    isSyncing,
  } = useCaja();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser && !baseEstablecida) {
    return (
      <ModalBase
        baseAnterior={baseGuardada}
        onContinuar={(monto) => establecerBase(monto, { registrarMovimiento: false })}
        onNuevaBase={(monto) => establecerBase(monto, { registrarMovimiento: true })}
      />
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'center',
          color: '#fff',
          backgroundColor: isOnline ? '#2f855a' : '#c53030',
        }}
      >
        {isOnline
          ? (isSyncing ? 'Conectado. Sincronizando cambios pendientes...' : 'Conectado.')
          : 'Sin internet. Trabajando en modo offline; se sincronizara al reconectar.'}
      </div>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
