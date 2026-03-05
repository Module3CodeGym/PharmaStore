import { createContext, useContext, useEffect, useState } from "react";
<<<<<<< Updated upstream
=======
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify"; 
>>>>>>> Stashed changes

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
<<<<<<< Updated upstream
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (email, password) => {
    // FAKE LOGIN
    if (!email || !password) return false;
=======
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
            const userDataFallback = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "user",
              name: firebaseUser.email.split('@')[0]
            };
            setUser(userDataFallback);
            localStorage.setItem("user", JSON.stringify(userDataFallback));
          }
        } catch (error) {
          console.error("Lỗi truy vấn Firestore:", error);
        }
      } else {
        // Đã sửa lại logic dọn dẹp tại đây
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Hàm đăng nhập xử lý lỗi 400 Bad Request
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
>>>>>>> Stashed changes

    const fakeUser = {
      name: "Nguyễn Văn A",
      email,
      role: "user"
    };

<<<<<<< Updated upstream
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);
    return true;
=======
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
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") 
        message = "Email hoặc mật khẩu không chính xác!";
      if (err.code === "auth/invalid-email") message = "Định dạng email không hợp lệ!";
      
      toast.error(message);
      throw err;
    }
>>>>>>> Stashed changes
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
