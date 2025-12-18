// src/utils/remisionPdf.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE = import.meta.env.BASE_URL || "/";

// --- Helpers ---
const toDateSafe = (fecha) => {
  try {
    if (!fecha) return new Date();
    if (typeof fecha?.toDate === "function") return fecha.toDate(); // Firestore Timestamp
    if (fecha instanceof Date) return fecha;
    if (typeof fecha === "number") return new Date(fecha);
    if (typeof fecha === "string") return new Date(fecha);
    return new Date();
  } catch {
    return new Date();
  }
};

const cargarImagenComoBase64 = async (url) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo cargar imagen: ${url}`);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// ✅ Genera el PDF de una remisión (para guardar / reimprimir)
export const generarPdfRemision = async (remisionData) => {
  const pdf = new jsPDF({ unit: "mm", format: "letter" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 12;
  let y = margin;

  // Logo (Vite + GitHub Pages)
  try {
    const logoUrl = `${BASE}logo con fondo.png`;
    const logoData = await cargarImagenComoBase64(encodeURI(logoUrl));
    pdf.addImage(logoData, "PNG", margin, y, 40, 20);
  } catch (e) {
    console.warn("Logo no cargó:", e);
  }

  // Encabezado
  pdf.setFontSize(16);
  pdf.text("NASASHE S.A.S.", pageWidth / 2, y + 6, { align: "center" });
  pdf.setFontSize(10);
  pdf.text("901.907.763-3", pageWidth / 2, y + 12, { align: "center" });
  pdf.text("Calle 98 9B 35", pageWidth / 2, y + 18, { align: "center" });
  pdf.text("Tel: 3227377140", pageWidth / 2, y + 24, { align: "center" });

  pdf.setFontSize(14);
  pdf.text("REMISIÓN", pageWidth - margin, y + 10, { align: "right" });
  pdf.setFontSize(12);
  pdf.text(remisionData?.consecutivo || "REM-SIN-CONSECT", pageWidth - margin, y + 18, { align: "right" });

  y += 30;
  pdf.setFontSize(11);

  // Destino
  pdf.text(`Destino: ${remisionData?.destino?.nombre || "N/D"}`, margin, y);
  pdf.text(`Dirección: ${remisionData?.destino?.direccion || "N/D"}`, pageWidth / 2, y);

  y += 6;
  pdf.text(`NIT: ${remisionData?.destino?.nit || "N/D"}`, margin, y);
  pdf.text(`Teléfono: ${remisionData?.destino?.telefono || "N/D"}`, pageWidth / 2, y);

  // Conductor
  y += 10;
  const fechaJS = toDateSafe(remisionData?.fecha);
  pdf.text(`Fecha emisión: ${fechaJS.toLocaleString("es-CO")}`, margin, y);

  y += 6;
  pdf.text(`Conductor: ${remisionData?.conductor?.nombre || "N/D"}`, margin, y);
  pdf.text(`Cédula: ${remisionData?.conductor?.cedula || "N/D"}`, pageWidth / 2, y);

  y += 6;
  pdf.text(`Dirección: ${remisionData?.conductor?.direccion || "N/D"}`, margin, y);

  y += 6;
  pdf.text(`Vínculo: ${remisionData?.conductor?.vinculo || "N/D"}`, margin, y);
  pdf.text(`Placa: ${remisionData?.conductor?.placa || "N/D"}`, pageWidth / 2, y);

  y += 6;
  pdf.text(`Celular: ${remisionData?.conductor?.celular || "N/D"}`, margin, y);

  // Observaciones
  y += 6;
  const obs = remisionData?.observaciones || "";
  if (obs) {
    pdf.text(`Observaciones: ${obs}`, margin, y);
    y += 6;
  }

  // Tabla
  autoTable(pdf, {
    startY: y + 4,
    head: [["Ítem", "Detalle del material", "Cantidad (Kg)"]],
    body: (remisionData?.items || []).map((it, idx) => [
      String(idx + 1),
      it?.nombre || "",
      Number(it?.cantidad || 0).toLocaleString("es-CO"),
    ]),
    styles: { fontSize: 10, cellPadding: 2 },
    theme: "grid",
    headStyles: { fillColor: [26, 71, 77] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 120 },
      2: { cellWidth: 30, halign: "right" },
    },
  });

  // Firmas
  const finalY = pdf.lastAutoTable.finalY + 18;
  const colW = (pageWidth - margin * 2) / 3;

  pdf.line(margin, finalY - 8, pageWidth - margin, finalY - 8);
  pdf.setFontSize(10);
  pdf.text("Firma y sello quien diligencia", margin + 6, finalY);
  pdf.text("Firma Conductor", margin + colW + 20, finalY);
  pdf.text("Firma cliente y/o Recibidor", margin + colW * 2 + 8, finalY);

  // Paginación
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    pdf.setPage(i);
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  return pdf;
};

// ✅ Imprime un PDF desde URL (usa fetch->blob para evitar bloqueos / CORS raros)
export const imprimirPdfDesdeUrl = async (pdfUrl) => {
  if (!pdfUrl) throw new Error("pdfUrl vacío.");

  let blobUrl = null;

  try {
    // Intentar descargar como blob para imprimir estable
    const res = await fetch(pdfUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo descargar el PDF.");
    const blob = await res.blob();
    blobUrl = URL.createObjectURL(blob);

    // Iframe oculto + print (funciona en web y tauri)
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = blobUrl;

    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        setTimeout(() => {
          try {
            URL.revokeObjectURL(blobUrl);
          } catch {}
          try {
            iframe.remove();
          } catch {}
        }, 1500);
      }
    };

    return;
  } catch (e) {
    console.warn("Fallo impresión por blob, abriendo en nueva pestaña:", e);

    // Fallback: abrir URL directa
    window.open(pdfUrl, "_blank");
  }
};
