import React from "react";
import "../../App.css";

const PrescriptionDetail = () => {
  // MOCK DATA (sau này thay bằng API)
  const prescription = {
    id: 1,
    patient: {
      name: "Nguyễn Văn A",
      email: "a@gmail.com",
      phone: "0909123456",
    },
    file: "don_thuoc_001.pdf",
    medicines: [
      { name: "Paracetamol", quantity: 2 },
      { name: "Amoxicillin", quantity: 1 },
    ],
    status: "cho_duyet",
  };

  return (
    <div className="doctor-container page-container">
      <h2 className="page-title">🧾 Chi tiết đơn thuốc</h2>

      {/* Thông tin bệnh nhân */}
      <div className="card">
        <h4>👤 Thông tin bệnh nhân</h4>
        <p><b>Họ tên:</b> {prescription.patient.name}</p>
        <p><b>Email:</b> {prescription.patient.email}</p>
        <p><b>SĐT:</b> {prescription.patient.phone}</p>
      </div>

      {/* File đơn thuốc */}
      <div className="card">
        <h4>📄 File đơn thuốc</h4>
        <a href="#" style={{ color: "#0984e3" }}>
          {prescription.file}
        </a>
      </div>

      {/* Thuốc trong đơn */}
      <div className="card">
        <h4>💊 Thuốc trong đơn</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Tên thuốc</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map((m, index) => (
              <tr key={index}>
                <td>{m.name}</td>
                <td>{m.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Duyệt đơn */}
      <div className="card">
        <h4>🩺 Ý kiến bác sĩ</h4>
        <textarea
          placeholder="Nhập ghi chú cho bệnh nhân..."
          style={{ width: "100%", height: "80px" }}
        />

        <div style={{ marginTop: "15px" }}>
          <button className="btn-success">✔ Duyệt đơn</button>
          <button className="btn-danger" style={{ marginLeft: "10px" }}>
            ✖ Từ chối
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;
