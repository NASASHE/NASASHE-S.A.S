// src/firebase.js

// 1. Importaciones base
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firestore con persistencia moderna
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

// 👉 IMPORTANTE: importar Storage
import { getStorage } from "firebase/storage";

// 2. Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsAP-bhieVtVkPglMBsf5lben2JuUEcf0",
  authDomain: "nasashe-chatarreria.firebaseapp.com",
  projectId: "nasashe-chatarreria",
  storageBucket: "nasashe-chatarreria.firebasestorage.app",
  messagingSenderId: "401122117055",
  appId: "1:401122117055:web:0b48451b9b4d5291cacd0a"
};

// 3. Inicializar app
const app = initializeApp(firebaseConfig);

// 4. Firestore con persistencia local (correcto ✅)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// 5. Auth
export const auth = getAuth(app);

// 6. 👉 Storage (ESTO FALTABA)
export const storage = getStorage(app);

// Log opcional
console.log("🔥 Firebase inicializado con Firestore persistente y Storage");
