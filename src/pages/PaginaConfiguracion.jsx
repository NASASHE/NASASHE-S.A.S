// src/pages/PaginaConfiguracion.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useCaja } from '../context/CajaContext';
import './PaginaConfiguracion.css';

const consecDocRef = doc(db, 'configuracion', 'consecutivos');

const toNumberOrZero = (valor) => {
  const num = Number(valor);
  if (Number.isNaN(num) || num < 0) return 0;
  return num;
};

function PaginaConfiguracion() {
  const {
    userProfile,
    deviceId,
    deviceAlias,
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
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);

  const usuariosPorUid = useMemo(
    () => Object.fromEntries(usuarios.map((u) => [u.id, u])),
    [usuarios],
  );

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
            const deviceCmp = String(a.deviceId || '').localeCompare(String(b.deviceId || ''));
            if (deviceCmp !== 0) return deviceCmp;
            return String(a.ownerUid || '').localeCompare(String(b.ownerUid || ''));
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

  useEffect(() => {
    if (!esAdmin) return undefined;

    const usuariosRef = collection(db, 'usuarios');
    const unsubscribe = onSnapshot(
      usuariosRef,
      (snapshot) => {
        const items = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .sort((a, b) =>
            String(a.nombre || a.email || a.id).localeCompare(String(b.nombre || b.email || b.id)),
          );
        setUsuarios(items);
        setCargandoUsuarios(false);
      },
      (error) => {
        console.error('Error al cargar usuarios para selector de bloques:', error);
        setCargandoUsuarios(false);
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
        Los consecutivos globales ahora reservan rangos para bloques por usuario y dispositivo. En la misma PC, cada usuario mantiene su propio bloque y puede operar offline.
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
          Dispositivo actual: <strong>{deviceAlias}</strong> ({deviceId})
        </p>
        <p className="configuracion-estado">
          La reserva manual fue desactivada. El sistema asigna bloques automaticamente por usuario, dispositivo y modulo.
        </p>
        <p className="configuracion-estado">
          Si hay internet, recarga bloques en segundo plano antes de agotarse. Sin internet, sigue operando con los bloques ya reservados.
        </p>
        {cargandoUsuarios && <p className="configuracion-estado">Cargando nombres de usuarios...</p>}

        {cargandoBloques ? (
          <p className="configuracion-estado">Cargando bloques...</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: '12px' }}>
            <table className="configuracion-tabla-bloques" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Modulo</th>
                  <th>Alias</th>
                  <th>Device ID</th>
                  <th>Usuario propietario</th>
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
                    <td colSpan="10" style={{ textAlign: 'center' }}>No hay bloques asignados.</td>
                  </tr>
                ) : (
                  bloques.map((bloque) => {
                    const estado = renderEstadoBloque(bloque);
                    return (
                      <tr key={bloque.id}>
                        <td>{bloque.modulo || 'N/A'}</td>
                        <td>{bloque.deviceAlias || 'N/A'}</td>
                        <td>{bloque.deviceId || 'N/A'}</td>
                        <td>
                          {usuariosPorUid[bloque.ownerUid]
                            ? `${usuariosPorUid[bloque.ownerUid].nombre || usuariosPorUid[bloque.ownerUid].email || bloque.ownerUid} (${bloque.ownerUid})`
                            : (bloque.ownerUid || 'N/A')}
                        </td>
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
