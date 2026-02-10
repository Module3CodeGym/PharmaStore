import React, { useState, useEffect, useRef } from 'react'; // 1. Đã thêm useRef
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './DoctorLayout.css'; 
import { listenToNotifications, markAsRead } from '../../services/notificationService';

const DoctorLayout = () => {
  const [doctor, setDoctor] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State cho thông báo
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  
  // State cho Popup (Toast)
  const [toast, setToast] = useState(null);
  const lastNotificationIdRef = useRef(null); // Dùng để check tin mới

  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname.toLowerCase().includes('/doctor/chat');

  // 1. Lấy thông tin bác sĩ
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

  // 2. Lắng nghe thông báo & Xử lý Popup
  useEffect(() => {
    const unsubscribe = listenToNotifications((data) => {
      setNotifications(data);
      
      const count = data.filter(n => !n.isRead).length;
      setUnreadCount(count);

      // Logic hiện Popup
      if (data.length > 0) {
        const newest = data[0];
        
        // Nếu có tin mới + chưa đọc + khác tin cũ
        if (lastNotificationIdRef.current && newest.id !== lastNotificationIdRef.current && !newest.isRead) {
          setToast({
            title: newest.title,
            message: newest.message,
            type: newest.type
          });

          // Tự tắt sau 3s
          setTimeout(() => {
            setToast(null);
          }, 3000);
        }
        lastNotificationIdRef.current = newest.id;
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Xử lý click vào thông báo
  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    setShowNotifDropdown(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!doctor) return null;

  return (
    <div className="doctor-layout-horizontal">
      
      {/* --- HEADER --- */}
      <header className="doctor-header">
        
        {/* LOGO */}
        <div className="header-brand" onClick={() => navigate('/doctor')}>
          <div className="brand-logo">💊</div>
          <span className="brand-text">Doctor PharmaStore</span>
        </div>

        {/* MENU */}
        <nav className="header-nav">
          <NavLink to="/doctor/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Hồ sơ</NavLink>
          <NavLink to="/doctor/chat" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Chat</NavLink>
          <NavLink to="/doctor/products" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Thuốc</NavLink>
          <NavLink to="/doctor/prescribe" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Kê đơn</NavLink>
          <NavLink to="/doctor/orders" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>Đơn hàng</NavLink>
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Tìm bệnh nhân..." />
          </div>

          {/* CHUÔNG THÔNG BÁO */}
          <div className="notification-wrapper" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && <span className="red-dot"></span>}
            </button>

            {showNotifDropdown && (
              <div className="notification-dropdown">
                <div className="notif-header">
                  <strong>Thông báo</strong>
                  <span onClick={() => setShowNotifDropdown(false)}>&times;</span>
                </div>
                <div className="notif-list">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`notif-item ${!notif.isRead ? 'unread' : ''}`} onClick={() => handleNotificationClick(notif)}>
                        <div className="notif-icon">
                          {notif.type === 'message' && <i className="fas fa-comment-dots text-primary"></i>}
                          {notif.type === 'order' && <i className="fas fa-shopping-cart text-success"></i>}
                          {notif.type === 'system' && <i className="fas fa-info-circle text-info"></i>}
                        </div>
                        <div className="notif-content">
                          <p className="notif-title">{notif.title}</p>
                          <p className="notif-desc">{notif.message}</p>
                          <span className="notif-time">{notif.createdAt?.seconds ? new Date(notif.createdAt.seconds * 1000).toLocaleString('vi-VN') : 'Vừa xong'}</span>
                        </div>
                        {!notif.isRead && <span className="blue-dot"></span>}
                      </div>
                    ))
                  ) : (
                    <div className="notif-empty">Không có thông báo mới</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* TRẠNG THÁI */}
          <div className={`status-pill ${isOnline ? 'online' : 'offline'}`} onClick={() => setIsOnline(!isOnline)} title="Bấm để chuyển trạng thái">
            <span className="dot"></span>
            {isOnline ? "Đang trực" : "Vắng mặt"}
          </div>

          {/* AVATAR */}
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
            <img src={doctor.photoURL || "https://via.placeholder.com/40"} alt="Avatar" className="avatar-img" />
            <i className="fas fa-caret-down"></i>
            {showDropdown && (
              <div className="custom-dropdown-menu">
                <div className="dropdown-header">
                  <strong>{doctor.displayName || "Bác sĩ"}</strong>
                  <small>Khoa Nội</small>
                </div>
                <hr />
                <div className="dropdown-item" onClick={() => navigate('/doctor/profile')}><i className="fas fa-user-cog"></i> Cài đặt tài khoản</div>
                <div className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Đăng xuất</div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* --- POPUP TOAST (Đặt ở đây để không bị lỗi layout) --- */}
      {/* Quan trọng: Phải kiểm tra toast tồn tại mới render để tránh lỗi null */}
      {toast && (
        <div className="toast-notification">
          <div className="toast-icon">
            {toast.type === 'message' && <i className="fas fa-comment-dots"></i>}
            {toast.type === 'order' && <i className="fas fa-shopping-cart"></i>}
            {toast.type === 'system' && <i className="fas fa-info-circle"></i>}
          </div>
          <div className="toast-content">
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className={`doctor-main ${isChatPage ? 'no-padding' : ''}`}>
        <Outlet />
      </main>

    </div>
  );
};

export default DoctorLayout;