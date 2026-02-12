import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

// --- 1. Import Header & Footer ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserChatWidget from "./components/UserChatWidget";

// Layouts
import UserLayout from "./pages/User/UserLayout";
import DoctorLayout from "./pages/Doctor/DoctorLayout"; 

// Home 
import Home from "./pages/Home";

// Auth
import Login from "./pages/User/Auth/LoginPage"; 
import Register from "./pages/User/Auth/Register";
import ForgotPassword from "./pages/User/Auth/ForgotPassword";
import PharmacistRegister from "./pages/User/Auth/PharmacistRegister";

// Products
import ProductList from "./pages/User/Products/ProductList";
import ProductDetail from "./pages/User/Products/ProductDetail";

// Cart
import Cart from "./pages/User/Cart/Cart";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/User/Cart/Checkout";

// Orders
import MyOrders from "./pages/User/Orders/MyOrders";
import OrderDetail from "./pages/User/Orders/OrderDetail";

// Profile
import Profile from "./pages/User/Profile/Profile";
import UploadPrescription from "./pages/User/UploadPrescription";
import MyHealth from "./pages/User/Profile/MyHealth";

// Chat User
import UserChat from "./pages/User/Chat/UserChat";

// Doctor Pages
import DoctorChat from "./pages/Doctor/Chat"; 
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/Profile";
import DoctorSchedule from "./pages/Doctor/DoctorSchedule";
import DoctorExam from "./pages/Doctor/Exam/DoctorExam";
import DoctorExamList from "./pages/Doctor/Exam/DoctorExamList";
import DoctorPatients from "./pages/Doctor/Patients/DoctorPatients";
import PatientDetail from "./pages/Doctor/Patients/PatientDetail";

// Appointment
import Appointment from "./pages/User/Appointment";

// Pharmacist
import PharmacistDashboard from "./pages/Pharmacist/PharmacistDashBoard";
import CreatePrescription from "./pages/Pharmacist/CreatePrescription";

// --- Layout Chính ---
const MainLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/pharmacist/register" element={<PharmacistRegister />} />

        {/* --- NHÓM 2: KHÁCH HÀNG --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="myhealth" element={<MyHealth />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* --- NHÓM 3: USER --- */}
        <Route element={<UserLayout />}>
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="upload-prescription" element={<UploadPrescription />} />
          <Route path="chat" element={<UserChat />} />
        </Route>

        {/* --- NHÓM 4: DOCTOR --- */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="chat" element={<DoctorChat />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="exams" element={<DoctorExamList />} />
          <Route path="exam/:appointmentId" element={<DoctorExam />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patient/:patientId" element={<PatientDetail />} />
        </Route>

        {/* --- NHÓM 5: PHARMACIST --- */}
        <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
        <Route
          path="/pharmacist/prescription/:recordId"
          element={<CreatePrescription />}
        />

      </Routes>
    </CartProvider>
  );
}

export default App;