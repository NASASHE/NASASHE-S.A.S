// src/pages/PaginaImpresion.jsx
import React, { useEffect, useState } from 'react';
import {
  generarTextoTicketCompra,
  generarTextoTicketVenta,
  generarTextoTicketVentaMenor,
  generarTextoTicketGasto
} from '../utils/generarTickets';

import '../components/TicketCompra.css';

const isTauriEnvironment = () => typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

const revivirFechas = (key, value) => {
  if (typeof value === 'object' && value !== null && 'seconds' in value && 'nanoseconds' in value) {
    return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
  }
  if (key === 'fecha' && typeof value === 'string' && value.includes('T') && value.endsWith('Z')) {
    return new Date(value);
  }
  return value;
};

function PaginaImpresion() {
  const [ticket, setTicket] = useState(null);

  const closePrintWindow = async () => {
    if (!isTauriEnvironment()) {
      window.close();
      return;
    }
    try {
      const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
      getCurrentWebviewWindow().close();
    } catch (e) {
      window.close();
    }
  };

  useEffect(() => {
    try {
      const dataString = localStorage.getItem('ticketData');
      const userString = localStorage.getItem('ticketUser');
      const type = localStorage.getItem('ticketType');

      if (dataString && userString && type) {
        const data = JSON.parse(dataString, revivirFechas);
        const user = JSON.parse(userString);
        setTicket({ data, user, type });

        localStorage.removeItem('ticketData');
        localStorage.removeItem('ticketUser');
        localStorage.removeItem('ticketType');
      }
    } catch (error) {
      console.error('Error al leer datos de impresión:', error);
    }
  }, []);

  useEffect(() => {
    if (!ticket) return;

    const timer = setTimeout(() => {
      const handleAfterPrint = () => {
        try { closePrintWindow(); } catch { /* noop */ }
      };

      window.onafterprint = handleAfterPrint;
      window.print();
      window.onfocus = () => setTimeout(handleAfterPrint, 500);
    }, 100);

    return () => clearTimeout(timer);
  }, [ticket]);

  if (!ticket) {
    return <div style={{ fontFamily: 'monospace', padding: 10 }}>Cargando ticket...</div>;
  }

  let texto = '';
  if (ticket.type === 'compra') texto = generarTextoTicketCompra(ticket.data, ticket.user);
  else if (ticket.type === 'venta') texto = generarTextoTicketVenta(ticket.data, ticket.user);
  else if (ticket.type === 'ventaMenor') texto = generarTextoTicketVentaMenor(ticket.data, ticket.user);
  else if (ticket.type === 'gasto') texto = generarTextoTicketGasto(ticket.data, ticket.user);
  else texto = 'Error: Tipo de ticket no reconocido.';

  return (
    <div style={{ fontFamily: 'Courier New, Courier, monospace', fontSize: 10, padding: 8 }}>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{texto}</pre>
    </div>
  );
}

export default PaginaImpresion;
