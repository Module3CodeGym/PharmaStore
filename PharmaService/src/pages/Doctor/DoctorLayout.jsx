import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './DoctorLayout.css'; 

const DoctorLayout = () => {
  const [doctor, setDoctor] = useState(null);
  const [isOnline, setIsOnline] = useState(true); // Trạng thái Đang trực
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown Avatar
  
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname.toLowerCase().includes('/doctor/chat');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor({ ...user, ...docSnap.data() });
        } else {
          setDoctor(user);
        }
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!doctor) return null;

  return (
    <div className="doctor-layout-horizontal">
      
      {/* --- HEADER NGANG (TOP BAR) --- */}
      <header className="doctor-header">
        
        {/* 1. LOGO | DOCTOR PORTAL */}
        <div className="header-brand" onClick={() => navigate('/doctor')}>
          <div className="brand-logo">💊</div>
          <span className="brand-text">Doctor Portal</span>
        </div>

        {/* 2. MENU ĐIỀU HƯỚNG (Chat | Thuốc | Kê đơn...) */}
        <nav className="header-nav">
          <NavLink to="/doctor/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Hồ sơ
          </NavLink>
          <NavLink to="/doctor/chat" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Chat
          </NavLink>
          <NavLink to="/doctor/products" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Thuốc
          </NavLink>
          <NavLink to="/doctor/prescribe" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Kê đơn
          </NavLink>
          <NavLink to="/doctor/orders" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            Đơn hàng
          </NavLink>
        </nav>

        {/* 3. CÔNG CỤ (Search | Notify | Status | Avatar) */}
        <div className="header-actions">
          
          {/* Search Box */}
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Tìm bệnh nhân..." />
          </div>

          {/* Notification */}
          <button className="icon-btn">
            <i className="fas fa-bell"></i>
            <span className="badge-dot"></span>
          </button>

          {/* Trạng thái Online */}
          <div 
            className={`status-pill ${isOnline ? 'online' : 'offline'}`}
            onClick={() => setIsOnline(!isOnline)}
            title="Bấm để chuyển trạng thái"
          >
            <span className="dot"></span>
            {isOnline ? "Đang trực" : "Vắng mặt"}
          </div>

          {/* Avatar Dropdown */}
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
  <img 
    src={doctor.photoURL || "https://via.placeholder.com/40"} 
    alt="Avatar" 
    className="avatar-img"
  />
  <i className="fas fa-caret-down"></i>
  
  {/* Dropdown Menu */}
  {showDropdown && (
    <div className="custom-dropdown-menu"> {/* <--- ĐỔI TÊN Ở ĐÂY */}
      <div className="dropdown-header">
        <strong>{doctor.displayName || "Bác sĩ"}</strong>
        <small>Khoa Nội</small>
      </div>
      <hr />
      <div className="dropdown-item" onClick={() => navigate('/doctor/profile')}>
        <i className="fas fa-user-cog"></i> Cài đặt tài khoản
      </div>
      <div className="dropdown-item text-danger" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Đăng xuất
      </div>
    </div>
  )}
</div>

        </div>
      </header>

      {/* --- CONTENT (NỘI DUNG CHÍNH) --- */}
      <main className={`doctor-main ${isChatPage ? 'no-padding' : ''}`}>
        <Outlet />
      </main>

    </div>
  );
};

export default DoctorLayout;