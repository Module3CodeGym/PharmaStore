import { Routes, Route } from "react-router-dom";
import "./App.css";

// Layout
import UserLayout from "./pages/User/UserLayout";

// Auth
import Login from "./pages/User/Auth/Login";
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

function App() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* USER */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<ProductList />} />

        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />

        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />

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
