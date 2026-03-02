import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig'; 
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const DoctorExamList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chỉ lấy lịch hẹn của bác sĩ đang đăng nhập và có trạng thái "confirmed"
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", auth.currentUser.uid), // Lọc theo UID bác sĩ
      where("status", "==", "confirmed"),
      orderBy("date", "asc"), // Sắp xếp theo ngày
      orderBy("time", "asc")  // Sắp xếp theo giờ
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(data);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi lấy danh sách chờ (Permission Denied):", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{padding: 20}}>Đang tải danh sách chờ khám...</div>;

  return (
    <div style={{ padding: '30px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#2d3436', margin: 0 }}>🩺 Danh sách chờ khám bệnh</h2>
          <p style={{ color: '#636e72', margin: '5px 0 0 0' }}>
            Bác sĩ: <strong>{auth.currentUser.displayName || auth.currentUser.email}</strong>
          </p>
        </div>
        <div style={{ background: '#0984e3', color: 'white', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' }}>
          {appointments.length} Bệnh nhân
        </div>
      </div>
      
      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px', background: 'white', padding: '50px', borderRadius: '20px' }}>
          <i className="fas fa-calendar-check" style={{ fontSize: '4rem', color: '#dfe6e9', marginBottom: '20px' }}></i>
          <h3 style={{ color: '#b2bec3' }}>Hôm nay bạn đã hoàn thành hết lịch khám!</h3>
          <p style={{ color: '#b2bec3' }}>Bạn có thể nghỉ ngơi hoặc kiểm tra lại hồ sơ bệnh án cũ.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {appointments.map(appt => (
            <div key={appt.id} style={cardStyle}>
              <div style={timeBadgeStyle}>
                <i className="far fa-clock"></i> {appt.time} — {appt.date}
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#2d3436', fontSize: '1.3rem' }}>{appt.patientName}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#636e72', fontSize: '0.9rem' }}>
                  <i className="fas fa-id-card"></i> ID: {appt.patientId?.substring(0, 8)}...
                </div>
              </div>

              <div style={notesBoxStyle}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#a2a2a2', textTransform: 'uppercase' }}>Triệu chứng báo cáo:</span>
                <p style={{ margin: '5px 0 0 0', color: '#444', lineHeight: '1.4' }}>
                  {appt.symptoms || "Không có mô tả triệu chứng cụ thể."}
                </p>
              </div>

              <Link to={`/doctor/exam/${appt.id}`} style={{ textDecoration: 'none' }}>
                <button style={btnStartStyle}>
                  Mở hồ sơ khám bệnh <i className="fas fa-external-link-alt"></i>
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const cardStyle = { background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', borderTop: '6px solid #0984e3', transition: 'transform 0.2s' };
const timeBadgeStyle = { display: 'inline-block', background: '#ebf5ff', color: '#0984e3', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '15px' };
const notesBoxStyle = { background: '#fcfcfc', border: '1px solid #f0f0f0', padding: '15px', borderRadius: '10px', marginBottom: '25px' };
const btnStartStyle = { width: '100%', padding: '14px', background: 'linear-gradient(45deg, #0984e3, #00a8ff)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' };

export default DoctorExamList;