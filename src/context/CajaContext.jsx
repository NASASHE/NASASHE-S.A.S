// src/context/CajaContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc
} from 'firebase/firestore';

const CajaContext = createContext();

const movimientosCajaRef = collection(db, "movimientos_caja");
const consecDocRef = doc(db, "configuracion", "consecutivos");

const getInitialBaseEstablecida = () => sessionStorage.getItem('baseEstablecida') === 'true';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const calcularSaldoDesdeSnapshot = (snapshot) => {
  let saldo = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data?.anulado === true) return;

    const monto = toNumber(data?.monto);
    if (data?.tipo === 'ingreso') {
      saldo += Math.abs(monto);
      return;
    }
    if (data?.tipo === 'egreso') {
      saldo -= Math.abs(monto);
      return;
    }
    if (data?.tipo === 'ajuste') {
      saldo += monto;
    }
  });

  return saldo;
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
      unsubscribeCaja();
      unsubscribeConsec();

      if (user) {
        try {
          const userDocRef = doc(db, "usuarios", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            console.error("No se encontro el perfil de usuario en Firestore.");
            setUserProfile(null);
          }

          unsubscribeCaja = onSnapshot(
            movimientosCajaRef,
            (snapshot) => {
              const saldoCalculado = calcularSaldoDesdeSnapshot(snapshot);
              setBaseGuardada(saldoCalculado);
              if (getInitialBaseEstablecida()) {
                setBase(saldoCalculado);
              }
            },
            (error) => {
              console.error("Error al escuchar movimientos de caja: ", error);
            }
          );

          unsubscribeConsec = onSnapshot(
            consecDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data();
                setConsecutivos(data.compras ?? 0);
                setConsecutivosData(data);
              } else {
                alert("Error de configuracion: no se encontro el documento 'consecutivos'.");
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

  const getUsuarioMovimiento = () =>
    userProfile?.nombre || currentUser?.displayName || currentUser?.email || 'SISTEMA';

  const registrarMovimientoCaja = async ({
    tipo,
    monto,
    descripcion = '',
    referencia = null
  }) => {
    const montoNum = Number(monto);
    if (!Number.isFinite(montoNum)) {
      throw new Error("El monto del movimiento no es valido.");
    }

    if ((tipo === 'ingreso' || tipo === 'egreso') && montoNum <= 0) {
      throw new Error("El monto debe ser mayor que cero.");
    }

    if (tipo === 'ajuste' && montoNum === 0) {
      throw new Error("El ajuste no puede ser cero.");
    }

    const payload = {
      tipo,
      monto: tipo === 'ajuste' ? montoNum : Math.abs(montoNum),
      descripcion: descripcion.trim(),
      fecha: Timestamp.now(),
      usuario: getUsuarioMovimiento(),
      anulado: false
    };

    if (referencia?.coleccion && referencia?.id) {
      payload.referencia = referencia;
    }

    await addDoc(movimientosCajaRef, payload);
  };

  const anularMovimientoCaja = async (movimientoId, motivo = '') => {
    if (!movimientoId) {
      throw new Error("Debe indicar el ID del movimiento a anular.");
    }

    const movimientoRef = doc(db, "movimientos_caja", movimientoId);
    await updateDoc(movimientoRef, {
      anulado: true,
      motivoAnulacion: motivo.trim() || 'Sin motivo',
      fechaAnulacion: Timestamp.now(),
      usuarioAnulacion: getUsuarioMovimiento()
    });
  };

  const establecerBase = async (monto, options = {}) => {
    const { registrarMovimiento = true } = options;
    const montoNum = Number(monto);

    if (!Number.isFinite(montoNum) || montoNum < 0) {
      alert("Ingresa un monto valido de base.");
      return;
    }

    try {
      if (registrarMovimiento) {
        const diferencia = montoNum - baseGuardada;
        if (diferencia !== 0) {
          await registrarMovimientoCaja({
            tipo: 'ajuste',
            monto: diferencia,
            descripcion: "Ajuste manual de base de caja"
          });
        }
      }

      setBase(montoNum);
      setBaseEstablecida(true);
      sessionStorage.setItem('baseEstablecida', 'true');
    } catch (error) {
      console.error("Error al establecer la base:", error);
      alert(`No se pudo establecer la base: ${error.message}`);
    }
  };

  const restarDeLaBase = async (monto, descripcion = 'Salida manual de caja') => {
    const montoNum = Number(monto);
    if (!Number.isFinite(montoNum) || montoNum <= 0) {
      alert("El monto a restar debe ser mayor que cero.");
      return;
    }

    if (montoNum > base) {
      alert("El monto a restar supera la base actual.");
      return;
    }

    try {
      await registrarMovimientoCaja({
        tipo: 'egreso',
        monto: montoNum,
        descripcion
      });
    } catch (error) {
      console.error("Error al restar de la base:", error);
      alert(`No se pudo restar de la base: ${error.message}`);
    }
  };

  const sumarALaBase = async (monto, descripcion = 'Ingreso manual de caja') => {
    const montoNum = Number(monto);
    if (!Number.isFinite(montoNum) || montoNum <= 0) {
      alert("El monto a agregar debe ser mayor que cero.");
      return;
    }

    try {
      await registrarMovimientoCaja({
        tipo: 'ingreso',
        monto: montoNum,
        descripcion
      });
    } catch (error) {
      console.error("Error al sumar a la base:", error);
      alert(`No se pudo agregar a la base: ${error.message}`);
    }
  };

  const value = {
    base,
    baseGuardada,
    baseEstablecida,
    establecerBase,
    restarDeLaBase,
    sumarALaBase,
    registrarMovimientoCaja,
    anularMovimientoCaja,
    currentUser,
    loadingAuth,
    userProfile,
    setBase,
    consecutivos,
    consecutivosData
  };

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
