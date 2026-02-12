import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Bắt buộc phải import cái này
import Navbar from '../components/Navbar'; // Giả sử bạn có Navbar
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar /> 

      {/* 2. CỰC KỲ QUAN TRỌNG: Thẻ này là nơi ProductList hoặc ProductDetail sẽ hiện ra */}
      <main>
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;