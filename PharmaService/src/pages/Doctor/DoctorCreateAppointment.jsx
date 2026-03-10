import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorCreateAppointment = () => {

  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    date: "",
    time: "",
    note: ""
  });

  // kiểm tra đăng nhập bác sĩ
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        setDoctor(user);
      } else {
        toast.error("Bạn cần đăng nhập!");
        navigate("/login");
      }

    });

    return () => unsubscribe();

  }, [navigate]);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!doctor) {
      toast.error("Không tìm thấy bác sĩ");
      return;
    }

    try {

      await addDoc(collection(db, "appointments"), {

        doctorId: doctor.uid,
        doctorName: doctor.displayName || "Bác sĩ",

        patientId: formData.patientId,
        patientName: formData.patientName,

        date: formData.date,
        time: formData.time,

        note: formData.note,

        status: "confirmed",

        createdAt: serverTimestamp()

      });

      toast.success("📅 Tạo lịch khám thành công!");

      setTimeout(() => {
        navigate("/doctor/appointments");
      }, 2000);

    } catch (error) {

      console.error(error);
      toast.error("Có lỗi xảy ra!");

    }

  };


  return (
    <div style={{
      padding: "30px",
      background: "#f5f6fa",
      minHeight: "100vh"
    }}>

      <ToastContainer />

      <div style={{
        maxWidth: "600px",
        margin: "0 auto",
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
      }}>

        <h2 style={{
          textAlign: "center",
          marginBottom: "25px"
        }}>
          🩺 Tạo lịch khám cho bệnh nhân
        </h2>


        {doctor && (
          <p style={{
            textAlign: "center",
            color: "#636e72",
            marginBottom: "25px"
          }}>
            Bác sĩ: <strong>{doctor.displayName || doctor.email}</strong>
          </p>
        )}


        <form onSubmit={handleSubmit}>

          {/* patient name */}
          <div style={{ marginBottom: "20px" }}>
            <label>Tên bệnh nhân</label>

            <input
              type="text"
              name="patientName"
              required
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Nhập tên bệnh nhân"
              style={inputStyle}
            />
          </div>


          {/* patient id */}
          <div style={{ marginBottom: "20px" }}>
            <label>ID bệnh nhân</label>

            <input
              type="text"
              name="patientId"
              required
              value={formData.patientId}
              onChange={handleChange}
              placeholder="Nhập ID bệnh nhân"
              style={inputStyle}
            />
          </div>


          {/* date + time */}
          <div style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px"
          }}>

            <div style={{ flex: 1 }}>
              <label>Ngày khám</label>

              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                style={inputStyle}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label>Giờ khám</label>

              <select
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">-- Chọn giờ --</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>

            </div>

          </div>


          {/* note */}
          <div style={{ marginBottom: "25px" }}>
            <label>Ghi chú</label>

            <textarea
              name="note"
              rows="4"
              value={formData.note}
              onChange={handleChange}
              placeholder="Ghi chú cho buổi khám..."
              style={{
                ...inputStyle,
                resize: "none"
              }}
            />
          </div>


          <button type="submit" style={buttonStyle}>
            📅 Tạo lịch khám
          </button>

        </form>

      </div>

    </div>
  );
};


const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  borderRadius: "10px",
  border: "1px solid #dfe6e9",
  outline: "none",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  background: "#00b894",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer"
};

export default DoctorCreateAppointment;