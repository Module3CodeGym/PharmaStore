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
      records.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPendingRecords(records);
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const filteredRecords = pendingRecords.filter(record => 
    (record.patientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Định nghĩa style cho NavLink để tránh lặp lại code
  const navLinkStyle = ({ isActive }) => ({
    padding: '12px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    transition: '0.3s',
    background: isActive ? '#e3f9e5' : 'transparent',
    color: isActive ? '#00b894' : '#636e72',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <div className="pharmacist-layout" style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* --- SIDEBAR --- */}
      <aside style={{ 
        width: '260px', backgroundColor: '#fff', borderRight: '1px solid #e1e4e8', 
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', zIndex: 100 
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: '#00b894', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>DS</div>
          <div>
            <h4 style={{ margin: 0, color: '#00b894', fontSize: '1.1rem' }}>PharmaStore</h4>
            <small style={{ color: '#636e72' }}>Dược Sĩ</small>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            
            <NavLink to="/pharmacist/dashboard" style={navLinkStyle}>
              📊 Đơn chờ xử lý 
              <span style={{ float: 'right', background: '#ff4757', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>
                {pendingRecords.length}
              </span>
            </NavLink>
            
            <NavLink to="/pharmacist/inventory" style={navLinkStyle}>
              📦 Kho thuốc
            </NavLink>

            <NavLink to="/pharmacist/history" style={navLinkStyle}>
              📜 Lịch sử kê đơn
            </NavLink>
          </div>
        </nav>

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
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#2d3436' }}>Tổng quan công việc</h2>
            <p style={{ color: '#636e72', margin: '5px 0 0' }}>
              Hôm nay, {currentTime.toLocaleDateString('vi-VN')} - {currentTime.toLocaleTimeString('vi-VN')}
            </p>
          </div>
          
          <input 
            type="text" 
            placeholder="🔍 Tìm tên bệnh nhân..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '12px 20px', width: '300px', borderRadius: '30px', 
              border: '1px solid #dfe6e9', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          />
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ff4757' }}>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>Đơn thuốc cần kê</span>
            <h3 style={{ margin: '5px 0', fontSize: '2rem', color: '#2d3436' }}>{pendingRecords.length}</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #00b894' }}>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>Hoàn thành hôm nay</span>
            <h3 style={{ margin: '5px 0', fontSize: '2rem', color: '#2d3436' }}>0</h3>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #0984e3' }}>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>Kho thuốc</span>
            <h3 style={{ margin: '5px 0', fontSize: '2rem', color: '#2d3436' }}>--</h3>
          </div>
        </div>

        <h3 style={{ color: '#2d3436', marginBottom: '20px' }}>📋 Danh sách chờ ({filteredRecords.length})</h3>

        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '12px' }}>
            <p style={{ color: '#b2bec3', fontSize: '1.1rem' }}>
              {searchTerm ? "Không tìm thấy kết quả phù hợp." : "Hiện không có đơn thuốc nào cần xử lý. Tốt lắm! 🎉"}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {filteredRecords.map(record => (
              <div key={record.id} style={{ 
                background: 'white', borderRadius: '16px', padding: '20px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)', border: '1px solid #f1f2f6'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div>
                    <span style={{ background: '#e3f2fd', color: '#0984e3', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>MỚI</span>
                    <h4 style={{ margin: '10px 0 5px' }}>{record.patientName}</h4>
                    <small style={{ color: '#636e72' }}>BS. {record.doctorName}</small>
                  </div>
                </div>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 5px', fontSize: '0.85rem' }}><strong>Chẩn đoán:</strong></p>
                  <p style={{ margin: 0, fontWeight: '600' }}>{record.diagnosis}</p>
                </div>
                <Link to={`/pharmacist/prescription/${record.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ width: '100%', padding: '12px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Kê đơn ngay
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