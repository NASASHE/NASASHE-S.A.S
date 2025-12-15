// src/pages/PaginaImpresion.jsx
import React, { useEffect, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import '../components/TicketCompra.css';

import {
  generarTextoTicketCompra,
  generarTextoTicketVenta,
  generarTextoTicketVentaMenor,
  generarTextoTicketGasto,
  generarTextoTicketRemision,
  generarTextoTicketInventario
} from '../utils/generarTickets';

const isTauriEnvironment = () =>
  typeof window !== 'undefined' && (Boolean(window.__TAURI__) || Boolean(window.__TAURI_INTERNALS__));

const revivirFechas = (key, value) => {
  if (typeof value === 'object' && value !== null && 'seconds' in value && 'nanoseconds' in value) {
    return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
  }
  if (key === 'fecha' && typeof value === 'string' && value.includes('T')) return new Date(value);
  return value;
};

function PaginaImpresion() {
  const [ticket, setTicket] = useState(null);

  const closePrintWindow = async () => {
    try {
      if (isTauriEnvironment()) {
        const currentWindow = getCurrentWebviewWindow();
        currentWindow.close();
      } else {
        window.close();
      }
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

  const buildTexto = () => {
    if (!ticket) return 'Cargando...';
    const { type, data, user } = ticket;

    switch (type) {
      case 'compra': return generarTextoTicketCompra(data, user);
      case 'venta': return generarTextoTicketVenta(data, user);
      case 'ventaMenor': return generarTextoTicketVentaMenor(data, user);
      case 'gasto': return generarTextoTicketGasto(data, user);
      case 'remision': return generarTextoTicketRemision(data, user);

      case 'inventario': {
        const items = Array.isArray(data?.items) ? data.items : [];
        return generarTextoTicketInventario(items, user);
      }

      default:
        return `Error: Tipo de ticket no reconocido (${type})`;
    }
  };

  useEffect(() => {
    if (!ticket) return;

    const timer = setTimeout(() => {
      const handleAfterPrint = () => closePrintWindow();
      window.onafterprint = handleAfterPrint;

      window.print();
      window.onfocus = () => setTimeout(handleAfterPrint, 500);
    }, 100);

    return () => clearTimeout(timer);
  }, [ticket]);

  return (
    <div style={{ fontFamily: 'Courier New, monospace', fontSize: '10px', padding: '8px' }}>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{buildTexto()}</pre>
    </div>
  );
}

export default PaginaImpresion;
