import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, writeBatch } from 'firebase/firestore';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("Khách hàng");
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotify, setShowNotify] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();

  // --- LOGIC TÌM KIẾM ---
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?s=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate(`/`);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSearchTerm(queryParams.get('s') || "");
  }, [location.search]);

  // --- LOGIC AUTH & NOTIFICATIONS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // 1. Lấy tên hiển thị từ Firestore (Để tránh lỗi 400 Bad Request từ Google Auth)
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDisplayName(data.displayName || data.name || currentUser.displayName || currentUser.email.split('@')[0]);
          } else {
            setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
          }
        } catch (error) {
          console.error("Lỗi lấy thông tin user (Có thể do Rules):", error);
          setDisplayName(currentUser.email.split('@')[0]);
        }

        // 2. LẮNG NGHE THÔNG BÁO THỜI GIAN THỰC
        // Sửa lỗi 'undefined' bằng cách lọc chuỗi ngay khi nhận dữ liệu
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeNotify = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => {
            const item = doc.data();
            return { 
              id: doc.id, 
              ...item,
              // Fix lỗi hiển thị 'Bác sĩ undefined'
              message: item.message ? item.message.replace('undefined', 'Bác sĩ') : "Thông báo mới"
            };
          });
          setNotifications(data);
        }, (error) => {
          // Xử lý lỗi 'Missing or insufficient permissions'
          console.error("Lỗi lắng nghe thông báo:", error);
        });

        return () => unsubscribeNotify();
      } else {
        setUser(null);
        setDisplayName("Khách hàng");
        setNotifications([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const unreadNotifyCount = notifications.filter(n => !n.isRead).length;

  const handleToggleNotify = async () => {
    setShowNotify(!showNotify);
    setShowDropdown(false);

    if (!showNotify && unreadNotifyCount > 0) {
      try {
        const batch = writeBatch(db);
        notifications.filter(n => !n.isRead).forEach((n) => {
          batch.update(doc(db, "notifications", n.id), { isRead: true });
        });
        await batch.commit();
      } catch (error) {
        console.error("Lỗi cập nhật trạng thái đã đọc:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setShowDropdown(false);
      navigate('/login');
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* LOGO */}
        <Link to="/" style={logoStyle}>
          <div style={{ fontSize: '2rem', color: '#00b894' }}><i className="fas fa-clinic-medical"></i></div>
          <span className="brand-name" style={brandNameStyle}>PharmaStore</span>
        </Link>

        {/* THANH TÌM KIẾM */}
        <div style={searchBoxStyle}>
          <input
            type="text"
            placeholder="Tìm thuốc, TPCN..."
            style={inputStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button style={searchBtnStyle} onClick={handleSearch}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* ACTION AREA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 }}>
          <Link to="/upload-prescription" style={uploadLinkStyle}>
            <i className="fas fa-file-upload"></i> <span className="hide-on-mobile">Gửi đơn</span>
          </Link>

          {/* CHUÔNG THÔNG BÁO */}
          {user && (
            <div style={{ position: 'relative' }}>
              <div onClick={handleToggleNotify} style={{ fontSize: '1.3rem', color: '#2d3436', cursor: 'pointer', padding: '5px' }}>
                <i className="fas fa-bell"></i>
                {unreadNotifyCount > 0 && <span style={badgeStyle}>{unreadNotifyCount}</span>}
              </div>

              {showNotify && (
                <div style={notifyDropdownStyle}>
                  <div style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '0.9rem' }}>Thông báo</div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>Không có thông báo nào</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{ ...notifyItemStyle, backgroundColor: n.isRead ? 'white' : '#f0faff' }}>
                          <div style={{ fontSize: '0.85rem', color: '#333' }}>{n.message}</div>
                          <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '5px' }}>
                            {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString('vi-VN') : "Vừa xong"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT */}
          {user ? (
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => { setShowDropdown(!showDropdown); setShowNotify(false); }}>
              <div style={userBoxStyle}>
                <img src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Avatar" style={avatarStyle} />
                <span className="hide-on-mobile" style={userNameStyle}>{displayName}</span>
                <i className="fas fa-caret-down" style={{ fontSize: '0.8rem', color: '#999' }}></i>
              </div>

              {showDropdown && (
                <div style={userDropdownStyle}>
                  <Link to="/profile" style={dropdownLinkStyle}><i className="fas fa-user-circle"></i> Hồ sơ</Link>
                  <Link to="/orders" style={dropdownLinkStyle}><i className="fas fa-box"></i> Đơn mua</Link>
                  <div style={{ borderTop: '1px solid #eee', margin: '5px 0' }}></div>
                  <div onClick={handleLogout} style={{ ...dropdownLinkStyle, color: '#d63031' }}><i className="fas fa-sign-out-alt"></i> Đăng xuất</div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={loginBtnStyle}>Đăng nhập</Link>
          )}

          {/* CART */}
          <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
            <div style={{ fontSize: '1.3rem', color: '#2d3436' }}><i className="fas fa-shopping-cart"></i></div>
            {totalItems > 0 && <span style={badgeStyle}>{totalItems}</span>}
          </Link>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .brand-name, .hide-on-mobile { display: none; } }`}</style>
    </header>
  );
};

// --- STYLES (Giữ nguyên các biến style của bạn) ---
const headerStyle = { backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000, height: '70px', display: 'flex', alignItems: 'center' };
const containerStyle = { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' };
const logoStyle = { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 };
const brandNameStyle = { fontSize: '1.3rem', fontWeight: 'bold', color: '#00b894' };
const searchBoxStyle = { flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: '30px', border: '1px solid #e1e1e1', height: '40px', overflow: 'hidden' };
const inputStyle = { flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '0 15px', fontSize: '0.9rem' };
const searchBtnStyle = { background: '#00b894', border: 'none', width: '50px', height: '100%', color: 'white', cursor: 'pointer' };
const badgeStyle = { position: 'absolute', top: '-5px', right: '-8px', background: '#ff4757', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: '10px', fontWeight: 'bold', border: '2px solid white' };
const uploadLinkStyle = { textDecoration: 'none', color: '#555', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500', fontSize: '0.85rem' };
const userBoxStyle = { display: 'flex', alignItems: 'center', gap: '8px', padding: '5px' };
const avatarStyle = { width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' };
const userNameStyle = { fontWeight: 'bold', fontSize: '0.85rem', color: '#333', maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const notifyDropdownStyle = { position: 'absolute', top: '45px', right: '-50px', width: '280px', background: 'white', boxShadow: '0 5px 25px rgba(0,0,0,0.15)', borderRadius: '12px', zIndex: 3000, border: '1px solid #eee' };
const notifyItemStyle = { padding: '12px 15px', borderBottom: '1px solid #f8f9fa', cursor: 'default' };
const userDropdownStyle = { position: 'absolute', top: '45px', right: 0, width: '160px', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px 0', border: '1px solid #eee', zIndex: 3000 };
const dropdownLinkStyle = { display: 'block', padding: '8px 15px', textDecoration: 'none', color: '#333', fontSize: '0.85rem' };
const loginBtnStyle = { textDecoration: 'none', fontWeight: '600', color: '#00b894', padding: '6px 12px', border: '1px solid #00b894', borderRadius: '20px', fontSize: '0.85rem' };

export default Header;