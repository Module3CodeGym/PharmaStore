import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// --- COMPONENT CON: SIDEBAR ITEM (Để xử lý Hover đẹp mắt) ---
const SidebarItem = ({ icon, text, to, active = false, badge }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyle = {
    padding: '12px 15px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textDecoration: 'none',
    marginBottom: '8px',
    backgroundColor: active ? '#e3f9e5' : (isHovered ? '#f0fdf4' : 'transparent'),
    color: active ? '#00b894' : (isHovered ? '#00b894' : '#636e72'),
    fontWeight: active ? 'bold' : '500',
    transform: isHovered ? 'translateX(5px)' : 'translateX(0)'
  };

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div 
        style={baseStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{icon}</span>
          <span>{text}</span>
        </div>
        {badge && (
          <span style={{ 
            background: '#ff4757', color: 'white', 
            fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px' 
          }}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

// --- COMPONENT CHÍNH ---
const PharmacistDashboard = () => {
  const [pendingRecords, setPendingRecords] = useState([]);
  const [stats, setStats] = useState({ completed: 0, inventory: 0 }); // State thống kê
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const navigate = useNavigate();
  const location = useLocation(); // Để biết đang ở trang nào mà Active menu

  // 1. LẤY DỮ LIỆU REALTIME
  useEffect(() => {
    // A. Lấy danh sách chờ
    const qPending = query(collection(db, "medical_records"), where("status", "==", "pending_pharmacist"));
    const unsubPending = onSnapshot(qPending, (snapshot) => {
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      records.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setPendingRecords(records);
    });

    // B. Đếm số đơn đã hoàn thành (Lấy từ prescriptions)
    const unsubPrescriptions = onSnapshot(collection(db, "prescriptions"), (snapshot) => {
      setStats(prev => ({ ...prev, completed: snapshot.size }));
    });

    // C. Đếm tổng loại thuốc trong kho
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setStats(prev => ({ ...prev, inventory: snapshot.size }));
    });

    // Đồng hồ
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      unsubPending();
      unsubPrescriptions();
      unsubProducts();
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const filteredRecords = pendingRecords.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pharmacist-layout" style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", background: '#f5f6fa' }}>
      
      {/* --- SIDEBAR --- */}
      <aside style={{ width: '260px', backgroundColor: '#fff', borderRight: '1px solid #e1e4e8', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', zIndex: 100, boxShadow: '2px 0 10px rgba(0,0,0,0.02)' }}>
        
        {/* Brand */}
        <div style={{ padding: '25px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #00b894, #55efc4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0, 184, 148, 0.4)' }}>DS</div>
          <div>
            <h4 style={{ margin: 0, color: '#2d3436', fontSize: '1.2rem', letterSpacing: '0.5px' }}>PharmaStore</h4>
            <small style={{ color: '#b2bec3', fontSize: '0.8rem' }}>Pharmacist Panel</small>
          </div>
        </div>

        {/* MENU */}
        <nav style={{ flex: 1, padding: '25px 15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <SidebarItem 
              to="/pharmacist/dashboard" 
              text="Tổng quan" 
              icon="📊" 
              active={location.pathname === '/pharmacist/dashboard'}
              badge={pendingRecords.length > 0 ? pendingRecords.length : null}
            />
            
            <SidebarItem 
              to="/pharmacist/inventory" 
              text="Kho thuốc & HSD" 
              icon="📦" 
              active={location.pathname === '/pharmacist/inventory'}
            />

            <SidebarItem 
              to="/pharmacist/orders" 
              text="Quản lý đơn hàng" 
              icon="🚚" 
              active={location.pathname === '/pharmacist/orders'}
            />

            <SidebarItem 
              to="/pharmacist/history" 
              text="Lịch sử kê đơn" 
              icon="📜" 
              active={location.pathname === '/pharmacist/history'}
            />

          </div>
        </nav>

        {/* User Info & Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ marginBottom:'15px', padding:'10px', background:'#f8f9fa', borderRadius:'8px', display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{width:'30px', height:'30px', borderRadius:'50%', background:'#dfe6e9', display:'flex', alignItems:'center', justifyContent:'center'}}>👤</div>
                <div style={{fontSize:'0.85rem', color:'#636e72', fontWeight:'600'}}>Dược sĩ</div>
            </div>
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', padding: '12px', background: '#ffeaa7', color: '#d35400', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
            onMouseEnter={(e) => e.target.style.background = '#ff7675'}
            onMouseLeave={(e) => e.target.style.background = '#ffeaa7'}
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '40px' }}>
        
        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#2d3436', fontSize: '1.8rem' }}>Xin chào, Dược sĩ! 👋</h2>
            <p style={{ color: '#636e72', margin: '5px 0 0', fontSize: '1rem' }}>
              Hôm nay, {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="🔍 Tìm nhanh bệnh nhân..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '12px 25px', width: '320px', borderRadius: '50px', 
                border: 'none', outline: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </header>

        {/* THỐNG KÊ (2 HỘP CÒN LẠI - DỮ LIỆU THẬT) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          
          {/* Hộp 1: Đã hoàn thành */}
          <div style={{ 
              background: 'linear-gradient(135deg, #00b894, #00cec9)', 
              padding: '25px', borderRadius: '16px', 
              color: 'white', boxShadow: '0 10px 20px rgba(0, 184, 148, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
            <div>
              <span style={{ fontSize: '1rem', opacity: 0.9 }}>Tổng đơn đã hoàn thành</span>
              <h3 style={{ margin: '5px 0', fontSize: '2.5rem' }}>{stats.completed}</h3>
            </div>
            <div style={{ fontSize: '3rem', opacity: 0.3 }}>✅</div>
          </div>

          {/* Hộp 2: Tổng thuốc trong kho */}
          <div style={{ 
              background: 'white', 
              padding: '25px', borderRadius: '16px', 
              color: '#2d3436', boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderLeft: '5px solid #0984e3'
            }}>
            <div>
              <span style={{ fontSize: '1rem', color: '#636e72' }}>Tổng loại thuốc trong kho</span>
              <h3 style={{ margin: '5px 0', fontSize: '2.5rem', color: '#0984e3' }}>{stats.inventory}</h3>
            </div>
            <div style={{ fontSize: '3rem', opacity: 0.1 }}>💊</div>
          </div>

        </div>

        {/* DANH SÁCH CHỜ XỬ LÝ */}
        <h3 style={{ color: '#2d3436', marginBottom: '25px', fontSize: '1.4rem' }}>
            ⚡ Danh sách chờ xử lý ({filteredRecords.length})
        </h3>

        {filteredRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
             <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
             <h3 style={{ color: '#2d3436', margin: '0 0 10px 0' }}>Tuyệt vời! Đã hết việc.</h3>
            <p style={{ color: '#b2bec3', fontSize: '1.1rem' }}>
              {searchTerm ? "Không tìm thấy kết quả tìm kiếm." : "Hiện không có đơn thuốc nào cần kê."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' }}>
            {filteredRecords.map(record => (
              <div key={record.id} 
                style={{ 
                    background: 'white', borderRadius: '20px', padding: '25px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.03)', border: '1px solid white',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    transition: 'all 0.3s ease', cursor: 'default'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = '#00b894';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.03)';
                    e.currentTarget.style.borderColor = 'white';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                       <span style={{ background: '#e3f2fd', color: '#0984e3', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', letterSpacing:'0.5px' }}>NEW</span>
                       <h4 style={{ margin: '12px 0 5px', fontSize: '1.3rem', color:'#2d3436' }}>{record.patientName}</h4>
                       <small style={{ color: '#636e72', fontSize:'0.9rem' }}>👨‍⚕️ BS. {record.doctorName}</small>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#b2bec3', fontWeight:'500' }}>
                       {record.createdAt?.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                       <br/>
                       {record.createdAt?.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleDateString() : ''}
                    </div>
                  </div>

                  <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '20px', borderLeft:'4px solid #dfe6e9' }}>
                     <p style={{ margin: '0 0 5px', fontSize: '0.85rem', color: '#636e72', textTransform:'uppercase', fontWeight:'bold' }}>Chẩn đoán</p>
                     <p style={{ margin: 0, fontWeight: '600', color: '#2d3436', fontSize:'1rem' }}>{record.diagnosis}</p>
                  </div>
                </div>

                <Link to={`/pharmacist/prescription/${record.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    width: '100%', padding: '14px', background: '#00b894', color: 'white', 
                    border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer',
                    fontSize: '1rem', boxShadow: '0 8px 15px rgba(0, 184, 148, 0.25)',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                    transition:'0.2s'
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