import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Thêm useSearchParams
import { auth, db } from "../../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook để lấy tham số từ URL
  const [currentUser, setCurrentUser] = useState(null);
  
  // Lấy dữ liệu từ URL (nếu có)
  const initialDoctorId = searchParams.get("doctorId") || "";
  const initialDoctorName = searchParams.get("doctorName") || "";

  const [formData, setFormData] = useState({
    doctorId: initialDoctorId, // Lưu ID bác sĩ vào DB
    doctorName: initialDoctorName, // Tên hiển thị trên form
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
        // Tùy chọn: Chuyển hướng người dùng về trang đăng nhập
        // setTimeout(() => navigate('/login'), 2000); 
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Bạn cần đăng nhập trước khi đặt lịch!");
      return;
    }

    // Kiểm tra xem đã có bác sĩ được chọn chưa
    if (!formData.doctorId) {
      toast.error("Vui lòng chọn bác sĩ từ danh sách trước!");
      return;
    }

    try {
      // Gửi dữ liệu lên Firestore
      await addDoc(collection(db, "appointments"), {
        doctorId: formData.doctorId,       // ID bác sĩ (để query cho Dashboard bác sĩ)
        doctorName: formData.doctorName,   // Tên bác sĩ (để hiển thị cho bệnh nhân)
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
        patientName: currentUser.displayName || currentUser.email.split('@')[0], 
        patientId: currentUser.uid,
        status: "pending", // Trạng thái: đang chờ xác nhận
        createdAt: serverTimestamp(),
      });

      toast.success("🚀 Đặt lịch thành công! Đang quay lại trang chủ...", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
      });

      // Chuyển hướng về trang danh sách đơn đặt lịch hoặc trang chủ
      setTimeout(() => navigate("/"), 2500); 
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      toast.error("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại!");
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
          {/* TRƯỜNG BÁC SĨ (Đã được điền tự động) */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600" }}>Bác sĩ phụ trách</label>
            {formData.doctorName ? (
              // Nếu có tên bác sĩ từ URL, hiển thị ô input readonly
              <input 
                type="text" 
                value={formData.doctorName} 
                readOnly 
                style={{ ...inputStyle, background: "#f1f2f6", color: "#636e72", fontWeight: "bold" }} 
              />
            ) : (
              // Báo lỗi nhẹ nếu người dùng vào thẳng trang /appointment mà không chọn bác sĩ
              <div style={{ ...inputStyle, background: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" }}>
                ⚠️ Vui lòng quay lại trang Danh sách để chọn bác sĩ.
                <button 
                  type="button" 
                  onClick={() => navigate('/doctors')} 
                  style={{ marginLeft: "10px", padding: "5px 10px", cursor: "pointer", border: "none", background: "#0984e3", color: "white", borderRadius: "5px" }}
                >
                  Chọn Bác Sĩ
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>Chọn ngày</label>
              <input 
                type="date" 
                name="date" 
                required 
                value={formData.date} 
                onChange={handleChange} 
                // Không cho chọn ngày trong quá khứ
                min={new Date().toISOString().split("T")[0]} 
                style={inputStyle} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>Chọn giờ</label>
              <select name="time" required value={formData.time} onChange={handleChange} style={inputStyle}>
                <option value="">-- Giờ --</option>
                <option value="08:00">08:00 - Sáng</option>
                <option value="09:00">09:00 - Sáng</option>
                <option value="10:00">10:00 - Sáng</option>
                <option value="14:00">14:00 - Chiều</option>
                <option value="15:00">15:00 - Chiều</option>
                <option value="16:00">16:00 - Chiều</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ fontWeight: "600" }}>Triệu chứng (Bắt buộc)</label>
            <textarea 
              name="symptoms" 
              rows="4" 
              required 
              value={formData.symptoms} 
              onChange={handleChange} 
              placeholder="Mô tả chi tiết triệu chứng của bạn để bác sĩ chuẩn bị tốt nhất..." 
              style={{ ...inputStyle, resize: "none" }} 
            />
          </div>

          <button 
            type="submit" 
            style={{ ...buttonStyle, opacity: formData.doctorId ? 1 : 0.5 }} 
            disabled={!formData.doctorId} // Vô hiệu hóa nút nếu không có ID bác sĩ
          >
            Xác nhận đặt lịch ngay
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = { width: "100%", padding: "12px", marginTop: "8px", borderRadius: "10px", border: "1px solid #dfe6e9", outline: "none", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "16px", background: "#0984e3", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s" };

export default Appointment;