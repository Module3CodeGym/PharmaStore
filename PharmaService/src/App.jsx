import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

// --- 1. Import Header & Footer CHUẨN (từ thư mục components) ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserChatWidget from "./components/UserChatWidget";
// import DoctorChat from "./pages/Doctor/DoctorChat";
// Layout riêng của User (Dashboard, Sidebar...)
import UserLayout from "./pages/User/UserLayout";

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

// Orders
import MyOrders from "./pages/User/Orders/MyOrders";
import OrderDetail from "./pages/User/Orders/OrderDetail";

// Profile
import Profile from "./pages/User/Profile/Profile";
import UploadPrescription from "./pages/User/UploadPrescription";

// Chat
import UserChat from "./pages/User/Chat/UserChat";

// --- 2. Tạo nhanh một Layout Chính (MainLayout) ---
// Layout này dùng Header/Footer chuẩn của bạn
const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Outlet /> {/* Nơi hiển thị nội dung trang con (Home, Products...) */}
      </div>
      <Footer />
        <UserChatWidget />

    </div>
  );
};

function App() {
  return (
    <Routes>

      {/* --- NHÓM 1: AUTH (Không có Header/Footer) --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* --- NHÓM 2: TRANG KHÁCH HÀNG (Dùng Header/Footer CHUẨN) --- */}
      <Route path="/" element={<MainLayout />}>
        {/* Trang chủ mặc định */}
        <Route index element={<Home />} />
        
        {/* Các trang mua sắm nên dùng chung Header với trang chủ */}
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      {/* --- NHÓM 3: TRANG CÁ NHÂN (Dùng UserLayout riêng) --- */}
      {/* Thường UserLayout sẽ có Sidebar bên trái */}
      <Route path="/" element={<UserLayout />}>
        <Route path="orders" element={<MyOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="upload-prescription" element={<UploadPrescription />} />
        <Route path="chat" element={<UserChat />} />
      </Route>
      
    </Routes>
  );
}

export default App;