// src/firebase.js

// 1. Importa las funciones que necesitas de los SDK de Firebase
import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// 👇 CAMBIO 1: Importa las nuevas funciones
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

// 2. ¡MUY IMPORTANTE!
//    PEGA AQUÍ TU PROPIO BLOQUE 'firebaseConfig'
//    (El que copiaste de la consola de Firebase)
//    El que está aquí es solo un EJEMPLO.
const firebaseConfig = {
  apiKey: "AIzaSyBsAP-bhieVtVkPglMBsf5lben2JuUEcf0",
  authDomain: "nasashe-chatarreria.firebaseapp.com",
  projectId: "nasashe-chatarreria",
  storageBucket: "nasashe-chatarreria.firebasestorage.app",
  messagingSenderId: "401122117055",
  appId: "1:401122117055:web:0b48451b9b4d5291cacd0a"
};


// 3. Inicializa Firebase
const app = initializeApp(firebaseConfig);


// 4. INICIALIZA LOS SERVICIOS CON PERSISTENCIA
// 👇 CAMBIO 2: Usamos 'initializeFirestore' en lugar de 'getFirestore'
//    y le pasamos la configuración del caché local directamente.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    // Esto es ideal para tu caso de varias PCs (o varias pestañas)
    tabManager: persistentMultipleTabManager()
  })
});

// La autenticación sigue igual
export const auth = getAuth(app);

// Mensaje de éxito en la consola
console.log("¡Persistencia local activada con el método moderno! 🚀");


// 4. EXPORTA TUS SERVICIOS
//    Asegúrate de que estas dos líneas estén EXACTAMENTE así,
//    con 'export const' al inicio.
//    Este fue el punto del error.
// *export const db = getFirestore(app);
// *export const auth = getAuth(app);