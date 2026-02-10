import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext'; // 1. Import useCart

const Header = () => { 
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("Khách hàng");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 2. Lấy số lượng sản phẩm từ Context
  const { totalItems } = useCart(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().displayName) {
            setDisplayName(docSnap.data().displayName);
          } else if (currentUser.displayName) {
            setDisplayName(currentUser.displayName);
          } else if (currentUser.email) {
            setDisplayName(currentUser.email.split('@')[0]);
          }
        } catch (error) {
          console.error("Lỗi lấy tên:", error);
          setDisplayName(currentUser.displayName || currentUser.email.split('@')[0]);
        }
      } else {
        setUser(null);
        setDisplayName("Khách hàng");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <header style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      height: '70px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        
        {/* LOGO */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div style={{ fontSize: '2rem', color: '#00b894' }}>
             <i className="fas fa-clinic-medical"></i>
          </div>
          <span className="brand-name" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00b894' }}>PharmaStore</span>
        </Link>

        {/* THANH TÌM KIẾM */}
        <div style={{ 
          flex: 1, 
          maxWidth: '500px', 
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f1f2f6', 
          borderRadius: '30px',      
          border: '1px solid #e1e1e1',
          height: '45px',
          overflow: 'hidden'         
        }}>
          <input 
            type="text" 
            placeholder="Tìm thuốc, TPCN..." 
            style={{ 
              flex: 1, 
              border: 'none', 
              outline: 'none', 
              background: 'transparent',
              padding: '0 20px',
              fontSize: '0.95rem',
              color: '#333',
              height: '100%'
            }} 
          />
          <button style={{ 
            background: '#00b894', 
            border: 'none', 
            width: '60px',
            height: '100%',
            color: 'white', 
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* KHU VỰC TÀI KHOẢN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          
          <Link to="/upload-prescription" style={{ textDecoration: 'none', color: '#555', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500', fontSize: '0.9rem' }}>
            <i className="fas fa-file-upload"></i> <span className="hide-on-mobile">Gửi đơn</span>
          </Link>

          {user ? (
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 10px', borderRadius: '20px', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f8f9fa'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <img 
                   src={user.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                   alt="Avatar" 
                   style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }}
                   onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {displayName}
                  </span>
                </div>
                <i className="fas fa-caret-down" style={{ fontSize: '0.8rem', color: '#999' }}></i>
              </div>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '45px',
                  right: 0,
                  width: '180px',
                  background: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  padding: '10px 0',
                  border: '1px solid #eee',
                  zIndex: 2000
                }}>
                  <Link to="/profile" style={{ display: 'block', padding: '10px 20px', textDecoration: 'none', color: '#333', fontSize: '0.9rem' }}>
                    <i className="fas fa-user-circle" style={{ width: '20px' }}></i> Hồ sơ của tôi
                  </Link>
                  <Link to="/orders" style={{ display: 'block', padding: '10px 20px', textDecoration: 'none', color: '#333', fontSize: '0.9rem' }}>
                    <i className="fas fa-box" style={{ width: '20px' }}></i> Đơn mua
                  </Link>
                  <div style={{ borderTop: '1px solid #eee', margin: '5px 0' }}></div>
                  <div 
                    onClick={handleLogout}
                    style={{ padding: '10px 20px', color: '#d63031', cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    <i className="fas fa-sign-out-alt" style={{ width: '20px' }}></i> Đăng xuất
                  </div>
                </div>
              )}
            </div>
          ) : (
             <div style={{ display: 'flex', gap: '10px' }}>
               <Link to="/login" style={{ textDecoration: 'none', fontWeight: '600', color: '#00b894', padding: '8px 15px', border: '1px solid #00b894', borderRadius: '20px' }}>
                 Đăng nhập
               </Link>
               <Link to="/register" style={{ textDecoration: 'none', fontWeight: '600', color: 'white', background: '#00b894', padding: '8px 15px', borderRadius: '20px' }}>
                 Đăng ký
               </Link>
             </div>
          )}

          {/* 3. Giỏ hàng hiển thị số lượng thật */}
          <Link to="/cart" style={{ textDecoration: 'none', color: '#333', position: 'relative', marginLeft: '5px' }}>
             <div style={{ fontSize: '1.4rem', color: '#2d3436' }}><i className="fas fa-shopping-cart"></i></div>
             
             {/* Chỉ hiện nếu totalItems > 0 */}
             {totalItems > 0 && (
               <span style={{ 
                 position: 'absolute', 
                 top: '-8px', 
                 right: '-8px', 
                 background: '#ff4757', 
                 color: 'white', 
                 fontSize: '0.7rem', 
                 padding: '2px 6px', 
                 borderRadius: '10px',
                 fontWeight: 'bold',
                 border: '2px solid white'
               }}>
                 {totalItems}
               </span>
             )}
          </Link>

        </div>
      </div>

      <style>
        {`
          @media (max-width: 768px) {
            .brand-name { display: none; }
            .hide-on-mobile { display: none; }
          }
        `}
      </style>
    </header>
  );
};

export default Header;