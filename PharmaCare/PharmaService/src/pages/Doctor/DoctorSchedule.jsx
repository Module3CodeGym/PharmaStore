import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorSchedule = () => {
  const navigate = useNavigate();

  // Dữ liệu mẫu
  const appointments = [
    {
      id: 1,
      time: "08:00 - 08:30",
      patient: "Nguyễn Văn A",
      issue: "Tư vấn cảm cúm",
      status: "confirmed",
      color: "#00b894",
    },
    {
      id: 2,
      time: "09:00 - 09:30",
      patient: "Trần Thị B",
      issue: "Dị ứng da",
      status: "pending",
      color: "#e17055",
    },
    {
      id: 3,
      time: "10:00 - 10:30",
      patient: "Lê Văn C",
      issue: "Đau dạ dày",
      status: "completed",
      color: "#0984e3",
    },
  ];

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Hoàn tất";
      default:
        return "";
    }
  };

  return (
    <div style={{ padding: "20px", background: "#f4f6f9", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#2d3436", marginBottom: "10px" }}>
          📅 Lịch làm việc hôm nay
        </h2>
        <input
          type="date"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      {/* DANH SÁCH LỊCH HẸN */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {appointments.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              borderLeft: `5px solid ${item.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 5px 15px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 2px 10px rgba(0,0,0,0.05)";
            }}
          >
            {/* TIME */}
            <div style={{ width: "150px", fontWeight: "bold", color: "#2d3436" }}>
              {item.time}
            </div>

            {/* INFO */}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: "#2d3436" }}>
                {item.patient}
              </h4>
              <p style={{ margin: "5px 0 0", color: "#636e72" }}>
                {item.issue}
              </p>
            </div>

            {/* STATUS */}
            <div
              style={{
                background: `${item.color}20`,
                color: item.color,
                padding: "8px 15px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "500",
              }}
            >
              {getStatusText(item.status)}
            </div>

            {/* BUTTON */}
            {item.status === "confirmed" && (
              <button
                onClick={() => navigate("/doctor/chat")}
                style={{
                  marginLeft: "20px",
                  padding: "8px 15px",
                  background: "#0984e3",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Bắt đầu tư vấn
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorSchedule;
