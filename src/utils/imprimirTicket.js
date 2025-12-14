export const imprimirTicketEnNavegador = ({ titulo, textoTicket }) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }
  
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
  
      document.body.appendChild(iframe);
  
      const iframeWindow = iframe.contentWindow;
      const iframeDocument = iframeWindow?.document;
  
      if (!iframeWindow || !iframeDocument) {
        document.body.removeChild(iframe);
        return false;
      }
  
      let yaImprimio = false;
  
      const removeIframe = () => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      };
  
      const handleAfterPrint = () => {
        iframeWindow.removeEventListener('afterprint', handleAfterPrint);
        removeIframe();
      };
  
      iframe.onload = () => {
        iframeWindow.addEventListener('afterprint', handleAfterPrint);
  
        try {
          iframeWindow.focus();
          iframeWindow.print();
          yaImprimio = true;
        } catch (error) {
          console.error('Error al intentar imprimir el ticket en el iframe:', error);
          iframeWindow.removeEventListener('afterprint', handleAfterPrint);
          removeIframe();
        }
      };
  
      iframeDocument.open();
      iframeDocument.write(`<!DOCTYPE html><html><head><title>${titulo}</title><style>body { font-family: 'Courier New', Courier, monospace; font-size: 10px; width: 80mm; margin: 0; padding: 8px; } @page { margin: 2mm; size: 80mm auto; }</style></head><body><pre>${textoTicket}</pre></body></html>`);
      iframeDocument.close();
  
      // Respaldo por si el evento onload no se dispara correctamente
      setTimeout(() => {
        if (yaImprimio || !iframe.isConnected) {
          return;
        }
  
        iframeWindow.addEventListener('afterprint', handleAfterPrint);
  
        try {
          iframeWindow.focus();
          iframeWindow.print();
          yaImprimio = true;
        } catch (error) {
          console.error('Error en impresión de respaldo del ticket:', error);
          removeIframe();
        }
  
        setTimeout(() => {
          if (!yaImprimio && iframe.isConnected) {
            removeIframe();
          }
        }, 1500);
      }, 500);
  
      return true;
    } catch (error) {
      console.error('No se pudo preparar la impresión del ticket en el navegador:', error);
      return false;
    }
  };