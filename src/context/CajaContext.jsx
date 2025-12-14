// src/context/CajaContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  runTransaction, 
  onSnapshot // Importamos todo lo necesario
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
  const [consecutivos, setConsecutivos] = useState(0); // El nuevo estado
  const [consecutivosData, setConsecutivosData] = useState({});
  const [baseEstablecida, setBaseEstablecida] = useState(getInitialBaseEstablecida);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // --- ESTE ES EL useEffect CORREGIDO ---
  useEffect(() => {
    
    let unsubscribeCaja = () => {}; // Funciones 'dummy' para limpiar
    let unsubscribeConsec = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Limpiamos listeners anteriores cada vez que el usuario cambia
      unsubscribeCaja();
      unsubscribeConsec();
      
      if (user) {
        try {
          // 1. Cargar perfil de usuario (esto solo se hace una vez)
          const userDocRef = doc(db, "usuarios", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            console.error("No se encontró el perfil de usuario en Firestore.");
          }

          // 2. Listener para la CAJA (se actualiza en tiempo real)
          unsubscribeCaja = onSnapshot(cajaDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const baseDeFirebase = docSnap.data().baseActual;
              setBaseGuardada(baseDeFirebase);
              if (getInitialBaseEstablecida()) {
                setBase(baseDeFirebase); // Actualiza la base activa
              }
            } else {
              alert("Error de Configuración: No se encontró el documento 'caja'.");
            }
          }, (error) => {
            console.error("Error al escuchar la caja: ", error);
          });

          // 3. Listener para los CONSECUTIVOS (se actualiza en tiempo real)
          unsubscribeConsec = onSnapshot(consecDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setConsecutivos(data.compras ?? 0); // Guardamos el número
              setConsecutivosData(data);
              console.log("¡Consecutivos actualizados (onSnapshot)!: ", data.compras);
            } else {
              alert("Error de Configuración: No se encontró el documento 'consecutivos'.");
            }
          }, (error) => {
            console.error("Error al escuchar consecutivos: ", error);
          });

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
      
      // ¡¡LA LÍNEA CLAVE!! Se llama al final
      setLoadingAuth(false); 
    });
    
    // El 'return' del useEffect limpia todo cuando el Contexto se desmonta
    return () => {
      unsubscribeAuth();
      unsubscribeCaja();
      unsubscribeConsec();
    };
  }, []); // El array vacío [] es correcto

  // --- Tus otras funciones (establecerBase, etc.) están perfectas ---
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
        if (!cajaSnapshot.exists()) {
          throw new Error("No se encontró la configuración de caja.");
        }

        const baseActual = cajaSnapshot.data().baseActual || 0;
        if (montoNum > baseActual) {
          throw new Error("El monto a restar supera la base actual en caja.");
        }

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
        if (!cajaSnapshot.exists()) {
          throw new Error("No se encontró la configuración de caja.");
        }

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

  // --- Objeto 'value' actualizado ---
  const value = {
    base,
    baseGuardada,
    baseEstablecida,
    establecerBase,
    restarDeLaBase,
    sumarALaBase,
    currentUser,
    loadingAuth,
    userProfile,
    setBase,
    consecutivos, // <-- Exponemos los consecutivos
    consecutivosData
  };

  // Esta parte está bien
  if (loadingAuth) {
    return null;
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
