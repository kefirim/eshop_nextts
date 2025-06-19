// firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPj0sz3B0vtZ92CwTVxFNZZKCqwoOlQks",
  authDomain: "eshop-9f8fa.firebaseapp.com",
  projectId: "eshop-9f8fa",
  storageBucket: "eshop-9f8fa.appspot.com", // ✅ correction ici
  messagingSenderId: "318564735254",
  appId: "1:318564735254:web:6385e1156afb2e9cbb5837"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// 🔌 connecter à l'émulateur si en local
if (typeof window !== "undefined" && location.hostname === "localhost") {
  connectStorageEmulator(storage, "localhost", 9199);
}

export { storage };
