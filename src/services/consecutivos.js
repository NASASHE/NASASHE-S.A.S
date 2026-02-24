import { db } from '../firebase';
import {
  doc,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';

export const DEFAULT_BLOCK_SIZE = 100;
export const BLOQUES_COLLECTION = 'consecutivo_bloques';
export const CONSECUTIVOS_DOC_PATH = ['configuracion', 'consecutivos'];

export const CONSECUTIVOS_META = {
  compras: {
    campo: 'compras',
    prefijo: 'FAC',
    pad: 5,
    separador: '',
  },
  ventas: {
    campo: 'ventas',
    prefijo: 'FAV',
    pad: 5,
    separador: '',
  },
  gastos: {
    campo: 'gastos',
    prefijo: 'GAS',
    pad: 5,
    separador: '',
  },
  ventasMenores: {
    campo: 'ventasMenores',
    prefijo: 'FAVMI',
    pad: 5,
    separador: '',
  },
  remisiones: {
    campo: 'remisiones',
    prefijo: 'REM',
    pad: 6,
    separador: '-',
  },
};

const DEVICE_ID_KEY = 'nasashe_device_id';
const DEVICE_ALIAS_KEY = 'nasashe_device_alias';

const getDefaultDeviceAlias = (deviceId) => {
  const shortId = String(deviceId || '').slice(0, 8).toUpperCase();
  return shortId ? `EQUIPO-${shortId}` : 'EQUIPO';
};

const normalizarAlias = (alias) => String(alias || '').trim();

const generarDeviceId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `dev-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

export const getOrCreateDeviceId = () => {
  if (typeof window === 'undefined') return 'server-device';
  const existente = localStorage.getItem(DEVICE_ID_KEY);
  if (existente) return existente;
  const nuevo = generarDeviceId();
  localStorage.setItem(DEVICE_ID_KEY, nuevo);
  return nuevo;
};

export const getStoredDeviceAlias = (deviceId = getOrCreateDeviceId()) => {
  if (typeof window === 'undefined') return getDefaultDeviceAlias(deviceId);
  const existente = localStorage.getItem(DEVICE_ALIAS_KEY);
  if (existente && existente.trim()) return existente.trim();
  return getDefaultDeviceAlias(deviceId);
};

export const setStoredDeviceAlias = (alias, deviceId = getOrCreateDeviceId()) => {
  const aliasNormalizado = normalizarAlias(alias) || getDefaultDeviceAlias(deviceId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEVICE_ALIAS_KEY, aliasNormalizado);
  }
  return aliasNormalizado;
};

export const getBloqueDocId = (deviceId, modulo, ownerUid) =>
  `${modulo}__${deviceId}__${ownerUid}`;

export const getBloqueRef = (deviceId, modulo, ownerUid) =>
  doc(db, BLOQUES_COLLECTION, getBloqueDocId(deviceId, modulo, ownerUid));

const getConsecutivosRef = () => doc(db, ...CONSECUTIVOS_DOC_PATH);

const normalizarNumero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatConsecutivo = (modulo, numero) => {
  const meta = CONSECUTIVOS_META[modulo];
  if (!meta) {
    throw new Error(`Modulo de consecutivo no soportado: ${modulo}`);
  }
  const serial = String(numero).padStart(meta.pad, '0');
  const separador = meta.separador || '';
  return `${meta.prefijo}${separador}${serial}`;
};

export const reservarBloque = async ({
  deviceId,
  deviceAlias,
  modulo,
  blockSize = DEFAULT_BLOCK_SIZE,
  actor = 'SISTEMA',
  ownerUid,
}) => {
  const meta = CONSECUTIVOS_META[modulo];
  if (!meta) {
    throw new Error(`Modulo de consecutivo no soportado: ${modulo}`);
  }
  if (!ownerUid || typeof ownerUid !== 'string') {
    throw new Error('No se pudo identificar el propietario del bloque (ownerUid).');
  }
  const aliasNormalizado = normalizarAlias(deviceAlias) || getDefaultDeviceAlias(deviceId);

  const size = Math.max(1, normalizarNumero(blockSize) || DEFAULT_BLOCK_SIZE);
  const consecutivosRef = getConsecutivosRef();
  const bloqueRef = getBloqueRef(deviceId, modulo, ownerUid);

  return runTransaction(db, async (transaction) => {
    const consecutivosSnap = await transaction.get(consecutivosRef);
    if (!consecutivosSnap.exists()) {
      throw new Error("No se encontro el documento 'configuracion/consecutivos'.");
    }

    const data = consecutivosSnap.data();
    const ultimoReservado = normalizarNumero(data?.[meta.campo]);
    const inicio = ultimoReservado + 1;
    const fin = ultimoReservado + size;

    transaction.update(consecutivosRef, {
      [meta.campo]: fin,
    });

    transaction.set(
      bloqueRef,
      {
        deviceId,
        deviceAlias: aliasNormalizado,
        ownerUid,
        modulo,
        inicio,
        fin,
        siguiente: inicio,
        tamano: size,
        actualizadoEn: Timestamp.now(),
        reservadoEn: Timestamp.now(),
        asignadoPor: actor,
      },
      { merge: true },
    );

    return {
      inicio,
      fin,
      siguiente: inicio,
      tamano: size,
      bloqueRef,
    };
  });
};
