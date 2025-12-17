// src/utils/remisionPdf.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BASE = import.meta.env.BASE_URL;

const cargarImagenComoBase64 = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = url;
  });

export async function generarPdfRemision(remisionData) {
  const pdf = new jsPDF({ unit: 'mm', format: 'letter' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 12;
  let cursorY = margin;

  // Logo
  try {
    const logoPath = encodeURI(`${BASE}logo con fondo.png`);
    const logoData = await cargarImagenComoBase64(logoPath);
    pdf.addImage(logoData, 'PNG', margin, cursorY, 40, 20);
  } catch {}

  pdf.setFontSize(16);
  pdf.text('NASASHE S.A.S.', pageWidth / 2, cursorY + 6, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text('901.907.763-3', pageWidth / 2, cursorY + 12, { align: 'center' });
  pdf.text('Calle 98 9B 35', pageWidth / 2, cursorY + 18, { align: 'center' });
  pdf.text('Barranquilla - Atlantico', pageWidth / 2, cursorY + 24, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text('REMISIÓN', pageWidth - margin, cursorY + 8, { align: 'right' });
  pdf.setFontSize(10);
  pdf.text(remisionData.consecutivo || '', pageWidth - margin, cursorY + 14, { align: 'right' });

  cursorY += 32;

  // Datos destino
  pdf.setFontSize(10);
  pdf.text(`Destino: ${remisionData.destino?.nombre || 'N/D'}`, margin, cursorY);
  pdf.text(`NIT: ${remisionData.destino?.nit || 'N/D'}`, margin, cursorY + 6);
  pdf.text(`Dirección: ${remisionData.destino?.direccion || 'N/D'}`, pageWidth / 2, cursorY);
  pdf.text(`Teléfono: ${remisionData.destino?.telefono || 'N/D'}`, pageWidth / 2, cursorY + 6);

  cursorY += 14;

  // Datos conductor
  const fecha = remisionData.fecha?.toDate ? remisionData.fecha.toDate() : new Date(remisionData.fecha || Date.now());
  pdf.text(`Fecha emisión: ${fecha.toLocaleString('es-CO')}`, margin, cursorY);

  cursorY += 6;
  pdf.text(`Conductor: ${remisionData.conductor?.nombre || 'N/D'}`, margin, cursorY);
  pdf.text(`Cédula: ${remisionData.conductor?.cedula || 'N/D'}`, pageWidth / 2, cursorY);

  cursorY += 6;
  pdf.text(`Dirección: ${remisionData.conductor?.direccion || 'N/D'}`, margin, cursorY);

  cursorY += 6;
  pdf.text(`Vínculo: ${remisionData.conductor?.vinculo || 'N/D'}`, margin, cursorY);
  pdf.text(`Placa: ${remisionData.conductor?.placa || 'N/D'}`, pageWidth / 2, cursorY);

  cursorY += 6;
  pdf.text(`Celular: ${remisionData.conductor?.celular || 'N/D'}`, margin, cursorY);

  cursorY += 10;

  // Tabla items
  const rows = (remisionData.items || []).map((it, idx) => ([
    idx + 1,
    it.nombre || 'N/D',
    Number(it.cantidad || 0).toLocaleString('es-CO')
  ]));

  autoTable(pdf, {
    startY: cursorY,
    head: [['Item', 'Detalle del material', 'Cantidad (Kg)']],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [25, 94, 107] },
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 130 },
      2: { cellWidth: 30 }
    }
  });

  cursorY = pdf.lastAutoTable.finalY + 8;

  // Observaciones
  if (remisionData.observaciones) {
    pdf.setFontSize(10);
    pdf.text(`Observaciones: ${remisionData.observaciones}`, margin, cursorY);
    cursorY += 8;
  }

  // Firmas
  const firmY = Math.min(cursorY + 10, pageHeight - 35);
  const colW = (pageWidth - margin * 2) / 3;

  // Firma imagen (opcional)
  try {
    const firmaPath = encodeURI(`${BASE}Firma.jpg`);
    const firmaData = await cargarImagenComoBase64(firmaPath);
    const firmaX = margin + 4;
    pdf.addImage(firmaData, 'PNG', firmaX, firmY, colW - 8, 12);
  } catch {}

  pdf.setFontSize(10);
  pdf.text('Firma y sello quien diligencia', margin + 6, firmY + 16);
  pdf.text('Firma Conductor', margin + colW + 22, firmY + 16);
  pdf.text('Firma cliente y/o Recibidor', margin + colW * 2 + 10, firmY + 16);

  // Paginación
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  return pdf;
}

export function imprimirPdfBlob(pdf, titulo = 'Documento') {
  const blobUrl = pdf.output('bloburl');
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = blobUrl;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 1200);
  };
}

export function imprimirPdfDesdeUrl(url) {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 1200);
  };
}