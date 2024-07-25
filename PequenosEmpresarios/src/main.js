import App from "./App.vue";
import router from "./router";
import './assets/main.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
// Importa la funcion onAuthStateChanged

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(); // Obtiene la instancia de autenticación

// Inicializar Firebase App Check
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true
});
//console.log('Firebase App Check initialized:', appCheck);

onAuthStateChanged(auth, (user) => {
  const isAuthenticated = !!user; // Verifica si el usuario está autenticado

  const isLoginPage = router.currentRoute.value.name === 'login';

  if (!isAuthenticated && !isLoginPage) {
    // Si el usuario no está autenticado y no está en la página de inicio de sesión, redirige a la página de inicio de sesión
    router.push('/login');
  }
});

createApp(App)
  .use(createPinia())
  .use(PrimeVue)
  .use(router)
  .mount("#app");

export { db };

