// src/pages/PaginaRemisiones.jsx

import React, { useEffect, useMemo, useState } from "react";
import "./PaginaRemisiones.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  collection,
  doc,
  getDocs,
  runTransaction,
  Timestamp,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "../firebase";
import { useCaja } from "../context/CajaContext";
import { abrirPdfEnSistema } from "../utils/abrirPdf"; // ajusta la ruta

const BASE = import.meta.env.BASE_URL || "/";

// helpers
const formatConsecutivo = (n) => `REM-${String(n).padStart(6, "0")}`;
const toNumber = (v) => {
  const num = Number(v);
  return Number.isNaN(num) ? 0 : num;
};

const generarId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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

function PaginaRemisiones() {
  const { userProfile, consecutivosData } = useCaja();
  const esAdmin = userProfile?.rol === "admin";

  const [proveedores, setProveedores] = useState([]);
  const [articulos, setArticulos] = useState([]);

  const [destinoId, setDestinoId] = useState("");
  const [destinoInfo, setDestinoInfo] = useState({
    nombre: "",
    nit: "",
    direccion: "",
    telefono: "",
  });

  const [datosConductor, setDatosConductor] = useState({
    nombre: "",
    cedula: "",
    direccion: "",
    vinculo: "CONTRATISTA DE FLETE",
    placa: "",
    celular: "",
  });

  const [itemSeleccionado, setItemSeleccionado] = useState({
    articuloId: "",
    cantidad: "",
    modoCantidad: "manual",
  });

  const [items, setItems] = useState([]);
  const [observaciones, setObservaciones] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [ultimoPdf, setUltimoPdf] = useState(null);
  const [ultimoConsecutivo, setUltimoConsecutivo] = useState("");

  const siguienteNumeroRemision = useMemo(
    () => (consecutivosData?.remisiones ?? 0) + 1,
    [consecutivosData]
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [proveedoresSnap, articulosSnap] = await Promise.all([
          getDocs(collection(db, "proveedores")),
          getDocs(collection(db, "articulos")),
        ]);

        const proveedoresData = proveedoresSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));

        const articulosData = articulosSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));

        setProveedores(proveedoresData);
        setArticulos(articulosData);
      } catch (err) {
        console.error("Error cargando datos:", err);
        alert("No se pudieron cargar proveedores/artículos.");
      }
    };

    cargarDatos();
  }, []);

  const handleDestinoChange = (e) => {
    const id = e.target.value;
    setDestinoId(id);

    const proveedor = proveedores.find((p) => p.id === id);
    if (!proveedor) {
      setDestinoInfo({ nombre: "", nit: "", direccion: "", telefono: "" });
      return;
    }

    setDestinoInfo({
      nombre: proveedor.nombre || "",
      nit: proveedor.nit || "",
      direccion: proveedor.direccion || "",
      telefono: proveedor.telefono || "",
    });
  };

  const handleConductorChange = (e) => {
    const { name, value } = e.target;
    setDatosConductor((prev) => ({
      ...prev,
      [name]: name === "vinculo" ? value : value.toUpperCase(),
    }));
  };

  const handleArticuloChange = (e) => {
    const articuloId = e.target.value;
    const articulo = articulos.find((a) => a.id === articuloId);

    setItemSeleccionado((prev) => ({
      ...prev,
      articuloId,
      cantidad:
        articulo && prev.modoCantidad === "stock"
          ? Number(articulo.stock) || 0
          : "",
    }));
  };

  const handleModoCantidadChange = (modo) => {
    const articulo = articulos.find((a) => a.id === itemSeleccionado.articuloId);
    setItemSeleccionado((prev) => ({
      ...prev,
      modoCantidad: modo,
      cantidad: modo === "stock" && articulo ? Number(articulo.stock) || 0 : "",
    }));
  };

  const handleAgregarItem = () => {
    if (!itemSeleccionado.articuloId) {
      alert("Selecciona un material antes de agregarlo.");
      return;
    }

    const articulo = articulos.find((a) => a.id === itemSeleccionado.articuloId);
    if (!articulo) {
      alert("No se pudo identificar el material.");
      return;
    }

    const stock = Number(articulo.stock) || 0;

    const cantidad =
      itemSeleccionado.modoCantidad === "stock"
        ? stock
        : toNumber(itemSeleccionado.cantidad);

    if (cantidad <= 0) {
      alert("Ingresa una cantidad válida.");
      return;
    }

    if (cantidad > stock) {
      alert(`La cantidad supera el stock disponible (${stock}).`);
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        localId: generarId(),
        articuloId: articulo.id,
        nombre: articulo.nombre,
        cantidad: Number(cantidad),
        modoCantidad: itemSeleccionado.modoCantidad,
      },
    ]);

    setItemSeleccionado({ articuloId: "", cantidad: "", modoCantidad: "manual" });
  };

  const handleEliminarItem = (localId) => {
    setItems((prev) => prev.filter((x) => x.localId !== localId));
  };

  const validarFormulario = () => {
    if (!esAdmin) {
      alert("Solo los administradores pueden crear remisiones.");
      return false;
    }
    if (!destinoId) {
      alert("Selecciona un destino (proveedor).");
      return false;
    }
    if (items.length === 0) {
      alert("Agrega al menos un material a la remisión.");
      return false;
    }
    if (!datosConductor.nombre || !datosConductor.cedula || !datosConductor.placa) {
      alert("Completa conductor: nombre, cédula y placa son obligatorios.");
      return false;
    }
    return true;
  };

  const generarPdf = async (remisionData) => {
    const pdf = new jsPDF({ unit: "mm", format: "letter" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    let y = margin;

    // logo (Vite + GitHub Pages)
    try {
      const logoUrl = `${BASE}logo con fondo.png`;
      const logoData = await cargarImagenComoBase64(encodeURI(logoUrl));
      pdf.addImage(logoData, "PNG", margin, y, 40, 20);
    } catch (e) {
      console.warn("Logo no cargó:", e);
    }

    pdf.setFontSize(16);
    pdf.text("NASASHE S.A.S.", pageWidth / 2, y + 6, { align: "center" });
    pdf.setFontSize(10);
    pdf.text("901.907.763-3", pageWidth / 2, y + 12, { align: "center" });
    pdf.text("Calle 98 9B 35", pageWidth / 2, y + 18, { align: "center" });
    pdf.text("Tel: 3227377140", pageWidth / 2, y + 24, { align: "center" });

    pdf.setFontSize(14);
    pdf.text("REMISIÓN", pageWidth - margin, y + 10, { align: "right" });
    pdf.setFontSize(12);
    pdf.text(remisionData.consecutivo, pageWidth - margin, y + 18, { align: "right" });

    y += 30;
    pdf.setFontSize(11);

    pdf.text(`Destino: ${remisionData.destino?.nombre || "N/D"}`, margin, y);
    pdf.text(`Dirección: ${remisionData.destino?.direccion || "N/D"}`, pageWidth / 2, y);

    y += 6;
    pdf.text(`NIT: ${remisionData.destino?.nit || "N/D"}`, margin, y);
    pdf.text(`Teléfono: ${remisionData.destino?.telefono || "N/D"}`, pageWidth / 2, y);

    y += 10;
    const fechaJS =
      remisionData.fecha?.toDate?.() ? remisionData.fecha.toDate() : new Date(remisionData.fecha || Date.now());
    pdf.text(`Fecha emisión: ${fechaJS.toLocaleString("es-CO")}`, margin, y);

    y += 6;
    pdf.text(`Conductor: ${remisionData.conductor?.nombre || "N/D"}`, margin, y);
    pdf.text(`Cédula: ${remisionData.conductor?.cedula || "N/D"}`, pageWidth / 2, y);

    y += 6;
    pdf.text(`Dirección: ${remisionData.conductor?.direccion || "N/D"}`, margin, y);

    y += 6;
    pdf.text(`Vínculo: ${remisionData.conductor?.vinculo || "N/D"}`, margin, y);
    pdf.text(`Placa: ${remisionData.conductor?.placa || "N/D"}`, pageWidth / 2, y);

    y += 6;
    pdf.text(`Celular: ${remisionData.conductor?.celular || "N/D"}`, margin, y);

    y += 6;
    if (remisionData.observaciones) {
      pdf.text(`Observaciones: ${remisionData.observaciones}`, margin, y);
      y += 6;
    }

    autoTable(pdf, {
      startY: y + 4,
      head: [["Ítem", "Detalle del material", "Cantidad (Kg)"]],
      body: (remisionData.items || []).map((it, idx) => [
        String(idx + 1),
        it.nombre || "",
        Number(it.cantidad || 0).toLocaleString("es-CO"),
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

    const finalY = pdf.lastAutoTable.finalY + 18;
    const colW = (pageWidth - margin * 2) / 3;

    // línea
    pdf.line(margin, finalY - 8, pageWidth - margin, finalY - 8);

    pdf.setFontSize(10);
    pdf.text("Firma y sello quien diligencia", margin + 6, finalY);
    pdf.text("Firma Conductor", margin + colW + 20, finalY);
    pdf.text("Firma cliente y/o Recibidor", margin + colW * 2 + 8, finalY);

    // paginación
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i += 1) {
      pdf.setPage(i);
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 8, {
        align: "right",
      });
    }

    return pdf;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    setGuardando(true);

    try {
      const destinoSeleccionado = proveedores.find((p) => p.id === destinoId);
      if (!destinoSeleccionado) throw new Error("Destino inválido.");

      const remisionDocRef = doc(collection(db, "remisiones"));
      let remisionDataFinal = null;

      // 1) Transacción: valida stock + crea remisión + incrementa consecutivo
      await runTransaction(db, async (tx) => {
        const consecRef = doc(db, "configuracion", "consecutivos");
        const consecSnap = await tx.get(consecRef);
        if (!consecSnap.exists()) throw new Error("No existe configuracion/consecutivos");

        // Validación de stock (SIN descontar aquí)
        const articulosRefs = items.map((it) => doc(db, "articulos", it.articuloId));
        const articulosSnaps = await Promise.all(articulosRefs.map((r) => tx.get(r)));

        articulosSnaps.forEach((snap, idx) => {
          if (!snap.exists()) throw new Error(`No existe artículo: ${items[idx].nombre}`);
          const stockActual = Number(snap.data().stock) || 0;
          const cant = Number(items[idx].cantidad) || 0;
          if (cant > stockActual) {
            throw new Error(`Stock insuficiente para ${items[idx].nombre}. Stock: ${stockActual}`);
          }
        });

        const nuevoNum = (consecSnap.data().remisiones ?? 0) + 1;
        const consecutivo = formatConsecutivo(nuevoNum);

        const remisionData = {
          consecutivo,
          fecha: Timestamp.now(),
          creadoPor: userProfile?.nombre || "SISTEMA",

          destino: {
            id: destinoSeleccionado.id,
            nombre: destinoSeleccionado.nombre,
            nit: destinoSeleccionado.nit || "",
            direccion: destinoSeleccionado.direccion || "",
            telefono: destinoSeleccionado.telefono || "",
          },

          conductor: {
            ...datosConductor,
            nombre: (datosConductor.nombre || "").toUpperCase(),
            cedula: (datosConductor.cedula || "").toUpperCase(),
            direccion: (datosConductor.direccion || "").toUpperCase(),
            placa: (datosConductor.placa || "").toUpperCase(),
            celular: (datosConductor.celular || "").toUpperCase(),
          },

          items: items.map((it) => ({
            articuloId: it.articuloId,
            nombre: it.nombre,
            cantidad: Number(it.cantidad) || 0,
          })),

          observaciones: (observaciones || "").toUpperCase(),

          // ✅ PDF (se llena luego)
          pdfUrl: null,
          pdfPath: null,
          impresa: false,
          impresaEn: null,
          impresaPor: null,
        };

        tx.set(remisionDocRef, remisionData);
        tx.update(consecRef, { remisiones: nuevoNum });

        remisionDataFinal = { ...remisionData, id: remisionDocRef.id };
      });

      // 2) Generar PDF
      const pdf = await generarPdf(remisionDataFinal);
      const blob = pdf.output("blob");

      // 3) Subir PDF a Storage (una sola vez)
      const pdfPath = `remisiones/${remisionDataFinal.consecutivo}.pdf`;
      const storageRef = ref(storage, pdfPath);

      await uploadBytes(storageRef, blob, { contentType: "application/pdf" });
      const pdfUrl = await getDownloadURL(storageRef);

      // 4) Guardar URL en Firestore
      await runTransaction(db, async (tx) => {
        const rRef = doc(db, "remisiones", remisionDataFinal.id);
        tx.update(rRef, {
          pdfUrl,
          pdfPath,
          impresa: true,
          impresaEn: Timestamp.now(),
          impresaPor: userProfile?.nombre || "SISTEMA",
        });
      });

      // 5) UI
      setUltimoPdf(pdf);
      setUltimoConsecutivo(remisionDataFinal.consecutivo);

      // limpiar
      setItems([]);
      setObservaciones("");
      setDestinoId("");
      setDestinoInfo({ nombre: "", nit: "", direccion: "", telefono: "" });
      setDatosConductor({
        nombre: "",
        cedula: "",
        direccion: "",
        vinculo: "CONTRATISTA DE FLETE",
        placa: "",
        celular: "",
      });
      setItemSeleccionado({ articuloId: "", cantidad: "", modoCantidad: "manual" });

      // abrir PDF
      await abrirPdfEnSistema(pdfUrl);
    } catch (err) {
      console.error("Error guardando remisión:", err);
      alert(err?.message || "No se pudo guardar la remisión.");
    } finally {
      // ✅ CLAVE: nunca se queda pegado
      setGuardando(false);
    }
  };

  const handleDescargar = () => {
    if (ultimoPdf && ultimoConsecutivo) {
      ultimoPdf.save(`${ultimoConsecutivo}.pdf`);
    }
  };

  const handleImprimir = () => {
    if (!ultimoPdf) return;
    const blobUrl = ultimoPdf.output("bloburl");
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => iframe.contentWindow?.print();
  };

  if (!esAdmin) {
    return (
      <div className="remisiones-container">
        <h1>Remisiones</h1>
        <p className="remisiones-alerta">
          Solo los administradores pueden gestionar las remisiones.
        </p>
      </div>
    );
  }

  return (
    <div className="remisiones-container">
      <div className="remisiones-encabezado">
        <div className="remisiones-encabezado-textos">
          <h1>Remisiones</h1>
          <p>Genera y guarda remisiones con consecutivo y PDF listo para impresión.</p>
          <p className="remisiones-consecutivo">
            Próximo consecutivo: <strong>{formatConsecutivo(siguienteNumeroRemision)}</strong>
          </p>
        </div>

        <img
          src={`${BASE}logo con fondo.png`}
          alt="Logo Nasashe"
          className="remisiones-logo"
        />
      </div>

      <section className="remisiones-panel">
        <h2>Destino</h2>
        <div className="remisiones-grid">
          <label>
            Destino (proveedor)
            <select value={destinoId} onChange={handleDestinoChange}>
              <option value="">Seleccione...</option>
              {proveedores.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            NIT / CC
            <input type="text" value={destinoInfo.nit} readOnly />
          </label>
          <label>
            Dirección
            <input type="text" value={destinoInfo.direccion} readOnly />
          </label>
          <label>
            Teléfono
            <input type="text" value={destinoInfo.telefono} readOnly />
          </label>
        </div>
      </section>

      <section className="remisiones-panel">
        <h2>Datos del conductor</h2>
        <div className="remisiones-grid">
          <label>
            Nombre
            <input name="nombre" value={datosConductor.nombre} onChange={handleConductorChange} />
          </label>
          <label>
            Cédula
            <input name="cedula" value={datosConductor.cedula} onChange={handleConductorChange} />
          </label>
          <label>
            Dirección de residencia
            <input name="direccion" value={datosConductor.direccion} onChange={handleConductorChange} />
          </label>
          <label>
            Placa vehículo
            <input name="placa" value={datosConductor.placa} onChange={handleConductorChange} />
          </label>
          <label>
            Celular
            <input name="celular" value={datosConductor.celular} onChange={handleConductorChange} />
          </label>

          <div className="remisiones-vinculo">
            <span>Vínculo con la razón social</span>

            <label className="remisiones-check">
              <input
                type="radio"
                name="vinculo"
                value="CONTRATISTA DE FLETE"
                checked={datosConductor.vinculo === "CONTRATISTA DE FLETE"}
                onChange={handleConductorChange}
              />
              Contr. Flete
            </label>

            <label className="remisiones-check">
              <input
                type="radio"
                name="vinculo"
                value="EMPLEADO"
                checked={datosConductor.vinculo === "EMPLEADO"}
                onChange={handleConductorChange}
              />
              Empleado
            </label>
          </div>
        </div>
      </section>

      <section className="remisiones-panel">
        <h2>Materiales</h2>

        <div className="remisiones-articulos">
          <label>
            Material
            <select value={itemSeleccionado.articuloId} onChange={handleArticuloChange}>
              <option value="">Seleccione...</option>
              {articulos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} (stock: {Number(a.stock) || 0} Kg)
                </option>
              ))}
            </select>
          </label>

          <div className="remisiones-cantidad-opciones">
            <span>Cantidad</span>
            <div className="remisiones-radios">
              <label>
                <input
                  type="radio"
                  checked={itemSeleccionado.modoCantidad === "stock"}
                  onChange={() => handleModoCantidadChange("stock")}
                />
                Usar stock disponible
              </label>

              <label>
                <input
                  type="radio"
                  checked={itemSeleccionado.modoCantidad === "manual"}
                  onChange={() => handleModoCantidadChange("manual")}
                />
                Ingresar manualmente
              </label>
            </div>

            {itemSeleccionado.modoCantidad === "manual" && (
              <input
                type="number"
                min="0"
                value={itemSeleccionado.cantidad}
                onChange={(e) =>
                  setItemSeleccionado((prev) => ({ ...prev, cantidad: e.target.value }))
                }
                placeholder="Cantidad en Kg"
              />
            )}
          </div>

          <button type="button" className="remisiones-add" onClick={handleAgregarItem}>
            Añadir material
          </button>
        </div>

        {items.length > 0 && (
          <table className="remisiones-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Material</th>
                <th>Cantidad (Kg)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.localId}>
                  <td>{idx + 1}</td>
                  <td>{it.nombre}</td>
                  <td>{Number(it.cantidad || 0).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="remisiones-delete"
                      onClick={() => handleEliminarItem(it.localId)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="remisiones-panel">
        <h2>Observaciones</h2>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value.toUpperCase())}
          placeholder="Datos adicionales, sellos, etc."
          rows={3}
        />
      </section>

      <div className="remisiones-acciones">
        <button type="button" onClick={handleGuardar} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar y generar PDF"}
        </button>

        <button type="button" onClick={handleImprimir} disabled={!ultimoPdf}>
          Imprimir última remisión
        </button>

        <button type="button" onClick={handleDescargar} disabled={!ultimoPdf}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
}

export default PaginaRemisiones;
