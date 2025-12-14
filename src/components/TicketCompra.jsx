// src/components/TicketCompra.jsx

import React from 'react'; // ¡Quitamos 'forwardRef'!
import Barcode from 'react-barcode';
import './TicketCompra.css';

const normalizarFechaCompra = (valorFecha) => {
  if (!valorFecha) {
    return new Date();
  }

  if (valorFecha instanceof Date) {
    return valorFecha;
  }

  if (typeof valorFecha === 'string') {
    const fechaParseada = new Date(valorFecha);
    return Number.isNaN(fechaParseada.getTime()) ? new Date() : fechaParseada;
  }

  if (typeof valorFecha === 'object' && typeof valorFecha.toDate === 'function') {
    return valorFecha.toDate();
  }

  return new Date();
};

// No usamos forwardRef
  function TicketCompra({ compraData, usuario }) {

  if (!compraData) return null;

  const fecha = normalizarFechaCompra(compraData.fecha).toLocaleString('es-CO');
  const consecutivo = compraData.consecutivo || 'SIN-CONSECUTIVO';
  // No necesitamos 'ref' aquí
  return (
    <div className="ticket-container">
      {/* 1. Encabezado */}
      <div className="ticket-header">
        <h3>TICKET DE COMPRA</h3>
        <p>RECICLADORA NASASHE S.A.S</p>
        <p>901907763-3</p>
        <p>Calle 98#9B-35</p>
        <p>Barranquilla - Atlantico</p>
        <p>605-000-0000</p>
      </div>

      {/* 2. Info y Barcode */}
      <div className="ticket-info">
        <p>Factura: {compraData.consecutivo}</p>
        <p>Actividad: Compra</p>
        <p>Fecha: {fecha}</p>
        <p>Facturado por: {usuario?.nombre || 'USUARIO'}</p>
      </div>

      <div className="ticket-barcode">
        <Barcode 
          value={compraData.consecutivo.replace(/\D/g, '')}
          format="CODE128"
          displayValue={false}
          margin={0}
        />
      </div>

      {/* 3. Items */}
      <div className="ticket-items">
        <table>
          <thead>
            <tr>
              <th className="col-mat">Material</th>
              <th className="col-cant">Cant</th>
              <th className="col-prec">Prec</th>
              <th className="col-tot">Total</th>
            </tr>
          </thead>
          <tbody>
            {compraData.items.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td className="col-cant">{(Number(item.cantidad) || 0).toFixed(2)}</td>
                <td className="col-prec">${item.precioCompra}</td>
                <td className="col-tot">${item.subtotal.toLocaleString('es-CO')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Totales */}
      <div className="ticket-totales">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>${compraData.total.toLocaleString('es-CO')}</span>
        </div>
        <div className="total-row">
          <span>IVA (0%):</span>
          <span>$0</span>
        </div>
        <div className="total-row final">
          <span>Total:</span>
          <span>${compraData.total.toLocaleString('es-CO')}</span>
        </div>
      </div>

      {/* 5. Pie de página */}
      <div className="ticket-footer">
        <p>NO SE ACEPTAN RECLAMOS O DEVOLUCIONES UNA VEZ RETIRADO O RECIBIDO SU MATERIAL.</p>
        <p>¡ Gracias por su venta !</p>
      </div>
    </div>
  );
}

export default TicketCompra;