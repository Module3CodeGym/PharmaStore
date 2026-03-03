import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const Viewprofiledoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 4. DỮ LIỆU BÁC SĨ THEO CHUYÊN NGÀNH
  const doctors = [
    {
      id: 1,
      name: "BS. Trần Văn A",
      specialty: "Nội tổng quát",
      experience: "10 năm kinh nghiệm",
      rating: 4.8,
      reviews: 124,
      phone: "0901 111 111",
      email: "tranvana@gmail.com",
      address: "Hà Nội",
      description:
        "Bác sĩ chuyên khoa Nội tổng quát với nhiều năm kinh nghiệm điều trị các bệnh lý mãn tính.",
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    },
    {
      id: 2,
      name: "BS. Nguyễn Thị B",
      specialty: "Da liễu",
      experience: "8 năm kinh nghiệm",
      rating: 4.6,
      reviews: 98,
      phone: "0902 222 222",
      email: "nguyenthib@gmail.com",
      address: "TP.HCM",
      description:
        "Chuyên điều trị các bệnh lý da liễu, chăm sóc da và tư vấn thẩm mỹ.",
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    },
    {
      id: 3,
      name: "BS. Lê Văn C",
      specialty: "Tim mạch",
      experience: "12 năm kinh nghiệm",
      rating: 4.9,
      reviews: 210,
      phone: "0903 333 333",
      email: "levanc@gmail.com",
      address: "Đà Nẵng",
      description:
        "Bác sĩ Tim mạch chuyên sâu trong điều trị bệnh tim và tư vấn phòng ngừa.",
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    },
    {
      id: 4,
      name: "BS. Phạm Thị D",
      specialty: "Nhi khoa",
      experience: "7 năm kinh nghiệm",
      rating: 4.7,
      reviews: 76,
      phone: "0904 444 444",
      email: "phamthid@gmail.com",
      address: "Cần Thơ",
      description:
        "Bác sĩ Nhi khoa tận tâm, chuyên khám và điều trị cho trẻ em.",
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    },
  ];

  // ⚠️ QUAN TRỌNG: convert id sang number
  const doctor = doctors.find((doc) => doc.id === Number(id));

  if (!doctor) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Không tìm thấy thông tin bác sĩ</h2>
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
        src={doctor.img}
        alt={doctor.name}
        style={{
          width: "150px",
          height: "150px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

        <div>
          <h2>{doctor.name}</h2>
          <p><strong>Chuyên khoa:</strong> {doctor.specialty}</p>
          <p><strong>Kinh nghiệm:</strong> {doctor.experience}</p>
          <p><strong>Đánh giá:</strong> ⭐ {doctor.rating} ({doctor.reviews} lượt)</p>
          <p><strong>Số điện thoại:</strong> {doctor.phone}</p>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Địa chỉ:</strong> {doctor.address}</p>

          <div style={{ marginTop: "15px" }}>
            <strong>Giới thiệu:</strong>
            <p>{doctor.description}</p>
          </div>

          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Đặt lịch khám
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viewprofiledoctor;