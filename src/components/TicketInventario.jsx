// src/components/TicketInventario.jsx

import React from 'react';
import './TicketCompra.css';

function TicketInventario({ inventarioData, usuario }) {
  if (!inventarioData || !Array.isArray(inventarioData.items) || inventarioData.items.length === 0) {
    return (
      <div className="ticket-container">
        <div className="ticket-header">
          <h3>REPORTE DE INVENTARIO</h3>
          <p>No hay artículos para mostrar.</p>
        </div>
      </div>
    );
  }

  const fechaGeneracion = inventarioData.fechaGeneracion
    ? new Date(inventarioData.fechaGeneracion)
    : new Date();

  const totalArticulos = inventarioData.items.length;

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h3>REPORTE DE INVENTARIO</h3>
        <p>RECICLADORA NASASHE S.A.S</p>
        <p>901907763-3</p>
        <p>Calle 98#9B-35</p>
        <p>Barranquilla - Atlantico</p>
        <p>605-000-0000</p>
      </div>

      <div className="ticket-info">
        <p>Fecha: {fechaGeneracion.toLocaleString('es-CO')}</p>
        <p>Generado por: {usuario?.nombre || 'USUARIO'}</p>
      </div>

      <div className="ticket-items">
        <table>
          <thead>
            <tr>
              <th className="col-mat">Material</th>
              <th className="col-tot">Stock (kg/und)</th>
            </tr>
          </thead>
          <tbody>
            {inventarioData.items.map((item) => (
              <tr key={item.id}>
                <td className="col-mat">{item.nombre}</td>
                <td className="col-tot">{(Number(item.stock) || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ticket-totales">
        <div className="total-row final">
          <span>Total de artículos:</span>
          <span>{totalArticulos}</span>
        </div>
      </div>

      <div className="ticket-footer">
        <p>Inventario generado automáticamente.</p>
      </div>
    </div>
  );
}

export default TicketInventario;
