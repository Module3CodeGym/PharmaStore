import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

// --- 1. Import Header & Footer CHUẨN ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserChatWidget from "./components/UserChatWidget";

// Layouts
import UserLayout from "./pages/User/UserLayout";
import DoctorLayout from "./pages/Doctor/DoctorLayout"; // <--- Layout có Sidebar

// Home 
import Home from "./pages/Home";

// Auth
import Login from "./pages/User/Auth/LoginPage"; 
import Register from "./pages/User/Auth/Register";
import ForgotPassword from "./pages/User/Auth/ForgotPassword";

// Products
import ProductList from "./pages/User/Products/ProductList";
import ProductDetail from "./pages/User/Products/ProductDetail";

// Cart
import Cart from "./pages/User/Cart/Cart";
import Checkout from "./pages/User/Cart/Checkout";
import { CartProvider } from './context/CartContext';

// Orders
import MyOrders from "./pages/User/Orders/MyOrders";
import OrderDetail from "./pages/User/Orders/OrderDetail";

// Profile
import Profile from "./pages/User/Profile/Profile";
import UploadPrescription from "./pages/User/UploadPrescription";

// Chat User
import UserChat from "./pages/User/Chat/UserChat";

// Doctor Pages
import DoctorChat from "./pages/Doctor/Chat"; 
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/Profile";
// --- 2. Layout Chính (Cho khách mua hàng) ---
const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
      <UserChatWidget />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
    <Routes>

      {/* --- NHÓM 1: AUTH --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* --- NHÓM 2: KHÁCH HÀNG (MainLayout) --- */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* --- NHÓM 3: NGƯỜI DÙNG CÁ NHÂN (UserLayout) --- */}
      <Route element={<UserLayout />}>
        <Route path="orders" element={<MyOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="upload-prescription" element={<UploadPrescription />} />
        <Route path="chat" element={<UserChat />} />
      </Route>

      {/* --- NHÓM 4: BÁC SĨ (DoctorLayout) --- */}
      {/* QUAN TRỌNG: DoctorLayout (chứa Sidebar) phải nằm ở Route cha */}
      <Route path="/doctor" element={<DoctorLayout />}>
        
        {/* 1. Khi vào /doctor -> Hiện Dashboard (Thống kê) */}
        <Route index element={<DoctorDashboard />} />
        
        {/* 2. Khi vào /doctor/chat -> Hiện trang Chat */}
        <Route path="chat" element={<DoctorChat />} />
        <Route path= "Profile" element={<DoctorProfile/>}/>
        {/* Các route mở rộng sau này */}
        {/* <Route path="products" element={<ProductManagement />} /> */}
        {/* <Route path="orders" element={<OrderManagement />} /> */}
      
      </Route>

    </Routes>
    </CartProvider>
  );
}

export default App;