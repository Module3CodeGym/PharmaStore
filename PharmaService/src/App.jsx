import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./App.css";

// --- 1. Import Header & Footer ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import UserChatWidget from "./components/UserChatWidget";
import ScrollToTop from "./components/ScrollToTop";

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

// Profile & Bác sĩ
import Profile from "./pages/User/Profile/Profile";
import UploadPrescription from "./pages/User/UploadPrescription";
import MyHealth from "./pages/User/Profile/MyHealth";
import PrescriptionDetail from "./pages/User/PrescriptionDetail";
import ViewProfileDoctor from "./pages/User/Profile/ViewProfileDoctor";
import DoctorList from "./pages/User/DoctorList"; // BỔ SUNG: Import trang danh sách bác sĩ

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
import DoctorPrescriptionList from "./pages/Doctor/Prescriptions/DoctorPrescriptions";
import Appointment from "./pages/User/Appointment";
import DoctorCreateAppointment from "./pages/Doctor/DoctorCreateAppointment";

// Pharmacist
import PharmacistDashboard from "./pages/Pharmacist/PharmacistDashBoard";
import CreatePrescription from "./pages/Pharmacist/CreatePrescription";
import PharmacistInventory from "./pages/Pharmacist/PharmacistInventory";
import PharmacistOrders from "./pages/Pharmacist/PharmacistOrders";
import PharmacistPrescriptionHistory from './pages/Pharmacist/PharmacistPrescriptionHistory';

// ============================
// NHÓM 6: ADMIN (Merged from frontend)
// ============================
import AdminMainLayout from "./components/AdminLayout/AdminMainLayout";
import withAuthorization from "./hocs/withAuthorization";

// Admin Auth
import Unauthorized from "./pages/Admin/Auth/Unauthorized";

// Admin Pages
import Dashboard from "./pages/Admin/dashboard/Dashboard";
import AdminProductList from "./pages/Admin/products/ProductList/ProductList";
import AdminProductForm from "./pages/Admin/products/ProductForm/ProductForm";
import InventoryList from "./pages/Admin/inventory/InventoryList";
import AdminOrderList from "./pages/Admin/orders/OrderList";
import CustomerList from "./pages/Admin/customers/CustomerList";
import CustomerForm from "./pages/Admin/customers/CustomerForm";
import EmployeeList from "./pages/Admin/employees/EmployeeList";
import EmployeeForm from "./pages/Admin/employees/EmployeeForm";
import SystemLogs from "./pages/Admin/system-logs/ChangeHistory";

// HOC-wrapped Admin Components
const ProtectedDashboard = withAuthorization(Dashboard, ['Admin']);
const ProtectedAdminProductList = withAuthorization(AdminProductList, ['Admin', 'Staff']);
const ProtectedAdminProductForm = withAuthorization(AdminProductForm, ['Admin', 'Staff']);
const ProtectedInventoryList = withAuthorization(InventoryList, ['Admin', 'Staff']);
const ProtectedAdminOrderList = withAuthorization(AdminOrderList, ['Admin', 'Staff']);
const ProtectedCustomerList = withAuthorization(CustomerList, ['Admin', 'Staff']);
const ProtectedCustomerForm = withAuthorization(CustomerForm, ['Admin', 'Staff']);
const ProtectedEmployeeList = withAuthorization(EmployeeList, ['Admin']);
const ProtectedEmployeeForm = withAuthorization(EmployeeForm, ['Admin']);
const ProtectedSystemLogs = withAuthorization(SystemLogs, ['Admin']);

// --- Layout Chính cho khách vãng lai ---
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
      <ScrollToTop />
      <Routes>

        {/* --- NHÓM 1: AUTH --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pharmacist/register" element={<PharmacistRegister />} />

        {/* --- NHÓM 2: KHÁCH HÀNG (Dùng Header/Footer chung) --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="myhealth" element={<MyHealth />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="/user/prescription/:id" element={<PrescriptionDetail />} />

          {/* 👇 ĐÃ SỬA LẠI ĐÚNG TRANG TƯƠNG ỨNG TẠI ĐÂY 👇 */}
          <Route path="doctors" element={<DoctorList />} />
          <Route path="doctor-view/:id" element={<ViewProfileDoctor />} />
        </Route>

        {/* --- NHÓM 3: NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP --- */}
        <Route element={<UserLayout />}>
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="profile" element={<Profile />} />
          <Route path="upload-prescription" element={<UploadPrescription />} />
          <Route path="chat" element={<UserChat />} />
        </Route>

        {/* --- NHÓM 4: BÁC SĨ --- */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="chat" element={<DoctorChat />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="exams" element={<DoctorExamList />} />
          <Route path="exam/:appointmentId" element={<DoctorExam />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="patient/:patientId" element={<PatientDetail />} />
          <Route path="prescriptions" element={<DoctorPrescriptionList />} />

          {/* ⭐ ROUTE MỚI: Tạo lịch khám */}
          <Route path="create-appointment" element={<DoctorCreateAppointment />} />
        </Route>

        {/* --- NHÓM 5: DƯỢC SĨ (PHARMACIST) --- */}
        <Route path="/pharmacist">
          <Route path="dashboard" element={<PharmacistDashboard />} />
          <Route path="inventory" element={<PharmacistInventory />} />
          <Route path="orders" element={<PharmacistOrders />} />
          <Route path="prescription/:recordId" element={<CreatePrescription />} />
          <Route path="history" element={<PharmacistPrescriptionHistory />} />
        </Route>

        {/* --- NHÓM 6: ADMIN (Merged from frontend) --- */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/admin/unauthorized" element={<Unauthorized />} />
        <Route path="/admin" element={<AdminMainLayout />}>
          <Route index element={<ProtectedDashboard />} />
          <Route path="products" element={<ProtectedAdminProductList />} />
          <Route path="products/add" element={<ProtectedAdminProductForm />} />
          <Route path="products/edit/:id" element={<ProtectedAdminProductForm />} />
          <Route path="inventory" element={<ProtectedInventoryList />} />
          <Route path="orders" element={<ProtectedAdminOrderList />} />
          <Route path="customers" element={<ProtectedCustomerList />} />
          <Route path="customers/add" element={<ProtectedCustomerForm />} />
          <Route path="customers/edit/:id" element={<ProtectedCustomerForm />} />
          <Route path="employees" element={<ProtectedEmployeeList />} />
          <Route path="employees/add" element={<ProtectedEmployeeForm />} />
          <Route path="employees/edit/:id" element={<ProtectedEmployeeForm />} />
          <Route path="logs" element={<ProtectedSystemLogs />} />
        </Route>

      </Routes>
    </CartProvider>
  );
}

export default App;