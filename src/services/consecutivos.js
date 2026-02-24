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

export const getBloqueDocId = (deviceId, modulo) => `${modulo}__${deviceId}`;

export const getBloqueRef = (deviceId, modulo) =>
  doc(db, BLOQUES_COLLECTION, getBloqueDocId(deviceId, modulo));

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

  const size = Math.max(1, normalizarNumero(blockSize) || DEFAULT_BLOCK_SIZE);
  const consecutivosRef = getConsecutivosRef();
  const bloqueRef = getBloqueRef(deviceId, modulo);

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
