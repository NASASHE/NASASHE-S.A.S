// src/utils/abrirPdf.js
import { open } from "@tauri-apps/plugin-shell";

const isTauri = () =>
  typeof window !== "undefined" &&
  (window.__TAURI__ || window.__TAURI_INTERNALS__);

export async function abrirPdfEnSistema(url) {
  if (!url) return;

  // En Tauri: abre el navegador del sistema
  if (isTauri()) {
    await open(url);
    return;
  }

  // En web normal
  window.open(url, "_blank", "noopener,noreferrer");
}
