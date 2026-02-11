import React from 'react';
import '../App.css'; 

const Header = () => {
  return (
    <header className="header-container">        
        <div className="main-header">
            <div className="logo">
                <i className="fas fa-clinic-medical"></i> PharmaStore
            </div>
            
            <div className="search-box">
                <input type="text" placeholder="Tìm kiếm thuốc..." />
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        height="1em" 
        viewBox="0 0 512 512" 
        style={{ fill: 'white' }} /* Icon màu trắng */
    >
        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
    </svg>
</button>
            </div>

            <div className="user-actions">
                <a href="/upload"><i className="fas fa-file-upload"></i> Gửi đơn</a>
                <a href="/login"><i className="fas fa-user"></i> Đăng nhập</a>
                <a href="/cart"><i className="fas fa-shopping-cart"></i> Giỏ hàng</a>
            </div>
        </div>
    </header>
  );
};

export default Header;