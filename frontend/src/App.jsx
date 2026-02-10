import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import Dashboard from './pages/admin/dashboard/Dashboard';
import ProductList from './pages/admin/products/ProductList/ProductList';
import ProductForm from './pages/admin/products/ProductForm/ProductForm';
import InventoryList from './pages/admin/inventory/InventoryList';
import CustomerList from './pages/admin/customers/CustomerList';
import CustomerForm from './pages/admin/customers/CustomerForm';
import EmployeeList from './pages/admin/employees/EmployeeList';
import EmployeeForm from './pages/admin/employees/EmployeeForm';
import ChangeHistory from './pages/admin/system-logs/ChangeHistory';
import OrderList from './pages/admin/orders/OrderList';

// User Pages
import UserHome from './pages/user/UserHome';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized
    if (user.role === 'User') return <Navigate to="/user-home" replace />;
    if (user.role === 'Staff') return <Navigate to="/inventory" replace />;
    return <Navigate to="/" replace />; // fallback
  }

  return children ? children : <Outlet />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Staff']} />}>
        <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />

        {/* Inventory: Admin & Staff */}
        <Route path="/inventory" element={<MainLayout><InventoryList /></MainLayout>} />

        {/* Orders: Admin & Staff */}
        <Route path="/orders" element={<MainLayout><OrderList /></MainLayout>} />

        {/* Products: Admin & Staff */}
        <Route path="/products" element={<MainLayout><ProductList /></MainLayout>} />
        <Route path="/products/add" element={<MainLayout><ProductForm /></MainLayout>} />
        <Route path="/products/edit/:id" element={<MainLayout><ProductForm /></MainLayout>} />

        {/* Customers: Admin & Staff */}
        <Route path="/customers" element={<MainLayout><CustomerList /></MainLayout>} />
        <Route path="/customers/add" element={<MainLayout><CustomerForm /></MainLayout>} />
        <Route path="/customers/edit/:id" element={<MainLayout><CustomerForm /></MainLayout>} />

        {/* Employees: Admin Only */}
        <Route path="/employees" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MainLayout><EmployeeList /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/employees/add" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MainLayout><EmployeeForm /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/employees/edit/:id" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MainLayout><EmployeeForm /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Logs: Admin Only */}
        <Route path="/logs" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MainLayout><ChangeHistory /></MainLayout>
          </ProtectedRoute>
        } />
      </Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRoles={['User']} />}>
        <Route path="/user-home" element={<UserHome />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="app-container">
          <ToastContainer position="top-right" autoClose={3000} />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
