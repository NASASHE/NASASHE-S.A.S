// src/pages/PaginaConfiguracion.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCaja } from '../context/CajaContext';
import {
  CONSECUTIVOS_META,
  DEFAULT_BLOCK_SIZE,
  reservarBloque,
} from '../services/consecutivos';
import './PaginaConfiguracion.css';

const consecDocRef = doc(db, 'configuracion', 'consecutivos');

const toNumberOrZero = (valor) => {
  const num = Number(valor);
  if (Number.isNaN(num) || num < 0) return 0;
  return num;
};

const toPositiveInt = (valor, fallback = DEFAULT_BLOCK_SIZE) => {
  const num = Number(valor);
  if (!Number.isFinite(num) || num <= 0) return fallback;
  return Math.floor(num);
};

function PaginaConfiguracion() {
  const {
    userProfile,
    currentUser,
    deviceId,
    reservarBloqueParaModulo,
  } = useCaja();
  const esAdmin = userProfile?.rol === 'admin';

  const [valores, setValores] = useState({
    compras: '',
    ventas: '',
    gastos: '',
    ventasMenores: '',
    remisiones: '',
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const [bloques, setBloques] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(true);
  const [mensajeBloques, setMensajeBloques] = useState('');
  const [reservandoBloque, setReservandoBloque] = useState(false);

  const [bloqueForm, setBloqueForm] = useState({
    deviceId: '',
    ownerUid: '',
    modulo: 'ventas',
    tamano: String(DEFAULT_BLOCK_SIZE),
  });

  const modulos = useMemo(() => Object.keys(CONSECUTIVOS_META), []);

  useEffect(() => {
    const cargarConsecutivos = async () => {
      setCargando(true);
      try {
        const docSnap = await getDoc(consecDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setValores({
            compras: (data.compras ?? 0).toString(),
            ventas: (data.ventas ?? 0).toString(),
            gastos: (data.gastos ?? 0).toString(),
            ventasMenores: (data.ventasMenores ?? 0).toString(),
            remisiones: (data.remisiones ?? 0).toString(),
          });
        } else {
          setMensaje("No se encontro el documento de consecutivos en la base de datos.");
        }
      } catch (error) {
        console.error('Error al cargar consecutivos:', error);
        setMensaje('No se pudieron cargar los consecutivos. Intenta nuevamente.');
      }
      setCargando(false);
    };

    cargarConsecutivos();
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    setBloqueForm((prev) => {
      if (prev.deviceId && prev.ownerUid) return prev;
      return {
        ...prev,
        deviceId: prev.deviceId || deviceId,
        ownerUid: prev.ownerUid || currentUser?.uid || '',
      };
    });
  }, [deviceId, currentUser?.uid]);

  useEffect(() => {
    if (!esAdmin) return undefined;

    const bloquesRef = collection(db, 'consecutivo_bloques');
    const unsubscribe = onSnapshot(
      bloquesRef,
      (snapshot) => {
        const items = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .sort((a, b) => {
            const moduloCmp = String(a.modulo || '').localeCompare(String(b.modulo || ''));
            if (moduloCmp !== 0) return moduloCmp;
            return String(a.deviceId || '').localeCompare(String(b.deviceId || ''));
          });

        setBloques(items);
        setCargandoBloques(false);
      },
      (error) => {
        console.error('Error al escuchar bloques de consecutivos:', error);
        setCargandoBloques(false);
      },
    );

    return () => unsubscribe();
  }, [esAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setValores((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!esAdmin) {
      alert('Solo un administrador puede modificar los consecutivos.');
      return;
    }

    const nuevosValores = {
      compras: toNumberOrZero(valores.compras),
      ventas: toNumberOrZero(valores.ventas),
      gastos: toNumberOrZero(valores.gastos),
      ventasMenores: toNumberOrZero(valores.ventasMenores),
      remisiones: toNumberOrZero(valores.remisiones),
    };

    setGuardando(true);
    setMensaje('');
    try {
      await updateDoc(consecDocRef, nuevosValores);
      setValores({
        compras: nuevosValores.compras.toString(),
        ventas: nuevosValores.ventas.toString(),
        gastos: nuevosValores.gastos.toString(),
        ventasMenores: nuevosValores.ventasMenores.toString(),
        remisiones: nuevosValores.remisiones.toString(),
      });
      setMensaje('Consecutivos globales actualizados.');
    } catch (error) {
      console.error('Error al actualizar consecutivos:', error);
      setMensaje('No se pudieron actualizar los consecutivos. Intentalo de nuevo.');
    }
    setGuardando(false);
  };

  const handleBloqueFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tamano' && !/^\d*$/.test(value)) return;
    setBloqueForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReservarBloqueActual = async () => {
    if (!bloqueForm.modulo) return;
    setReservandoBloque(true);
    setMensajeBloques('');
    try {
      const tamano = toPositiveInt(bloqueForm.tamano);
      await reservarBloqueParaModulo({
        modulo: bloqueForm.modulo,
        blockSize: tamano,
      });
      setMensajeBloques(
        `Bloque reservado para este dispositivo (${deviceId}) en ${bloqueForm.modulo}.`,
      );
    } catch (error) {
      console.error('Error al reservar bloque para dispositivo actual:', error);
      setMensajeBloques(error.message || 'No se pudo reservar el bloque.');
    }
    setReservandoBloque(false);
  };

  const handleReservarBloqueManual = async (e) => {
    e.preventDefault();

    const targetDeviceId = String(bloqueForm.deviceId || '').trim();
    if (!targetDeviceId) {
      setMensajeBloques('Debes escribir un deviceId para reservar el bloque.');
      return;
    }
    const targetOwnerUid = String(bloqueForm.ownerUid || '').trim();
    if (!targetOwnerUid) {
      setMensajeBloques('Debes escribir el ownerUid del usuario que usara ese dispositivo.');
      return;
    }

    if (!modulos.includes(bloqueForm.modulo)) {
      setMensajeBloques('Modulo invalido para reservar bloque.');
      return;
    }

    setReservandoBloque(true);
    setMensajeBloques('');

    try {
      const tamano = toPositiveInt(bloqueForm.tamano);
      await reservarBloque({
        deviceId: targetDeviceId,
        ownerUid: targetOwnerUid,
        modulo: bloqueForm.modulo,
        blockSize: tamano,
        actor: userProfile?.nombre || 'ADMIN',
      });
      setMensajeBloques(
        `Bloque reservado: ${bloqueForm.modulo} para ${targetDeviceId} (owner ${targetOwnerUid}, tamano ${tamano}).`,
      );
    } catch (error) {
      console.error('Error al reservar bloque manual:', error);
      setMensajeBloques(error.message || 'No se pudo reservar el bloque manualmente.');
    }

    setReservandoBloque(false);
  };

  const renderCampo = (name, label, prefijo) => {
    const valorNumero = toNumberOrZero(valores[name]);
    return (
      <div className="configuracion-campo" key={name}>
        <label htmlFor={name}>{label}</label>
        <div className="configuracion-input-row">
          <div className="configuracion-prefijo">{prefijo}</div>
          <input
            id={name}
            name={name}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={valores[name]}
            onChange={handleChange}
            placeholder="Ultimo consecutivo reservado"
          />
        </div>
        <p className="configuracion-hint">
          Siguiente valor global reservado: <strong>{`${prefijo}-${(valorNumero + 1).toString().padStart(6, '0')}`}</strong>
        </p>
      </div>
    );
  };

  const renderEstadoBloque = (bloque) => {
    const inicio = Number(bloque?.inicio ?? 0);
    const fin = Number(bloque?.fin ?? 0);
    const siguiente = Number(bloque?.siguiente ?? 0);
    const disponibles = Math.max(fin - siguiente + 1, 0);

    return {
      inicio,
      fin,
      siguiente,
      disponibles,
    };
  };

  if (!userProfile) {
    return (
      <div className="configuracion-container">
        <h1>Configuracion de consecutivos</h1>
        <p className="configuracion-estado">Cargando datos de usuario...</p>
      </div>
    );
  }

  if (!esAdmin) {
    return (
      <div className="configuracion-container">
        <h1>Configuracion de consecutivos</h1>
        <p className="configuracion-alerta">
          Solo los administradores pueden gestionar consecutivos y bloques.
        </p>
      </div>
    );
  }

  return (
    <div className="configuracion-container">
      <h1>Configuracion de consecutivos</h1>
      <p className="configuracion-descripcion">
        Los consecutivos globales ahora reservan rangos para bloques por dispositivo. Cada equipo toma su bloque y puede operar offline.
      </p>

      {cargando ? (
        <p className="configuracion-estado">Cargando datos...</p>
      ) : (
        <form className="configuracion-form" onSubmit={handleGuardar}>
          <div className="configuracion-grid">
            {renderCampo('ventas', 'Factura de venta a proveedor', 'FAV')}
            {renderCampo('ventasMenores', 'Factura de venta menor', 'FAVMI')}
            {renderCampo('compras', 'Factura de compra', 'FAC')}
            {renderCampo('gastos', 'Comprobante de gasto', 'GAS')}
            {renderCampo('remisiones', 'Remisiones', 'REM')}
          </div>

          <button type="submit" className="configuracion-boton" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Actualizar consecutivos globales'}
          </button>

          {mensaje && <p className="configuracion-estado">{mensaje}</p>}
        </form>
      )}

      <hr style={{ margin: '24px 0' }} />

      <section>
        <h2>Bloques por dispositivo</h2>
        <p>
          Dispositivo actual: <strong>{deviceId}</strong>
        </p>

        <form onSubmit={handleReservarBloqueManual} style={{ display: 'grid', gap: '8px', maxWidth: '720px' }}>
          <label htmlFor="bloqueDeviceId">Device ID</label>
          <input
            id="bloqueDeviceId"
            name="deviceId"
            type="text"
            value={bloqueForm.deviceId}
            onChange={handleBloqueFieldChange}
            placeholder="ID del dispositivo destino"
          />

          <label htmlFor="bloqueOwnerUid">Owner UID</label>
          <input
            id="bloqueOwnerUid"
            name="ownerUid"
            type="text"
            value={bloqueForm.ownerUid}
            onChange={handleBloqueFieldChange}
            placeholder="UID del usuario propietario del bloque"
          />

          <label htmlFor="bloqueModulo">Modulo</label>
          <select
            id="bloqueModulo"
            name="modulo"
            value={bloqueForm.modulo}
            onChange={handleBloqueFieldChange}
          >
            {modulos.map((modulo) => (
              <option key={modulo} value={modulo}>{modulo}</option>
            ))}
          </select>

          <label htmlFor="bloqueTamano">Tamano del bloque</label>
          <input
            id="bloqueTamano"
            name="tamano"
            type="text"
            inputMode="numeric"
            value={bloqueForm.tamano}
            onChange={handleBloqueFieldChange}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleReservarBloqueActual}
              disabled={reservandoBloque}
            >
              {reservandoBloque ? 'Reservando...' : 'Reservar para este dispositivo'}
            </button>
            <button type="submit" disabled={reservandoBloque}>
              {reservandoBloque ? 'Reservando...' : 'Reservar/Reasignar manualmente'}
            </button>
          </div>
        </form>

        {mensajeBloques && <p className="configuracion-estado">{mensajeBloques}</p>}

        {cargandoBloques ? (
          <p className="configuracion-estado">Cargando bloques...</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '12px' }}>
            <table className="configuracion-tabla-bloques" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Modulo</th>
                  <th>Device ID</th>
                  <th>Owner UID</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Siguiente</th>
                  <th>Disponibles</th>
                  <th>Tamano</th>
                  <th>Asignado por</th>
                </tr>
              </thead>
              <tbody>
                {bloques.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center' }}>No hay bloques asignados.</td>
                  </tr>
                ) : (
                  bloques.map((bloque) => {
                    const estado = renderEstadoBloque(bloque);
                    return (
                      <tr key={bloque.id}>
                        <td>{bloque.modulo || 'N/A'}</td>
                        <td>{bloque.deviceId || 'N/A'}</td>
                        <td>{bloque.ownerUid || 'N/A'}</td>
                        <td>{estado.inicio}</td>
                        <td>{estado.fin}</td>
                        <td>{estado.siguiente}</td>
                        <td>{estado.disponibles}</td>
                        <td>{bloque.tamano || '-'}</td>
                        <td>{bloque.asignadoPor || 'SISTEMA'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default PaginaConfiguracion;
