import { createContext, useContext, useEffect, useState } from "react";
import { adminMockApi } from "../services/adminMockData";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // --- Unified Login ---
  const login = async (identifier, password) => {
    try {
      // 1. First try mock login (Admin/Staff/Mock Users)
      try {
        const userData = await adminMockApi.login(identifier, password);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData;
      } catch (mockErr) {
        // If mock login fails, proceed to Firebase fallback
        console.log("Mock login failed, trying Firebase...");
      }

      // 2. Firebase Fallback (Regular registered users)
      const res = await signInWithEmailAndPassword(auth, identifier, password);
      const firebaseUser = res.user;

      // Fetch additional user info (role, name) from Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      let userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: "user", // Default
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
      };

      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        userData = {
          ...userData,
          role: firestoreData.role || "user",
          name: firestoreData.displayName || userData.name
        };
      }

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;

    } catch (err) {
      console.error("Unified login error:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
