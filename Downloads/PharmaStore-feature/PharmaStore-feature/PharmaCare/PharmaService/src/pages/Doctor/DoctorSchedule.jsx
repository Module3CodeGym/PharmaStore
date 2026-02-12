import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

const DoctorSchedule = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  // 1. Lắng nghe lịch hẹn mới theo thời gian thực
  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(data);
    });

    return () => unsubscribe();
  }, []);

  // 2. Hàm xử lý xác nhận và gửi thông báo vào chuông người dùng
  const handleConfirm = async (appointment) => {
    try {
      // Cập nhật trạng thái lịch hẹn
      const appointmentRef = doc(db, "appointments", appointment.id);
      await updateDoc(appointmentRef, { status: "confirmed" });

      // TẠO THÔNG BÁO MỚI CHO NGƯỜI DÙNG
      await addDoc(collection(db, "notifications"), {
        userId: appointment.patientId, // Gửi đích danh cho bệnh nhân này
        type: "appointment",
        message: `Bác sĩ ${appointment.doctor} đã xác nhận lịch khám của bạn vào ${appointment.time} ngày ${appointment.date}.`,
        isRead: false,
        createdAt: serverTimestamp(),
      });

      toast.success(`Đã xác nhận lịch cho bệnh nhân ${appointment.patientName}`);
    } catch (error) {
      console.error("Lỗi xác nhận:", error);
      toast.error("Không thể cập nhật trạng thái.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed": return { color: "#00b894", text: "Đã xác nhận" };
      case "pending": return { color: "#e17055", text: "Chờ xác nhận" };
      case "completed": return { color: "#0984e3", text: "Hoàn tất" };
      default: return { color: "#636e72", text: "Không rõ" };
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f4f7f6", minHeight: "100vh" }}>
      <ToastContainer />
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "30px", color: "#2d3436" }}>📅 Quản lý lịch tư vấn hôm nay</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {appointments.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>Chưa có lịch hẹn nào.</p>
          ) : (
            appointments.map((item) => {
              const statusInfo = getStatusStyle(item.status);
              return (
                <div key={item.id} style={{
                  background: "white", padding: "20px", borderRadius: "15px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)", borderLeft: `6px solid ${statusInfo.color}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ width: "120px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{item.time}</div>
                    <div style={{ fontSize: "0.85rem", color: "#888" }}>{item.date}</div>
                  </div>

                  <div style={{ flex: 1, padding: "0 20px" }}>
                    <h4 style={{ margin: "0 0 5px 0", color: "#2d3436" }}>{item.patientName}</h4>
                    <p style={{ margin: 0, color: "#636e72", fontSize: "0.9rem" }}>{item.symptoms}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ 
                      background: `${statusInfo.color}15`, color: statusInfo.color, 
                      padding: "6px 15px", borderRadius: "20px", fontWeight: "bold", fontSize: "0.8rem" 
                    }}>
                      {statusInfo.text}
                    </span>

                    {/* Nút thao tác nhanh */}
                    {item.status === "pending" ? (
                      <button 
                        onClick={() => handleConfirm(item)}
                        style={confirmBtnStyle}
                      >
                        Xác nhận
                      </button>
                    ) : item.status === "confirmed" ? (
                      <button 
                        onClick={() => navigate("/doctor/chat")}
                        style={chatBtnStyle}
                      >
                        Vào tư vấn
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const confirmBtnStyle = { 
  padding: "10px 20px", background: "#00b894", color: "white", 
  border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" 
};

const chatBtnStyle = { 
  padding: "10px 20px", background: "#0984e3", color: "white", 
  border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" 
};

export default DoctorSchedule;