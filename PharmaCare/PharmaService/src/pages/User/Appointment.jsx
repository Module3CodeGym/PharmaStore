import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // Thêm useSearchParams
import { auth, db } from "../../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Lấy params từ URL
  const [currentUser, setCurrentUser] = useState(null);
  const [doctors, setDoctors] = useState([]);

  // Lấy dữ liệu từ URL để điền vào form ngay khi load
  const initialDoctorId = searchParams.get("doctorId") || "";
  const initialDoctorName = searchParams.get("doctorName") || "";
  const selectedSpecialty = searchParams.get("specialty") || "";

  const [formData, setFormData] = useState({
    doctorId: initialDoctorId,
    doctorName: initialDoctorName,
    date: "",
    time: "",
    symptoms: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else toast.warning("Vui lòng đăng nhập để đặt lịch!");
    });
    return () => unsubscribe();
  }, []);

  // Lấy danh sách bác sĩ từ DB để đề phòng người dùng muốn chọn lại bác sĩ khác
  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, "users"), where("role", "==", "doctor"));
      const querySnapshot = await getDocs(q);
      setDoctors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "doctor") {
      const selectedDoc = doctors.find(doc => doc.id === e.target.value);
      setFormData({ 
        ...formData, 
        doctorId: selectedDoc ? selectedDoc.id : "", 
        doctorName: selectedDoc ? selectedDoc.displayName : "" 
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("Bạn cần đăng nhập!");

    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        patientName: currentUser.displayName || currentUser.email.split('@')[0], 
        patientId: currentUser.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("🚀 Đặt lịch thành công!");
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f4f6f9", minHeight: "100vh" }}>
      <ToastContainer />
      <div style={{ maxWidth: "600px", margin: "0 auto", background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center" }}>📅 Đặt Lịch Tư Vấn</h2>
        
        {/* Thông báo bác sĩ đã được chọn sẵn */}
        {formData.doctorName && (
          <div style={{ padding: "12px", background: "#e3f2fd", borderRadius: "10px", marginBottom: "20px", border: "1px solid #007bff" }}>
            📍 Bạn đang đặt lịch với: <b>BS. {formData.doctorName}</b> <br/>
            Chuyên khoa: <b>{selectedSpecialty || "Đang tải..."}</b>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600" }}>Bác sĩ phụ trách</label>
            <select name="doctor" value={formData.doctorId} onChange={handleChange} required style={inputStyle}>
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>BS. {doc.displayName} - {doc.specialty}</option>
              ))}
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

const inputStyle = { width: "100%", padding: "12px", marginTop: "8px", borderRadius: "10px", border: "1px solid #dfe6e9", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "16px", background: "#0984e3", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" };

export default Appointment;