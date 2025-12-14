// src/pages/PaginaConfiguracion.jsx

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
  const { userProfile } = useCaja();
  const esAdmin = userProfile?.rol === 'admin';

  const [valores, setValores] = useState({
    compras: '',
    ventas: '',
    gastos: '',
    ventasMenores: '',
    remisiones: ''
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

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
            remisiones: (data.remisiones ?? 0).toString()
          });
        } else {
          setMensaje('No se encontró el documento de consecutivos en la base de datos.');
        }
      } catch (error) {
        console.error('Error al cargar consecutivos:', error);
        setMensaje('No se pudieron cargar los consecutivos. Intenta nuevamente.');
      }
      setCargando(false);
    };

    cargarConsecutivos();
  }, []);

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
      remisiones: toNumberOrZero(valores.remisiones)
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
        remisiones: nuevosValores.remisiones.toString()
      });
      setMensaje('¡Consecutivos actualizados! El sistema usará el número siguiente en cada módulo.');
    } catch (error) {
      console.error('Error al actualizar consecutivos:', error);
      setMensaje('No se pudieron actualizar los consecutivos. Inténtalo de nuevo.');
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
            placeholder="Último consecutivo usado"
          />
        </div>
        <p className="configuracion-hint">
          Próximo número que generará el sistema: <strong>{`${prefijo}-${(valorNumero + 1).toString().padStart(6, '0')}`}</strong>
        </p>
      </div>
    );
  };

  if (!userProfile) {
    return (
      <div className="configuracion-container">
        <h1>Configuración de consecutivos</h1>
        <p className="configuracion-estado">Cargando datos de usuario...</p>
      </div>
    );
  }

  if (!esAdmin) {
    return (
      <div className="configuracion-container">
        <h1>Configuración de consecutivos</h1>
        <p className="configuracion-alerta">
          Solo los administradores pueden restablecer los consecutivos de facturación.
        </p>
      </div>
    );
  }

  return (
    <div className="configuracion-container">
      <h1>Configuración de consecutivos</h1>
      <p className="configuracion-descripcion">
        Define el último número emitido para cada módulo. El sistema usará automáticamente el siguiente número al guardar una nueva compra, venta o gasto.
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
            {guardando ? 'Guardando...' : 'Restablecer consecutivos'}
          </button>

          {mensaje && <p className="configuracion-estado">{mensaje}</p>}
        </form>
      )}
    </div>
  );
}

export default PaginaConfiguracion;
