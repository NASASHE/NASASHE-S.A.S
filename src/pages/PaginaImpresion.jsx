// src/pages/PaginaImpresion.jsx

import React, { useState, useEffect } from 'react';
//         CORRECTO
//        import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'; // Para cerrar la ventana
//        import { appWindow } from '@tauri-apps/api/window'; // Para cerrar la ventana
//        import TicketCompra from '../components/TicketCompra';
//        (Aquí importaremos TicketVenta, etc., más adelante)

import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'; // Para cerrar la ventana
import TicketCompra from '../components/TicketCompra';
import TicketInventario from '../components/TicketInventario';
// (Aquí importaremos TicketVenta, etc., más adelante)


import '../components/TicketCompra.css'; // Importa los estilos del ticket

// Función para "revivir" las fechas de Firebase que mueren en JSON.stringify
//       const revivirFechas = (key, value) => {
  // Asumimos que tus fechas se guardan como objetos { seconds, nanoseconds }

  const isTauriEnvironment = () => typeof window !== 'undefined' && Boolean(window.__TAURI_INTERNALS__);

  const revivirFechas = (key, value) => {
    if (typeof value === 'object' && value !== null && 'seconds' in value && 'nanoseconds' in value) {
      return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
    }
    // O si ya se convirtieron a string ISO
    if (key === 'fecha' && typeof value === 'string' && value.includes('T') && value.endsWith('Z')) {
      return new Date(value);
    }
    return value;
};


//      function PaginaImpresion() {
//         const [ticket, setTicket] = useState(null);

  function PaginaImpresion() {
    const [ticket, setTicket] = useState(null);

    const closePrintWindow = async () => {
      if (!isTauriEnvironment()) {
        window.close();
        return;
      }

      try {
        const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
        const currentWindow = getCurrentWebviewWindow();
        currentWindow.close();
      } catch (error) {
        console.error('No se pudo cerrar la ventana de impresión de Tauri:', error);
        window.close();
      }
    };  

  // 1. Cargar datos   desde localStorage al iniciar
  useEffect(() => {
    try {
      const dataString = localStorage.getItem('ticketData');
      const userString = localStorage.getItem('ticketUser');
      const type = localStorage.getItem('ticketType');

      if (dataString && userString && type) {
        
        // Usamos la función 'revivirFechas' al parsear
        const data = JSON.parse(dataString, revivirFechas);
        const user = JSON.parse(userString);
        
        setTicket({ data, user, type });

        // Limpiar localStorage para que no se re-use
        localStorage.removeItem('ticketData');
        localStorage.removeItem('ticketUser');
        localStorage.removeItem('ticketType');
      } else {
        console.error("No se encontraron datos de impresión en localStorage.");
      }
    } catch (error) {
      console.error("Error al leer datos de impresión:", error);
    }
  }, []); // Se ejecuta solo una vez al cargar

  // 2. Imprimir y cerrar cuando los datos estén listos
  useEffect(() => {
    if (ticket) {
      // Esperar un breve momento para que React renderice el ticket
      const timer = setTimeout(() => {
        
        // 2.1. Escuchar el evento de "después de imprimir"
          // const handleAfterPrint = () => {
          // appWindow.close(); // Cierra la ventana de Tauri
          // const currentWindow = getCurrentWebviewWindow();
          // currentWindow.close(); // Cierra la ventana de Tauri

          const handleAfterPrint = () => {
            try {
              if (window.__TAURI__) {
                const currentWindow = getCurrentWebviewWindow();
                currentWindow.close();
              } else {
                window.close();
              }
            } catch (error) {
              console.warn('No se pudo cerrar la ventana de impresión automáticamente:', error);
            }
         };
        window.onafterprint = handleAfterPrint;

        // 2.2. Llamar a la impresión
        window.print();

        // 2.3. Fallback por si onafterprint no funciona
        // (En algunos sistemas, 'onfocus' se dispara al cerrar el diálogo)
        window.onfocus = () => setTimeout(handleAfterPrint, 500);

      }, 100); // 100ms de retraso

      return () => clearTimeout(timer);
    }
  }, [ticket]); // Se ejecuta cuando 'ticket' cambia

  // --- Renderizado ---
  if (!ticket) {
    return <div style={{ fontFamily: 'monospace', padding: '10px' }}>Cargando ticket...</div>;
  }

  // Usamos un 'switch' para decidir qué ticket renderizar
  switch (ticket.type) {
//            case 'compra':
//                return <TicketCompra compraData={ticket.data} usuario={ticket.user} />;
    
    case 'compra':
      return <TicketCompra compraData={ticket.data} usuario={ticket.user} />;
    case 'inventario':
      return <TicketInventario inventarioData={ticket.data} usuario={ticket.user} />;

    // (Aquí añadiremos 'venta', 'gasto', etc. después)
    
    default:
      return <div>Error: Tipo de ticket no reconocido.</div>;
  }
}

export default PaginaImpresion;