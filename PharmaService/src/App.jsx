import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các thành phần giao diện cố định
import Header from './components/Header';
import Footer from './components/Footer';

// Import các trang nội dung
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';

// Đảm bảo bạn đã có file CSS này để định dạng chung
import './App.css'; 

function App() {
  return (
    <Router>
      {/* Container chính giúp quản lý chiều cao trang web */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        backgroundColor: '#f4f7f6' 
      }}>
        
        <Header />

        {/* Phần nội dung chính (Main Content) */}
        {/* flex: 1 giúp đẩy Footer xuống đáy trang khi nội dung ngắn */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            
            {/* Bạn có thể thêm trang 404 nếu người dùng nhập sai URL */}
            <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}><h2>404 - Không tìm thấy trang</h2></div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;