import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Import các file mới
import DoctorLayout from './pages/Doctor/DoctorLayout';
import Profile from './pages/Doctor/Profile';
import Chat from './pages/Doctor/Chat';
import Products from './pages/Doctor/Products';
import Prescribe from './pages/Doctor/Prescribe';
import Orders from './pages/Doctor/Orders';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* ROUTE CHO BÁC SĨ (NESTED ROUTES) */}
        <Route path="/doctor" element={<DoctorLayout />}>
          {/* Mặc định vào /doctor sẽ chuyển hướng ngay sang /doctor/profile */}
          <Route index element={<Navigate to="profile" replace />} />
          
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="products" element={<Products />} />
          <Route path="prescribe" element={<Prescribe />} />
          <Route path="orders" element={<Orders />} />
        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

const Home = () => (
    <main style={{textAlign:'center', padding:'50px'}}>
        <h1>Trang Chủ</h1>
        <a href="/doctor" className="btn-save">Vào trang Bác Sĩ</a>
    </main>
);

export default App;