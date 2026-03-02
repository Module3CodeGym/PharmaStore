import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify"; // Đảm bảo đã import toast

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Tự động khôi phục phiên đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Lấy dữ liệu từ Firestore.
          // LƯU Ý: Nếu gặp lỗi "Permission Denied", hãy kiểm tra Security Rules
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: data.role?.toLowerCase().trim() || "user",
              name: data.displayName || data.name || firebaseUser.email.split('@')[0]
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Trường hợp tài khoản tồn tại trong Auth nhưng không có trong Firestore
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user",
              name: firebaseUser.email.split('@')[0]
            });
          }
        } catch (error) {
          console.error("Lỗi truy vấn Firestore (Có thể do Rules):", error);
        }
      } else {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (!parsedUser.uid) setUser(parsedUser); 
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Hàm đăng nhập xử lý lỗi 400 Bad Request
  const login = async (email, password) => {
    // Kiểm tra đầu vào để tránh gửi request lỗi 400 lên Google API
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = res.user;

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
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: "user",
          name: firebaseUser.email.split('@')[0]
        };
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error("Firebase Auth Error:", err.code);
      let message = "Lỗi đăng nhập!";
      // Xử lý các mã lỗi phổ biến gây ra status 400
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