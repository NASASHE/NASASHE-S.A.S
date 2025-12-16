// src/context/CajaContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  onSnapshot
} from 'firebase/firestore';

const CajaContext = createContext();

// Definimos las referencias una sola vez
const cajaDocRef = doc(db, "configuracion", "caja");
const consecDocRef = doc(db, "configuracion", "consecutivos");

const getInitialBaseEstablecida = () => {
  return sessionStorage.getItem('baseEstablecida') === 'true';
};

export function CajaProvider({ children }) {

  const [base, setBase] = useState(0);
  const [baseGuardada, setBaseGuardada] = useState(0);
  const [consecutivos, setConsecutivos] = useState(0);
  const [consecutivosData, setConsecutivosData] = useState({});
  const [baseEstablecida, setBaseEstablecida] = useState(getInitialBaseEstablecida);
  const [currentUser, setCurrentUser] = useState(null);

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {

    let unsubscribeCaja = () => {};
    let unsubscribeConsec = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // Limpiamos listeners anteriores cada vez que el usuario cambia
      unsubscribeCaja();
      unsubscribeConsec();

      if (user) {
        try {
          // 1) Cargar perfil
          const userDocRef = doc(db, "usuarios", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            console.error("No se encontró el perfil de usuario en Firestore.");
            setUserProfile(null);
          }

          // 2) Listener CAJA
          unsubscribeCaja = onSnapshot(
            cajaDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const baseDeFirebase = docSnap.data().baseActual ?? 0;
                setBaseGuardada(baseDeFirebase);

                if (getInitialBaseEstablecida()) {
                  setBase(baseDeFirebase);
                }
              } else {
                alert("Error de Configuración: No se encontró el documento 'caja'.");
              }
            },
            (error) => {
              console.error("Error al escuchar la caja: ", error);
            }
          );

          // 3) Listener CONSECUTIVOS
          unsubscribeConsec = onSnapshot(
            consecDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data();
                setConsecutivos(data.compras ?? 0);
                setConsecutivosData(data);
              } else {
                alert("Error de Configuración: No se encontró el documento 'consecutivos'.");
              }
            },
            (error) => {
              console.error("Error al escuchar consecutivos: ", error);
            }
          );

        } catch (error) {
          console.error("Error al cargar datos iniciales: ", error);
        }

      } else {
        // Limpieza si el usuario cierra sesión
        setBase(0);
        setBaseGuardada(0);
        setBaseEstablecida(false);
        setUserProfile(null);
        sessionStorage.removeItem('baseEstablecida');
      }

      setLoadingAuth(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCaja();
      unsubscribeConsec();
    };
  }, []);

  // --- Funciones ---
  const establecerBase = async (monto) => {
    const montoNum = Number(monto);
    try {
      await updateDoc(cajaDocRef, { baseActual: montoNum });
      setBase(montoNum);
      setBaseEstablecida(true);
      sessionStorage.setItem('baseEstablecida', 'true');
    } catch (error) {
      console.error("Error al guardar la base en Firebase:", error);
      alert("¡Error al guardar la base!");
    }
  };

  const restarDeLaBase = async (monto) => {
    const montoNum = Number(monto);
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      alert("El monto a restar debe ser mayor que cero.");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const cajaSnapshot = await transaction.get(cajaDocRef);
        if (!cajaSnapshot.exists()) throw new Error("No se encontró la configuración de caja.");

        const baseActual = cajaSnapshot.data().baseActual || 0;
        if (montoNum > baseActual) throw new Error("El monto a restar supera la base actual en caja.");

        const nuevaBase = baseActual - montoNum;
        transaction.update(cajaDocRef, { baseActual: nuevaBase });
        setBase(nuevaBase);
      });
    } catch (error) {
      console.error("Error al restar de la base:", error);
      alert(`No se pudo restar de la base: ${error.message}`);
    }
  };

  const sumarALaBase = async (monto) => {
    const montoNum = Number(monto);
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      alert("El monto a agregar debe ser mayor que cero.");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const cajaSnapshot = await transaction.get(cajaDocRef);
        if (!cajaSnapshot.exists()) throw new Error("No se encontró la configuración de caja.");

        const baseActual = cajaSnapshot.data().baseActual || 0;
        const nuevaBase = baseActual + montoNum;
        transaction.update(cajaDocRef, { baseActual: nuevaBase });
        setBase(nuevaBase);
      });
    } catch (error) {
      console.error("Error al sumar a la base:", error);
      alert(`No se pudo agregar a la base: ${error.message}`);
    }
  };

  // ✅ VALUE (CORREGIDO): ahora sí exponemos setCurrentUser
  const value = {
    base,
    baseGuardada,
    baseEstablecida,
    establecerBase,
    restarDeLaBase,
    sumarALaBase,

    currentUser,
    setCurrentUser,     // ✅ AÑADIDO

    loadingAuth,
    userProfile,
    setBase,

    consecutivos,
    consecutivosData,
  };

  // ✅ Mejor que retornar null (pantalla blanca)
  if (loadingAuth) {
    return <div style={{ padding: 20 }}>Cargando...</div>;
  }

  return (
    <CajaContext.Provider value={value}>
      {children}
    </CajaContext.Provider>
  );
}

export function useCaja() {
  const context = useContext(CajaContext);
  if (!context) {
    throw new Error('useCaja debe ser usado dentro de un CajaProvider');
  }
  return context;
}
