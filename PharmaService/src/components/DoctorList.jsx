import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebaseConfig'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// SỬA TẠI ĐÂY: Nhận thêm prop `doctors` từ component cha
export default function DoctorList({ doctors: propDoctors }) {
  const navigate = useNavigate();
  const [firebaseDoctors, setFirebaseDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- THÊM STATE CHO TÍNH NĂNG LỌC ---
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  // LẤY DỮ LIỆU TỪ FIREBASE (Chỉ chạy khi component cha KHÔNG truyền props)
  useEffect(() => {
    if (propDoctors) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "users"),
      where("role", "==", "doctor")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const doctorData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.displayName || data.name || "Bác sĩ",
          specialty: data.specialty || "Đa khoa",
          experience: data.experience || "Nhiều năm kinh nghiệm",
          rating: Number(data.rating) || 0,
          reviews: data.reviewCount || 0,
          img: data.photoURL || data.img || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
          status: data.status || "offline"
        };
      });

      setFirebaseDoctors(doctorData);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi lấy danh sách bác sĩ:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [propDoctors]);

  // Ưu tiên dùng data từ props truyền vào, nếu không có mới dùng data tự fetch
  const currentDoctors = propDoctors || firebaseDoctors;

  // --- LOGIC LỌC THEO CHUYÊN KHOA ---
  // 1. Tạo mảng các chuyên khoa không trùng lặp (duy nhất)
  const specialties = ['All', ...new Set(currentDoctors.map(d => d.specialty))];
  
  // 2. Lọc danh sách bác sĩ theo lựa chọn
  const filteredDoctors = selectedSpecialty === 'All' 
    ? currentDoctors 
    : currentDoctors.filter(d => d.specialty === selectedSpecialty);

  // Hàm render sao đánh giá
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "3px" }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{ color: index < fullStars ? "#ffc107" : "#e4e5e9", fontSize: "16px" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⏳</div>
        <h3>Đang tải danh sách bác sĩ...</h3>
      </div>
    );
  }

  if (!currentDoctors || currentDoctors.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#999', background: 'white', borderRadius: '20px' }}>
        <h3>Hiện chưa có bác sĩ nào trên hệ thống</h3>
        <p>Vui lòng quay lại sau.</p>
      </div>
    );
  }

  // Sắp xếp BÁC SĨ ĐÃ LỌC theo rating cao nhất
  const sortedDoctors = [...filteredDoctors].sort((a, b) => b.rating - a.rating);
  const featuredDoctor = sortedDoctors[0]; // Bác sĩ cao điểm nhất của khoa đang chọn
  const otherDoctors = sortedDoctors.slice(1);

  return (
    <div style={{ paddingBottom: '40px' }}>
      
      {/* --- UI: BỘ LỌC CHUYÊN KHOA --- */}
      <div style={{ 
        marginBottom: '35px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        background: 'white', 
        padding: '18px 25px', 
        borderRadius: '15px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
      }}>
        <label style={{ fontWeight: '700', color: '#2c3e50', fontSize: '1.1rem', margin: 0 }}>
          <i className="fas fa-filter" style={{ marginRight: '8px', color: '#007bff' }}></i>
          Lọc theo chuyên khoa:
        </label>
        <select 
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: '2px solid #e9ecef',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '250px',
            backgroundColor: '#f8f9fa',
            fontWeight: '600',
            color: '#495057'
          }}
        >
          {specialties.map((spec, index) => (
            <option key={index} value={spec}>
              {spec === 'All' ? '🌟 Tất cả chuyên khoa' : spec}
            </option>
          ))}
        </select>
      </div>

      {/* XỬ LÝ TRƯỜNG HỢP KHOA KHÔNG CÓ BÁC SĨ */}
      {sortedDoctors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '20px', border: '1px dashed #ced4da' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🥼</div>
          <h3 style={{ color: '#6c757d' }}>Chưa có bác sĩ thuộc chuyên khoa "{selectedSpecialty}"</h3>
          <p style={{ color: '#adb5bd' }}>Vui lòng chọn chuyên khoa khác.</p>
        </div>
      ) : (
        <>
          {/* 1. FEATURED DOCTOR */}
          {featuredDoctor && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '50px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              alignItems: 'center',
              boxShadow: '0 15px 40px rgba(118, 75, 162, 0.3)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={featuredDoctor.img}
                    alt={featuredDoctor.name}
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      border: '6px solid rgba(255,255,255,0.3)',
                      objectFit: 'cover',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/doctor-view/${featuredDoctor.id}`)}
                  />
                  <span title="Bác sĩ ưu tú" style={{
                    position: 'absolute', bottom: '10px', right: '10px', background: '#28c76f',
                    color: 'white', width: '45px', height: '45px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', border: '4px solid #764ba2'
                  }}>
                    <i className="fas fa-check"></i>
                  </span>
                </div>
              </div>

              <div>
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                  BÁC SĨ NỔI BẬT {selectedSpecialty !== 'All' ? `- ${selectedSpecialty.toUpperCase()}` : ''}
                </span>
                <h2 style={{ fontSize: '2.2rem', margin: '15px 0 10px', fontWeight: '700' }}>
                  {featuredDoctor.name}
                </h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '15px', opacity: '0.9' }}>
                  {featuredDoctor.specialty}
                </p>
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                  {renderStars(featuredDoctor.rating)}
                  <div style={{ fontSize: '0.95rem', marginTop: '8px', opacity: '0.9' }}>
                    <strong>{featuredDoctor.rating}</strong> ({featuredDoctor.reviews} lượt đánh giá)
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    onClick={() => navigate(`/appointment?doctorId=${featuredDoctor.id}&doctorName=${encodeURIComponent(featuredDoctor.name)}`)}
                    style={{
                      padding: '16px 35px', background: 'white', color: '#764ba2', border: 'none',
                      borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer',
                      transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '10px'
                    }}
                  >
                    <i className="far fa-calendar-check"></i> Đặt lịch khám
                  </button>
                  
                  <button 
                    onClick={() => navigate(`/doctor-view/${featuredDoctor.id}`)}
                    style={{
                      padding: '16px 25px', background: 'transparent', color: 'white', border: '2px solid white',
                      borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer'
                    }}
                  >
                    Xem hồ sơ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. OTHER DOCTORS LIST */}
          {otherDoctors.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '30px', color: '#2d3436', paddingLeft: '10px', borderLeft: '6px solid #007bff' }}>
                Danh sách bác sĩ {selectedSpecialty !== 'All' ? selectedSpecialty : 'khác'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {otherDoctors.map(doctor => (
                  <div key={doctor.id}
                    style={{
                      background: 'white', padding: '20px 30px', borderRadius: '18px', display: 'grid',
                      gridTemplateColumns: '100px 1fr 180px', gap: '25px', alignItems: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f2f6'
                    }}
                  >
                    <img
                      src={doctor.img} alt={doctor.name} onClick={() => navigate(`/doctor-view/${doctor.id}`)}
                      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f8f9fa', cursor: 'pointer' }}
                    />
                    <div>
                      <h4 
                        onClick={() => navigate(`/doctor-view/${doctor.id}`)}
                        style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#2c3e50', cursor: 'pointer' }}
                      >
                        {doctor.name}
                      </h4>
                      <p style={{ color: '#007bff', fontWeight: '600', margin: '0 0 8px 0', fontSize: '0.95rem' }}>{doctor.specialty}</p>
                      <p style={{ fontSize: '0.85rem', color: '#636e72', margin: 0 }}>
                        <i className="fas fa-medal" style={{ marginRight: '6px', color: '#fab1a0' }}></i> {doctor.experience}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
                      <div style={{ marginBottom: '12px' }}>
                        {renderStars(doctor.rating)}
                        <span style={{ fontSize: '0.8rem', color: '#b2bec3', display: 'block', marginTop: '4px' }}>
                          {doctor.rating} ({doctor.reviews} đánh giá)
                        </span>
                      </div>
                      <button 
                        onClick={() => navigate(`/appointment?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.name)}`)}
                        style={{
                          width: '100%', padding: '10px', background: '#f0f7ff', color: '#007bff',
                          border: '1px solid #007bff', borderRadius: '8px', fontWeight: '700',
                          fontSize: '0.9rem', cursor: 'pointer'
                        }}
                      >
                        Đặt lịch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}