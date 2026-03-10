import React, { useState, useEffect } from 'react';
import DoctorListGrid from "../../components/DoctorList";
import { db } from '../../firebaseConfig'; // Đảm bảo đường dẫn tới file config của bạn
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LẤY DỮ LIỆU THỰC TẾ TỪ FIREBASE ---
  useEffect(() => {
    // 1. Tạo truy vấn lấy tất cả người dùng có vai trò là bác sĩ
    const q = query(
      collection(db, "users"),
      where("role", "==", "doctor")
    );

    // 2. Lắng nghe dữ liệu realtime
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const doctorData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || data.name || "Bác sĩ",
          specialty: data.specialty || "Đa khoa",
          experience: data.experience || "Giàu kinh nghiệm",
          // Ép kiểu về số để hiển thị và tính toán
          rating: Number(data.rating) || 0,
          reviews: data.reviewCount || 0,
          img: data.photoURL || data.img || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
          status: data.status || 'offline'
        };
      });

      setDoctors(doctorData);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi lấy danh sách bác sĩ từ DB:", error);
      setLoading(false);
    });

    // Cleanup khi component bị hủy
    return () => unsubscribe();
  }, []);

  // --- TÍNH TOÁN THỐNG KÊ NHANH ---
  const avgRating = doctors.length > 0 
    ? (doctors.reduce((acc, curr) => acc + curr.rating, 0) / doctors.length).toFixed(1) 
    : "0";

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h3>Đang tải danh sách bác sĩ từ hệ thống...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Page header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>👨‍⚕️ Danh Sách Bác Sĩ</h1>
          <p style={subtitleStyle}>Đội ngũ bác sĩ chuyên môn cao, tận tâm và giàu kinh nghiệm</p>
          <p style={taglineStyle}>Sẵn sàng tư vấn và khám bệnh cho bạn</p>
        </div>

        {/* Stats Section (Dữ liệu thực tế) */}
        <div style={statsGridStyle}>
          {[
            { label: 'Bác sĩ sẵn sàng', value: doctors.length, icon: '👥' },
            { label: 'Độ hài lòng hệ thống', value: `${avgRating}/5`, icon: '⭐' },
            { label: 'Kinh nghiệm trung bình', value: '8+ năm', icon: '📚' }
          ].map((stat, idx) => (
            <div key={idx} style={statCardStyle}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={statValueStyle}>{stat.value}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Doctors Grid */}
        <div style={gridWrapperStyle}>
          {doctors.length > 0 ? (
            <DoctorListGrid doctors={doctors} />
          ) : (
            <div style={emptyStateStyle}>
              <h3>Không có bác sĩ nào trực tuyến</h3>
              <p>Vui lòng kiểm tra lại kết nối hoặc quay lại sau</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div style={ctaContainerStyle}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.5rem' }}>Bạn cần tư vấn y tế ngay?</h3>
          <p style={{ marginBottom: '25px', fontSize: '1.05rem' }}>Liên hệ với chúng tôi hoặc chọn bác sĩ để đặt lịch khám</p>
          <button style={ctaButtonStyle}>📞 Liên hệ tư vấn khẩn cấp</button>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const loadingContainerStyle = { padding: '60px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const pageContainerStyle = { padding: '40px 20px', backgroundColor: '#f8f9fa', minHeight: '100vh' };
const headerStyle = { marginBottom: '50px', textAlign: 'center' };
const titleStyle = { fontSize: '2.5rem', fontWeight: '700', color: '#2c3e50', marginBottom: '10px' };
const subtitleStyle = { fontSize: '1.1rem', color: '#666', marginBottom: '5px' };
const taglineStyle = { fontSize: '0.95rem', color: '#999' };
const statsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '50px' };
const statCardStyle = { background: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e9ecef' };
const statValueStyle = { fontSize: '1.8rem', fontWeight: 'bold', color: '#007bff', marginBottom: '5px' };
const gridWrapperStyle = { background: 'white', padding: '40px 30px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.08)' };
const emptyStateStyle = { textAlign: 'center', padding: '60px 20px', color: '#999' };
const ctaContainerStyle = { marginTop: '50px', background: 'linear-gradient(135deg, #007bff 0%, #00b894 100%)', padding: '40px', borderRadius: '15px', textAlign: 'center', color: 'white' };
const ctaButtonStyle = { padding: '15px 40px', background: 'white', color: '#007bff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };