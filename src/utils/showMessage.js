// src/utils/showMessage.js

// Utilidad sencilla para mostrar mensajes tanto en Tauri como en el navegador
// Evita los errores de referencia cuando 'message' no está disponible en web

const isTauriEnvironment = () =>
  typeof window !== 'undefined' && (Boolean(window.__TAURI__) || Boolean(window.__TAURI_INTERNALS__));

const loadTauriMessage = async () => {
  // Evitamos que Vite falle si alguno de los módulos no está disponible (web vs. Tauri)
  const dialogPaths = ['@tauri-apps/plugin-dialog', '@tauri-apps/api/dialog'];

  for (const dialogPath of dialogPaths) {
    const pluginModule = await import(/* @vite-ignore */ dialogPath).catch(() => null);
    if (pluginModule?.message) {
      return pluginModule.message;
    }
  }

  return null;
};

export async function showMessage(texto, options = {}) {
  if (isTauriEnvironment()) {
    const messageFn = await loadTauriMessage();
    if (messageFn) {
      return messageFn(texto, options);
    }
  }

  // Fallback sencillo para la versión web
  if (options?.title) {
    alert(`${options.title}: ${texto}`);
    return;
  }

  alert(texto);
}