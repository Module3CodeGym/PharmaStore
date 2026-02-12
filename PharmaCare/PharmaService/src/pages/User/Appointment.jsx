import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    symptoms: "",
  });

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        toast.warning("Vui lòng đăng nhập để sử dụng chức năng này!");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Bạn cần đăng nhập trước khi đặt lịch!");
      return;
    }

    try {
      // Gửi dữ liệu lên Firestore
      await addDoc(collection(db, "appointments"), {
        ...formData,
        patientName: currentUser.displayName || currentUser.email.split('@')[0], 
        patientId: currentUser.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("🚀 Đặt lịch thành công! Đang quay lại trang chủ...", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f4f6f9", minHeight: "100vh" }}>
      <ToastContainer />
      <div style={{ maxWidth: "600px", margin: "0 auto", background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px", color: "#2d3436", textAlign: "center" }}>📅 Đặt Lịch Tư Vấn</h2>
        
        {currentUser && (
          <p style={{ textAlign: "center", color: "#636e72", marginBottom: "20px" }}>
            Đang đặt lịch cho: <strong>{currentUser.displayName || currentUser.email}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600" }}>Bác sĩ phụ trách</label>
            <select name="doctor" value={formData.doctor} onChange={handleChange} required style={inputStyle}>
              <option value="">-- Chọn bác sĩ --</option>
              <option value="BS. Nguyễn Văn A">BS. Nguyễn Văn A - Nội tổng quát</option>
              <option value="BS. Trần Thị B">BS. Trần Thị B - Nhi khoa</option>
              <option value="BS. Lê Minh C">BS. Lê Minh C - Da liễu</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>Chọn ngày</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>Chọn giờ</label>
              <select name="time" required value={formData.time} onChange={handleChange} style={inputStyle}>
                <option value="">-- Giờ --</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ fontWeight: "600" }}>Triệu chứng</label>
            <textarea name="symptoms" rows="4" required value={formData.symptoms} onChange={handleChange} placeholder="Mô tả triệu chứng..." style={{ ...inputStyle, resize: "none" }} />
          </div>

          <button type="submit" style={buttonStyle}>Xác nhận đặt lịch ngay</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = { width: "100%", padding: "12px", marginTop: "8px", borderRadius: "10px", border: "1px solid #dfe6e9", outline: "none", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "16px", background: "#0984e3", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" };

export default Appointment;