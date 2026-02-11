import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment = () => {
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    symptoms: "",
  });

  const doctors = [
    { id: 1, name: "BS. Nguyễn Văn A - Nội tổng quát" },
    { id: 2, name: "BS. Trần Thị B - Nhi khoa" },
    { id: 3, name: "BS. Lê Minh C - Da liễu" },
  ];

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Đặt lịch thành công!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
    });
  };

  return (
    <div style={{ padding: "30px", background: "#f4f6f9", minHeight: "100vh" }}>
      
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
      }}>
        
        <h2 style={{ marginBottom: "25px", color: "#2d3436" }}>
          📅 Đặt Lịch Tư Vấn Trực Tuyến
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Chọn bác sĩ */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Chọn bác sĩ</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd"
              }}
            >
              <option value="">-- Chọn bác sĩ --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn ngày */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Chọn ngày</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd"
              }}
            />
          </div>

          {/* Chọn giờ */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Chọn giờ</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd"
              }}
            >
              <option value="">-- Chọn giờ --</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Nhập triệu chứng */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{ fontWeight: "bold" }}>Mô tả triệu chứng</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="4"
              placeholder="Ví dụ: Ho 3 ngày, sốt nhẹ..."
              required
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "8px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                resize: "none"
              }}
            />
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#0984e3",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            Xác nhận đặt lịch
          </button>

        </form>
      </div>
    </div>
    
  );
};

export default Appointment;
