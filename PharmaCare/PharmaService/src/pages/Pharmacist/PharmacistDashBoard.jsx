import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Link, useNavigate, NavLink } from 'react-router-dom';

const PharmacistDashboard = () => {
  const [pendingRecords, setPendingRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // 1. Lấy danh sách phiếu chờ (Realtime)
  useEffect(() => {
    const q = query(
      collection(db, "medical_records"), 
      where("status", "==", "pending_pharmacist")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sắp xếp đơn mới nhất lên đầu
      records.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPendingRecords(records);
    });

    // Cập nhật đồng hồ
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  // 2. Xử lý Đăng xuất
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // 3. Lọc danh sách theo từ khóa tìm kiếm
  const filteredRecords = pendingRecords.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pharmacist-layout" style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* --- SIDEBAR (THANH ĐIỀU HƯỚNG) --- */}
      <aside style={{ 
        width: '260px', 
        backgroundColor: '#fff', 
        borderRight: '1px solid #e1e4e8', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'fixed',
        height: '100%',
        zIndex: 100
      }}>
        {/* Brand */}
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: '#00b894', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>DS</div>
          <div>
            <h4 style={{ margin: 0, color: '#00b894', fontSize: '1.1rem' }}>PharmaStore</h4>
            <small style={{ color: '#636e72' }}>Dành cho Dược Sĩ</small>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '20px 10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ padding: '12px 15px', background: '#e3f9e5', color: '#00b894', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              📊 Đơn chờ xử lý <span style={{ float: 'right', background: '#ff4757', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{pendingRecords.length}</span>
            </div>
            
            <div style={{ padding: '12px 15px', color: '#636e72', borderRadius: '8px', cursor: 'pointer', opacity: 0.7 }}>
              📦 Kho thuốc (Đang phát triển)
            </div>

            <div style={{ padding: '12px 15px', color: '#636e72', borderRadius: '8px', cursor: 'pointer', opacity: 0.7 }}>
              📜 Lịch sử kê đơn
            </div>
          </div>
        </nav>

        {/* User & Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', background: '#ffeaa7', color: '#d35400', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ flex: 1, marginLeft: '260px', backgroundColor: '#f5f6fa', padding: '30px' }}>
        
        {/* HEADER: Chào hỏi & Thống kê */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#2d3436' }}>Tổng quan công việc</h2>
            <p style={{ color: '#636e72', margin: '5px 0 0' }}>
              Hôm nay, {currentTime.toLocaleDateString('vi-VN')} - {currentTime.toLocaleTimeString('vi-VN')}
            </p>
          </div>
          
          {/* Ô tìm kiếm */}
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="🔍 Tìm tên bệnh nhân..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '12px 20px', 
                width: '300px', 
                borderRadius: '30px', 
                border: '1px solid #dfe6e9', 
                outline: 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}
            />
          </div>
        </header>

        {/* DASHBOARD STATS (Thống kê nhanh) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', borderLeft: '4px solid #ff4757' }}>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>Đơn thuốc cần kê</span>
            <h3 style={{ margin: '5px 0', fontSize: '2rem', color: '#2d3436' }}>{pendingRecords.length}</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', borderLeft: '4px solid #00b894' }}>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>Đã hoàn thành hôm nay</span>
            <h3 style={{ margin: '5px 0', fontSize: '2rem', color: '#2d3436' }}>--</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', borderLeft: '4px solid #0984e3' }}>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>Tổng thuốc trong kho</span>
            <h3 style={{ margin: '5px 0', fontSize: '2rem', color: '#2d3436' }}>--</h3>
          </div>
        </div>

        {/* LIST DANH SÁCH */}
        <h3 style={{ color: '#2d3436', marginBottom: '20px' }}>📋 Danh sách chờ ({filteredRecords.length})</h3>

        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px' }}>
            <p style={{ color: '#b2bec3', fontSize: '1.2rem' }}>
              {searchTerm ? "Không tìm thấy bệnh nhân nào khớp kết quả." : "Hiện không có đơn thuốc nào cần xử lý. Tốt lắm! 🎉"}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {filteredRecords.map(record => (
              <div key={record.id} style={{ 
                background: 'white', 
                borderRadius: '16px', 
                padding: '20px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                border: '1px solid #f1f2f6',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                       <span style={{ background: '#e3f2fd', color: '#0984e3', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          MỚI
                       </span>
                       <h4 style={{ margin: '10px 0 5px', fontSize: '1.2rem' }}>{record.patientName}</h4>
                       <small style={{ color: '#636e72' }}>BS. {record.doctorName}</small>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#b2bec3' }}>
                       {record.createdAt?.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                       <br/>
                       {record.createdAt?.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleDateString() : ''}
                    </div>
                  </div>

                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
                     <p style={{ margin: '0 0 5px', fontSize: '0.9rem', color: '#636e72' }}><strong>Chẩn đoán:</strong></p>
                     <p style={{ margin: 0, fontWeight: '600', color: '#2d3436' }}>{record.diagnosis}</p>
                  </div>

                  {record.doctorNotes && (
                    <div style={{ marginBottom: '15px' }}>
                       <p style={{ margin: '0', fontSize: '0.85rem', color: '#d63031', fontWeight: 'bold' }}>
                         <i className="fas fa-exclamation-circle"></i> Lưu ý: {record.doctorNotes}
                       </p>
                    </div>
                  )}
                </div>

                <Link to={`/pharmacist/prescription/${record.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    width: '100%', 
                    padding: '12px', 
                    background: '#00b894', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    fontSize: '1rem',
                    boxShadow: '0 4px 10px rgba(0, 184, 148, 0.3)'
                  }}>
                    Kê đơn ngay <i className="fas fa-arrow-right"></i>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PharmacistDashboard;