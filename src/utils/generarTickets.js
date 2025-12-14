// src/utils/generarTickets.js
// (Añadidas las funciones para Venta y Venta Menor)

// --- FUNCIÓN DE TICKET DE COMPRA (Existente) ---
export const generarTextoTicketCompra = (compraData, usuario) => {
  const fecha = compraData.fecha.toDate ?
                compraData.fecha.toDate().toLocaleString('es-CO') :
                new Date(compraData.fecha).toLocaleString('es-CO');

  const reciclador = (compraData.reciclador || '').toString().trim() || 'N/A';
  
  const centrar = (texto, ancho) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };
  
  const ancho = 45; // 45 caracteres

  let contenido = centrar("TICKET DE COMPRA", ancho) + "\n";
  contenido += centrar("RECICLADORA NASASHE S.A.S", ancho) + "\n";
  contenido += centrar("901907763-3", ancho) + "\n";
  contenido += centrar("Calle 98#9B-35", ancho) + "\n";
  contenido += centrar("Barranquilla - Atlantico", ancho) + "\n";
  contenido += centrar("605-000-0000", ancho) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += `Factura: ${compraData.consecutivo}\n`;
  contenido += "Actividad: Compra\n";
  contenido += `Fecha: ${fecha}\n`;
  contenido += `Facturado por: ${usuario?.nombre || 'SISTEMA'}\n`;
  contenido += `Reciclador: ${reciclador}\n`;
  contenido += "-".repeat(ancho) + "\n";
  contenido += "Material".padEnd(19) + "Cant.".padStart(6) + "Prec.".padStart(9) + "Total".padStart(11) + "\n";
  contenido += "-".repeat(ancho) + "\n";

  compraData.items.forEach(item => {
    const nombre = item.nombre.length > 18 ? item.nombre.substring(0, 18) : item.nombre;
    const cant = item.cantidad.toString();
    const prec = item.precioCompra.toLocaleString('es-CO');
    const tot = item.subtotal.toLocaleString('es-CO');
    contenido += nombre.padEnd(19) + cant.padStart(6) + prec.padStart(9) + tot.padStart(11) + "\n";
  });

  contenido += "-".repeat(ancho) + "\n";
  const anchoTotal = ancho - 10;
  contenido += "Subtotal:".padEnd(10) + `${compraData.total.toLocaleString('es-CO')}`.padStart(anchoTotal) + "\n";
  contenido += "IVA (0%):".padEnd(10) + `${"$0"}`.padStart(anchoTotal) + "\n";
  contenido += "Total:".padEnd(10) + `${compraData.total.toLocaleString('es-CO')}`.padStart(anchoTotal) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += centrar("NO SE ACEPTAN RECLAMOS O DEVOLUCIONES", ancho) + "\n";
  contenido += centrar("UNA VEZ RETIRADO O RECIBIDO SU MATERIAL.", ancho) + "\n\n";
  contenido += centrar("¡ Gracias por su venta !", ancho) + "\n";

  return contenido;
};


// --- ¡NUEVA FUNCIÓN DE TICKET DE VENTA! ---
export const generarTextoTicketVenta = (ventaData, usuario) => {
  const fecha = ventaData.fecha.toDate ?
                ventaData.fecha.toDate().toLocaleString('es-CO') :
                new Date(ventaData.fecha).toLocaleString('es-CO');

  const proveedorNombre = (ventaData?.proveedor?.nombre || '').toString().trim() || 'N/A';
  const proveedorNit = (ventaData?.proveedor?.nit || '').toString().trim() || 'N/A';
  
  const centrar = (texto, ancho) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };
  
  const ancho = 45;

  let contenido = centrar("TICKET DE VENTA", ancho) + "\n";
  contenido += centrar("RECICLADORA NASASHE S.A.S", ancho) + "\n";
  contenido += centrar("901907763-3", ancho) + "\n";
  contenido += centrar("Calle 98#9B-35", ancho) + "\n";
  contenido += centrar("Barranquilla - Atlantico", ancho) + "\n";
  contenido += centrar("605-000-0000", ancho) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += `Factura: ${ventaData.consecutivo}\n`;
  contenido += "Actividad: Venta\n";
  contenido += `Fecha: ${fecha}\n`;
  contenido += `Vendido por: ${usuario?.nombre || 'SISTEMA'}\n`;
  contenido += `Cliente: ${proveedorNombre}\n`;
  contenido += `NIT: ${proveedorNit}\n`;
  contenido += "-".repeat(ancho) + "\n";
  contenido += "Material".padEnd(19) + "Cant.".padStart(6) + "Prec.".padStart(9) + "Total".padStart(11) + "\n";
  contenido += "-".repeat(ancho) + "\n";

  ventaData.items.forEach(item => {
    const nombre = item.nombre.length > 18 ? item.nombre.substring(0, 18) : item.nombre;
    const cant = item.cantidad.toString();
    const prec = item.precioVenta.toLocaleString('es-CO'); // <-- precioVenta
    const tot = item.subtotal.toLocaleString('es-CO');
    contenido += nombre.padEnd(19) + cant.padStart(6) + prec.padStart(9) + tot.padStart(11) + "\n";
  });

  contenido += "-".repeat(ancho) + "\n";
  const anchoTotal = ancho - 10;
  contenido += "Subtotal:".padEnd(10) + `${ventaData.total.toLocaleString('es-CO')}`.padStart(anchoTotal) + "\n";
  contenido += "IVA (0%):".padEnd(10) + `${"$0"}`.padStart(anchoTotal) + "\n";
  contenido += "Total:".padEnd(10) + `${ventaData.total.toLocaleString('es-CO')}`.padStart(anchoTotal) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += centrar("NO SE ACEPTAN RECLAMOS O DEVOLUCIONES", ancho) + "\n";
  contenido += centrar("UNA VEZ RETIRADO O RECIBIDO SU MATERIAL.", ancho) + "\n\n";
  contenido += centrar("¡ Gracias por su compra !", ancho) + "\n";

  return contenido;
};


// --- ¡NUEVA FUNCIÓN DE TICKET DE VENTA MENOR! ---
export const generarTextoTicketVentaMenor = (ventaData, usuario) => {
  const fecha = ventaData.fecha.toDate ?
                ventaData.fecha.toDate().toLocaleString('es-CO') :
                new Date(ventaData.fecha).toLocaleString('es-CO');

  const cliente = (ventaData?.cliente || '').toString().trim() || 'N/A';
  
  const centrar = (texto, ancho) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };
  
  const ancho = 45;

  let contenido = centrar("TICKET DE VENTA MENOR", ancho) + "\n";
  contenido += centrar("RECICLADORA NASASHE S.A.S", ancho) + "\n";
  contenido += centrar("901907763-3", ancho) + "\n";
  contenido += centrar("Calle 98#9B-35", ancho) + "\n";
  contenido += centrar("Barranquilla - Atlantico", ancho) + "\n";
  contenido += centrar("605-000-0000", ancho) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += `Factura: ${ventaData.consecutivo}\n`;
  contenido += "Actividad: Venta Menor\n";
  contenido += `Fecha: ${fecha}\n`;
  contenido += `Vendido por: ${usuario?.nombre || 'SISTEMA'}\n`;
  contenido += `Cliente: ${cliente}\n`; // Cliente (no proveedor)
  contenido += "-".repeat(ancho) + "\n";
  contenido += "Descripción".padEnd(19) + "Cant.".padStart(6) + "Prec.".padStart(9) + "Total".padStart(11) + "\n";
  contenido += "-".repeat(ancho) + "\n";

  ventaData.items.forEach(item => {
    const desc = item.descripcion.length > 18 ? item.descripcion.substring(0, 18) : item.descripcion;
    const cant = item.cantidad.toString();
    const prec = item.precio.toLocaleString('es-CO');
    const tot = item.subtotal.toLocaleString('es-CO');
    contenido += desc.padEnd(19) + cant.padStart(6) + prec.padStart(9) + tot.padStart(11) + "\n";
  });

  contenido += "-".repeat(ancho) + "\n";
  const anchoTotal = ancho - 10;
  contenido += "Subtotal:".padEnd(10) + `${ventaData.total.toLocaleString('es-CO')}`.padStart(anchoTotal) + "\n";
  contenido += "IVA (0%):".padEnd(10) + `${"$0"}`.padStart(anchoTotal) + "\n";
  contenido += "Total:".padEnd(10) + `${ventaData.total.toLocaleString('es-CO')}`.padStart(anchoTotal) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += centrar("¡ Gracias por su compra !", ancho) + "\n";

  return contenido;
};


// --- ¡NUEVA FUNCIÓN DE TICKET DE GASTO (SALIDA)! ---
export const generarTextoTicketGasto = (gastoData, usuario) => {
  const fecha = gastoData.fecha.toDate ? 
                gastoData.fecha.toDate().toLocaleString('es-CO') : 
                new Date(gastoData.fecha).toLocaleString('es-CO');
  
  const centrar = (texto, ancho) => {
    const espacios = Math.max(0, Math.floor((ancho - texto.length) / 2));
    return " ".repeat(espacios) + texto;
  };
  
  const ancho = 45;

  let contenido = centrar("COMPROBANTE DE SALIDA", ancho) + "\n";
  contenido += centrar("RECICLADORA NASASHE S.A.S", ancho) + "\n";
  contenido += centrar("901907763-3", ancho) + "\n";
  contenido += centrar("Calle 98#9B-35", ancho) + "\n";
  contenido += centrar("Barranquilla - Atlantico", ancho) + "\n";
  contenido += centrar("605-000-0000", ancho) + "\n";
  contenido += "-".repeat(ancho) + "\n";
  contenido += `Comprobante: ${gastoData.consecutivo}\n`;
  contenido += "Actividad: Gasto / Egreso\n";
  contenido += `Fecha: ${fecha}\n`;
  contenido += `Registrado por: ${usuario?.nombre || 'SISTEMA'}\n`;
  contenido += "-".repeat(ancho) + "\n\n";
  
  contenido += `Concepto: ${gastoData.concepto}\n`;
  contenido += `Descripción: ${gastoData.descripcion}\n\n`;
  
  contenido += "-".repeat(ancho) + "\n";
  const anchoTotal = ancho - 10;
  contenido += "Total:".padEnd(10) + `${gastoData.monto.toLocaleString('es-CO')}`.padStart(anchoTotal) + "\n";
  contenido += "-".repeat(ancho) + "\n\n";
  
  contenido += "__________________________________\n";
  contenido += centrar("Firma Autorizado", 34) + "\n\n";
  contenido += "__________________________________\n";
  contenido += centrar("Firma Recibido", 34) + "\n";

  return contenido;
};