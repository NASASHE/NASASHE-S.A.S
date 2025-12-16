// src/components/MainLayout.jsx

import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

import Header from './Header';
import Footer from './Footer';
import ModalBase from './ModalBase';

import { useCaja } from '../context/CajaContext';

function MainLayout() {
  const {
    currentUser,
    setCurrentUser,      // ✅ NECESARIO en el context
    baseEstablecida,
    baseGuardada,
    establecerBase,
  } = useCaja();

  const [authChecked, setAuthChecked] = useState(false);

  // ✅ 1) Esperar a Firebase Auth (producción / GitHub Pages)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // user = null si no hay sesión
      setCurrentUser(user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [setCurrentUser]);

  // ✅ Mientras Firebase responde, mostramos loading
  if (!authChecked) {
    return (
      <div style={{ padding: 20 }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // ✅ 2) Si NO hay usuario, manda al login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ✅ 3) Si hay usuario pero NO base, muestra modal para base
  if (!baseEstablecida) {
    return (
      <ModalBase
        baseAnterior={baseGuardada}
        onContinuar={(monto) => establecerBase(monto)}
        onNuevaBase={(monto) => establecerBase(monto)}
      />
    );
  }

  // ✅ 4) Si hay usuario y base OK, muestra app
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
