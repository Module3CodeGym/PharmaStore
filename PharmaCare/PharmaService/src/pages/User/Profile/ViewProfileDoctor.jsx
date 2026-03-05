import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebaseConfig"; // ⚠️ Đảm bảo đường dẫn này khớp với thư mục của bạn
import { doc, getDoc } from "firebase/firestore";

const Viewprofiledoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Khai báo state lưu dữ liệu từ Firebase
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Gọi dữ liệu từ database khi component được render
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Tham chiếu đến bảng 'users', lấy document có ID tương ứng
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Gộp ID của document vào data
          setDoctor({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn("Không tìm thấy dữ liệu bác sĩ trên DB!");
          setDoctor(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // 3. Xử lý trạng thái đang tải hoặc không tìm thấy
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>⏳ Đang tải thông tin bác sĩ...</h2>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        <h2>❌ Không tìm thấy thông tin bác sĩ</h2>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 15px', cursor: 'pointer' }}>Quay lại</button>
      </div>
    );
  }

  // 4. Fallback dữ liệu (phòng trường hợp DB thiếu trường)
  const doctorName = doctor.name || doctor.userInfo?.displayName || "Bác sĩ chưa cập nhật tên";
  const doctorImage = doctor.img || doctor.photoURL || doctor.userInfo?.photoURL || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";

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
        {/* Khối Ảnh */}
        <img
          src={doctorImage}
          alt={doctorName}
          style={{
            width: "150px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "2px solid #eee"
          }}
        />

        {/* Khối Thông tin */}
        <div>
          <h2 style={{ marginTop: 0 }}>{doctorName}</h2>
          <p><strong>Chuyên khoa:</strong> {doctor.specialty || "Đa khoa"}</p>
          <p><strong>Kinh nghiệm:</strong> {doctor.experience || "Đang cập nhật"}</p>
          <p><strong>Đánh giá:</strong> ⭐ {Number(doctor.rating) || 0} ({doctor.reviewCount || doctor.reviews || 0} lượt)</p>
          <p><strong>Số điện thoại:</strong> {doctor.phone || doctor.userInfo?.phone || "Chưa cập nhật"}</p>
          <p><strong>Email:</strong> {doctor.email || doctor.userInfo?.email || "Chưa cập nhật"}</p>
          <p><strong>Địa chỉ:</strong> {doctor.location || doctor.address || "Tư vấn Online"}</p>

          <div style={{ marginTop: "15px" }}>
            <strong>Giới thiệu:</strong>
            <p style={{ lineHeight: '1.6', color: '#555' }}>
              {doctor.description || "Bác sĩ chưa cập nhật thông tin giới thiệu chi tiết."}
            </p>
          </div>

          <button
            onClick={() => navigate(`/appointment?doctorId=${doctor.id}`)}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Đặt lịch khám ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viewprofiledoctor;