import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm loading để tránh lỗi render khi chưa check xong auth

  useEffect(() => {
    // Lắng nghe trạng thái đăng nhập thực tế từ Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          let userData;
          if (userDoc.exists()) {
            const data = userDoc.data();
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              // Chuẩn hóa role về chữ thường để khớp với Security Rules
              role: data.role?.toLowerCase().trim() || "user",
              name: data.displayName || data.name || firebaseUser.email.split('@')[0]
            };
          } else {
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user",
              name: firebaseUser.email.split('@')[0]
            };
          }
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Lỗi truy vấn Firestore:", error);
        }
      } else {
        // Xử lý khi đăng xuất: Dọn dẹp sạch sẽ để tránh lỗi "Missing permissions"
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener khi component unmount
  }, []);

  // Hàm đăng nhập sử dụng Firebase Auth thực tế
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Lấy thêm thông tin role từ Firestore
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      let userData;
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: data.role?.toLowerCase().trim() || "user",
          name: data.displayName || data.name || firebaseUser.email.split('@')[0]
        };
      } else {
        userData = { uid: firebaseUser.uid, email: firebaseUser.email, role: "user", name: firebaseUser.email.split('@')[0] };
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error("Firebase Auth Error:", err.code);
      let message = "Lỗi đăng nhập!";
      // Xử lý các mã lỗi phổ biến của Firebase
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") 
        message = "Email hoặc mật khẩu không chính xác!";
      if (err.code === "auth/invalid-email") message = "Định dạng email không hợp lệ!";
      
      toast.error(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);