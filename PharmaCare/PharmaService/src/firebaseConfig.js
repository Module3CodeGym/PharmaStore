import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// Đã xác thực config dựa trên ảnh "image_8a6de0.png" của bạn
const firebaseConfig = {
  apiKey: "AIzaSyC9gicwFgOve0r9RilQVi_YtGfi3Ph9GfU",
  authDomain: "project-535c6.firebaseapp.com",
  projectId: "project-535c6",
  storageBucket: "project-535c6.firebasestorage.app",
  messagingSenderId: "890631919643",
  appId: "1:890631919643:web:de12fd43d3a24e4fa500be",
  measurementId: "G-6FP2QX6FLB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth và DB
export const auth = getAuth(app);
export const db = getFirestore(app);

// SỬA LỖI: Export appId chính xác
export const appId = firebaseConfig.appId;
export const storage = getStorage(app); 
export const googleProvider = new GoogleAuthProvider();