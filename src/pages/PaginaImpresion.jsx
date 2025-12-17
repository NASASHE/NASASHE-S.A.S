// src/pages/PaginaImpresion.jsx
import React, { useEffect, useState } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import '../components/TicketCompra.css';

import {
  generarTextoTicketCompra,
  generarTextoTicketVenta,
  generarTextoTicketVentaMenor,
  generarTextoTicketGasto,
  generarTextoTicketInventario
} from '../utils/generarTickets';

const isTauriEnvironment = () =>
  typeof window !== 'undefined' && window.__TAURI__ && window.__TAURI_INTERNALS__;

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
      console.warn('No se pudo cerrar la ventana de impresión:', e);
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ticketData');
      const payload = raw ? JSON.parse(raw) : null;

      if (!payload?.tipo) {
        setTicket('No hay datos para imprimir.');
        return;
      }

      // ✅ Remisiones NO van por ticket 80mm
      if (payload.tipo === 'remision') {
        setTicket('Las remisiones se imprimen en PDF. Use "Ver PDF" o "Reimprimir PDF".');
        setTimeout(closePrintWindow, 1200);
        return;
      }

      const { tipo, data, user } = payload;

      const contenido = (() => {
        switch (tipo) {
          case 'compra': return generarTextoTicketCompra(data, user);
          case 'venta': return generarTextoTicketVenta(data, user);
          case 'ventaMenor': return generarTextoTicketVentaMenor(data, user);
          case 'gasto': return generarTextoTicketGasto(data, user);
          case 'inventario': return generarTextoTicketInventario(data, user);
          default: return 'Tipo de ticket no soportado.';
        }
      })();

      setTicket(contenido);

      setTimeout(() => {
        window.print();
        setTimeout(closePrintWindow, 900);
      }, 300);

    } catch (e) {
      console.error('Error al preparar impresión:', e);
      setTicket('Error al preparar impresión.');
    }
  }, []);

  return (
    <div className="ticket-container">
      <pre className="ticket-pre">
        {ticket || 'Cargando...'}
      </pre>
    </div>
  );
}

export default PaginaImpresion;
