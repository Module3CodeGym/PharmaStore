import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const DoctorExamList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy danh sách lịch hẹn "Đã xác nhận" (confirmed)
    // Có thể thêm điều kiện where("doctorId", "==", auth.currentUser.uid) nếu muốn chỉ hiện bệnh nhân của bác sĩ này
    const q = query(
      collection(db, "appointments"),
      where("status", "==", "confirmed") 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sắp xếp lịch cũ nhất lên đầu để khám trước
      data.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
      setAppointments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{padding: 20}}>Đang tải danh sách chờ...</div>;

  return (
    <div style={{ padding: '30px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <h2 style={{ color: '#2d3436', marginBottom: '10px' }}>🩺 Danh sách chờ khám bệnh</h2>
      <p style={{ color: '#636e72', marginBottom: '30px' }}>Hiện có <strong>{appointments.length}</strong> bệnh nhân đang chờ bạn.</p>
      
      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#b2bec3' }}>
          <i className="fas fa-coffee" style={{ fontSize: '3rem', marginBottom: '15px' }}></i>
          <p>Không có bệnh nhân nào đang chờ. Bạn có thể nghỉ ngơi!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {appointments.map(appt => (
            <div key={appt.id} style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '20px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              borderLeft: '5px solid #0984e3',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ background: '#e3f2fd', color: '#0984e3', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {appt.time} - {appt.date}
                  </span>
                </div>
                
                <h3 style={{ margin: '0 0 5px 0', color: '#2d3436' }}>{appt.patientName}</h3>
                <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: '15px' }}>
                  <i className="fas fa-phone-alt"></i> {appt.patientPhone || 'Không có SĐT'}
                </p>

                <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
                  <small style={{ fontWeight: 'bold', color: '#b2bec3', textTransform: 'uppercase' }}>Lý do khám:</small>
                  <p style={{ margin: '5px 0', color: '#2d3436' }}>{appt.notes || "Khám tổng quát"}</p>
                </div>
              </div>

              <Link to={`/doctor/exam/${appt.id}`} style={{ textDecoration: 'none' }}>
                <button style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: '#0984e3', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'background 0.2s'
                }}>
                  Bắt đầu khám <i className="fas fa-arrow-right"></i>
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorExamList;