import React from 'react';
import '../App.css'; // Import CSS chung

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Cột 1: Giới thiệu */}
        <div className="footer-col">
          <h3><i className="fas fa-clinic-medical"></i> PharmaStore</h3>
          <p>
            Hệ thống nhà thuốc đạt chuẩn GPP. Chuyên cung cấp thuốc kê đơn, 
            thực phẩm chức năng và dược mỹ phẩm chính hãng.
          </p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        {/* Cột 2: Danh mục */}
        <div className="footer-col">
          <h3>Danh mục chính</h3>
          <ul>
            <li><a href="#">Thuốc kê đơn</a></li>
            <li><a href="#">Thực phẩm chức năng</a></li>
            <li><a href="#">Dụng cụ y tế</a></li>
            <li><a href="#">Chăm sóc cá nhân</a></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div className="footer-col">
          <h3>Hỗ trợ khách hàng</h3>
          <ul>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
            <li><a href="#">Bảo mật thông tin</a></li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div className="footer-col">
          <h3>Liên hệ</h3>
          <p><i className="fas fa-map-marker-alt"></i> 123 Đường Dược Phẩm, Hà Nội</p>
          <p><i className="fas fa-phone"></i> 1900 1234</p>
          <p><i className="fas fa-envelope"></i> hotro@pharmastore.vn</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2024 PharmaStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;