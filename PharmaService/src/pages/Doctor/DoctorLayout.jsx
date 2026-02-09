import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../App.css'; 

const DoctorLayout = () => {
  return (
    <div className="doctor-layout">
      {/* SIDEBAR CỐ ĐỊNH */}
      <div className="doctor-sidebar">
        <div className="sidebar-header">
           <div style={{width: '60px', height: '60px', background: '#ccc', borderRadius: '50%', margin: '0 auto 10px', overflow:'hidden'}}>
              <img src="https://via.placeholder.com/60" alt="Avatar" />
          </div>
          <h3>BS. Thái Sơn</h3>
          <p style={{fontSize: '0.8rem', color: '#aaa'}}>Khoa Nội tổng quát</p>
        </div>
        
        <ul className="sidebar-menu">
          {/* Dùng NavLink để tự động thêm class 'active' khi đúng URL */}
          <li><NavLink to="/doctor/profile" className={({isActive}) => isActive ? "active-link" : ""}><i className="fas fa-user-circle"></i> Hồ sơ cá nhân</NavLink></li>
          <li><NavLink to="/doctor/chat" className={({isActive}) => isActive ? "active-link" : ""}><i className="fas fa-comments"></i> Tư vấn trực tuyến</NavLink></li>
          <li><NavLink to="/doctor/products" className={({isActive}) => isActive ? "active-link" : ""}><i className="fas fa-box-open"></i> Quản lý sản phẩm</NavLink></li>
          <li><NavLink to="/doctor/prescribe" className={({isActive}) => isActive ? "active-link" : ""}><i className="fas fa-file-prescription"></i> Tạo đơn thuốc</NavLink></li>
          <li><NavLink to="/doctor/orders" className={({isActive}) => isActive ? "active-link" : ""}><i className="fas fa-clipboard-list"></i> Quản lý đơn hàng</NavLink></li>
        </ul>

        <div className="sidebar-logout">
          <button onClick={() => window.location.href='/'}><i className="fas fa-sign-out-alt"></i> Đăng xuất</button>
        </div>
      </div>

      {/* NỘI DUNG THAY ĐỔI Ở ĐÂY */}
      <div className="doctor-content">
        <Outlet /> 
      </div>
    </div>
  );
};

export default DoctorLayout;