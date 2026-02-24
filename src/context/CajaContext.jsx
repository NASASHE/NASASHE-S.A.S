// src/context/CajaContext.jsx

import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
  waitForPendingWrites
} from 'firebase/firestore';
import {
  CONSECUTIVOS_META,
  DEFAULT_BLOCK_SIZE,
  formatConsecutivo,
  getBloqueRef,
  getOrCreateDeviceId,
  getStoredDeviceAlias,
  reservarBloque,
  setStoredDeviceAlias,
} from '../services/consecutivos';

const CajaContext = createContext();

const movimientosCajaRef = collection(db, "movimientos_caja");
const consecDocRef = doc(db, "configuracion", "consecutivos");
const getInitialOnlineState = () => (typeof window === 'undefined' ? true : navigator.onLine);
const BLOQUE_MIN_DISPONIBLES = 10;
const MODULOS_CONSECUTIVOS = Object.keys(CONSECUTIVOS_META);

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
  const [bloquesConsecutivos, setBloquesConsecutivos] = useState({});
  const [deviceId] = useState(getOrCreateDeviceId);
  const [deviceAlias, setDeviceAlias] = useState(() => getStoredDeviceAlias(getOrCreateDeviceId()));
  const [baseEstablecida, setBaseEstablecida] = useState(getInitialBaseEstablecida);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(getInitialOnlineState);
  const [isSyncing, setIsSyncing] = useState(false);
  const reservasPreventivasRef = useRef({});

  useEffect(() => {
    let unsubscribeCaja = () => {};
    let unsubscribeConsec = () => {};
    let unsubscribeBloques = [];

    const clearBloqueListeners = () => {
      unsubscribeBloques.forEach((fn) => fn());
      unsubscribeBloques = [];
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      unsubscribeCaja();
      unsubscribeConsec();
      clearBloqueListeners();
      setBloquesConsecutivos({});
      reservasPreventivasRef.current = {};

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

          unsubscribeBloques = Object.keys(CONSECUTIVOS_META).map((modulo) =>
            onSnapshot(
              getBloqueRef(deviceId, modulo, user.uid),
              (docSnap) => {
                const bloqueData = docSnap.exists() ? docSnap.data() : null;
                const aliasRemoto = String(bloqueData?.deviceAlias || '').trim();
                const aliasGuardado = getStoredDeviceAlias(deviceId);
                if (aliasRemoto && aliasRemoto !== aliasGuardado) {
                  setDeviceAlias(aliasRemoto);
                  setStoredDeviceAlias(aliasRemoto, deviceId);
                }
                setBloquesConsecutivos((prev) => ({
                  ...prev,
                  [modulo]: bloqueData,
                }));
              },
              (error) => {
                console.error(`Error al escuchar bloque de consecutivo (${modulo}): `, error);
              },
            )
          );
        } catch (error) {
          console.error("Error al cargar datos iniciales: ", error);
        }
      } else {
        setBase(0);
        setBaseGuardada(0);
        setBaseEstablecida(false);
        setUserProfile(null);
        setBloquesConsecutivos({});
        sessionStorage.removeItem('baseEstablecida');
      }

      setLoadingAuth(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCaja();
      unsubscribeConsec();
      clearBloqueListeners();
    };
  }, [deviceId]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const syncPendingWrites = async () => {
      if (!navigator.onLine) return;
      setIsSyncing(true);
      try {
        await waitForPendingWrites(db);
      } catch (error) {
        console.error("No se pudo confirmar la sincronizacion offline:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      syncPendingWrites();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsSyncing(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      syncPendingWrites();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getUsuarioMovimiento = () =>
    userProfile?.nombre || currentUser?.displayName || currentUser?.email || 'SISTEMA';

  const actualizarAliasDispositivo = (aliasInput) => {
    const aliasFinal = setStoredDeviceAlias(aliasInput, deviceId);
    setDeviceAlias(aliasFinal);
    return aliasFinal;
  };

  const getBloqueNormalizado = (modulo) => {
    const raw = bloquesConsecutivos?.[modulo];
    if (!raw) return null;

    const inicio = Number(raw.inicio);
    const fin = Number(raw.fin);
    const siguiente = Number(raw.siguiente);

    if (!Number.isFinite(inicio) || !Number.isFinite(fin) || !Number.isFinite(siguiente)) {
      return null;
    }

    return {
      ...raw,
      inicio,
      fin,
      siguiente,
    };
  };

  const getDisponiblesEnBloque = (bloque) => {
    if (!bloque) return 0;
    return Math.max(bloque.fin - bloque.siguiente + 1, 0);
  };

  const reservarBloqueParaModulo = async ({
    modulo,
    targetDeviceId = deviceId,
    targetOwnerUid = currentUser?.uid,
    targetDeviceAlias = deviceAlias,
    blockSize = DEFAULT_BLOCK_SIZE,
  }) => {
    if (!CONSECUTIVOS_META[modulo]) {
      throw new Error(`Modulo no soportado para consecutivos: ${modulo}`);
    }

    if (!isOnline) {
      throw new Error('Sin internet para reservar un nuevo bloque de consecutivos.');
    }
    if (!targetOwnerUid) {
      throw new Error('No hay un usuario autenticado para reservar bloque.');
    }

    const reservado = await reservarBloque({
      deviceId: targetDeviceId,
      deviceAlias: targetDeviceAlias,
      ownerUid: targetOwnerUid,
      modulo,
      blockSize,
      actor: getUsuarioMovimiento(),
    });

    if (targetDeviceId === deviceId && targetOwnerUid === currentUser?.uid) {
      setBloquesConsecutivos((prev) => ({
        ...prev,
        [modulo]: {
          ...(prev?.[modulo] || {}),
          inicio: reservado.inicio,
          fin: reservado.fin,
          siguiente: reservado.siguiente,
          tamano: reservado.tamano,
          deviceId: targetDeviceId,
          deviceAlias: targetDeviceAlias,
          ownerUid: targetOwnerUid,
          modulo,
        },
      }));
    }

    return reservado;
  };

  const reservarBloquePreventivo = async (modulo, targetOwnerUid) => {
    if (!isOnline || !targetOwnerUid || !CONSECUTIVOS_META[modulo]) return;

    const key = `${targetOwnerUid}__${deviceId}__${modulo}`;
    if (reservasPreventivasRef.current[key]) return;

    reservasPreventivasRef.current[key] = true;
    try {
      await reservarBloqueParaModulo({
        modulo,
        targetOwnerUid,
      });
    } catch (error) {
      console.error(`No se pudo reservar bloque preventivo (${modulo}):`, error);
    } finally {
      delete reservasPreventivasRef.current[key];
    }
  };

  useEffect(() => {
    if (!currentUser?.uid || !isOnline) return undefined;

    let cancelled = false;

    const prepararBloquesParaOffline = async () => {
      for (const modulo of MODULOS_CONSECUTIVOS) {
        if (cancelled) return;

        const bloque = getBloqueNormalizado(modulo);
        const ownerOk = bloque?.ownerUid === currentUser.uid;
        const disponibles = getDisponiblesEnBloque(bloque);

        if (!ownerOk || disponibles <= 0) {
          try {
            await reservarBloqueParaModulo({
              modulo,
              targetOwnerUid: currentUser.uid,
            });
          } catch (error) {
            console.error(`No se pudo preparar bloque offline (${modulo}):`, error);
          }
          continue;
        }

        if (disponibles <= BLOQUE_MIN_DISPONIBLES) {
          void reservarBloquePreventivo(modulo, currentUser.uid);
        }
      }
    };

    void prepararBloquesParaOffline();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid, isOnline, deviceId]);

  const obtenerConsecutivoParaModulo = async (modulo) => {
    if (!CONSECUTIVOS_META[modulo]) {
      throw new Error(`Modulo no soportado para consecutivos: ${modulo}`);
    }
    const currentUid = currentUser?.uid;
    if (!currentUid) {
      throw new Error('No hay usuario autenticado para generar consecutivos.');
    }

    let bloque = getBloqueNormalizado(modulo);
    if (!bloque || bloque.ownerUid !== currentUid || bloque.siguiente > bloque.fin) {
      const reservado = await reservarBloqueParaModulo({
        modulo,
        targetOwnerUid: currentUid,
      });
      bloque = {
        inicio: reservado.inicio,
        fin: reservado.fin,
        siguiente: reservado.siguiente,
        ownerUid: currentUid,
      };
    }

    if (!bloque || bloque.siguiente > bloque.fin) {
      throw new Error('No hay consecutivos disponibles para este modulo.');
    }

    const disponibles = getDisponiblesEnBloque(bloque);
    if (isOnline && disponibles <= BLOQUE_MIN_DISPONIBLES) {
      void reservarBloquePreventivo(modulo, currentUid);
    }

    const numero = bloque.siguiente;
    return {
      numero,
      consecutivo: formatConsecutivo(modulo, numero),
      bloqueRef: getBloqueRef(deviceId, modulo, currentUid),
    };
  };

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
    consecutivosData,
    bloquesConsecutivos,
    deviceId,
    deviceAlias,
    obtenerConsecutivoParaModulo,
    reservarBloqueParaModulo,
    actualizarAliasDispositivo,
    isOnline,
    isSyncing
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
