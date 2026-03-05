import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Import các function cần thiết từ firebase của bạn
import { db } from "../../../firebaseConfig"; 
import { doc, getDoc } from "firebase/firestore";

const ViewProfileDoctor = () => {
  const { id } = useParams(); // id này là Document ID trên Firestore
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ Database
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        // Trỏ tới document của bác sĩ trong collection "users" (hoặc "doctors")
        const docRef = doc(db, "users", id); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Không tìm thấy bác sĩ này trên DB!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Đang tải thông tin bác sĩ...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Không tìm thấy thông tin bác sĩ</h2>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
          background: "#0d6efd",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ← Quay lại
      </button>

      <div
        style={{
          display: "flex",
          gap: "30px",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <img
          src={doctor.img || doctor.photoURL || "https://via.placeholder.com/150"}
          alt={doctor.name}
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "1px solid #eee"
          }}
        />

        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#2c3e50", marginBottom: "10px" }}>{doctor.name || doctor.displayName}</h2>
          <p><strong>Chuyên khoa:</strong> {doctor.specialty || "Đang cập nhật"}</p>
          <p><strong>Kinh nghiệm:</strong> {doctor.experience || "N/A"}</p>
          <p><strong>Đánh giá:</strong> ⭐ {doctor.rating || 5}     </p>
          <p><strong>Số điện thoại:</strong> {doctor.phone || "Liên hệ qua app"}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Địa chỉ:</strong> {doctor.address || "Việt Nam"}</p>

          <div style={{ marginTop: "15px", padding: "15px", background: "#f8f9fa", borderRadius: "8px" }}>
            <strong>Giới thiệu:</strong>
            <p style={{ lineHeight: "1.6", color: "#555" }}>
              {doctor.description || "Bác sĩ chưa có mô tả chi tiết."}
            </p>
          </div>

          <button
            onClick={() => navigate(`/appointment?doctorId=${doctor.id}`)}
            style={{
              marginTop: "20px",
              padding: "12px 25px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.background = "#218838"}
            onMouseOut={(e) => e.target.style.background = "#28a745"}
          >
            Đặt lịch khám ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileDoctor;