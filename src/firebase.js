import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Конфигурация проекта Firebase (заменилась на твою)
const firebaseConfig = {
  apiKey: "AIzaSyCo5t7kAz5K7_-6RPbEt8-jmIjCkITNAkc",
  authDomain: "dumler-logistik-61824.firebaseapp.com",
  projectId: "dumler-logistik-61824",
  storageBucket: "dumler-logistik-61824.firebasestorage.app",
  messagingSenderId: "1069743113461",
  appId: "1:1069743113461:web:e06b3a02fe75eab8b131bc",
  measurementId: "G-6VBCG3DPE1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
