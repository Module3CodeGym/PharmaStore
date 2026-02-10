import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; // 1. Dùng Context thay vì utils
import { auth, db } from '../../../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import './Cart.css'; // File CSS cho đẹp

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Kiểm tra đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Hàm format tiền tệ (VND)
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Xử lý Thanh toán
  const handleCheckout = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      // 1. Tạo đơn hàng lưu lên Firestore
      const orderData = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        items: cartItems, // Lưu danh sách thuốc
        totalAmount: totalPrice,
        status: 'pending', // Trạng thái: Chờ xử lý
        createdAt: serverTimestamp(), // Lấy giờ server
        paymentMethod: 'COD' // Mặc định tiền mặt
      };

      await addDoc(collection(db, "orders"), orderData);

      // 2. Xóa sạch giỏ hàng sau khi mua
      clearCart();

      // 3. Thông báo và chuyển hướng
      alert("Đặt hàng thành công! Bác sĩ sẽ sớm liên hệ xác nhận.");
      navigate('/orders'); // Chuyển sang trang Lịch sử đơn hàng

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty" />
        <p>Giỏ hàng của bạn đang trống</p>
        <button onClick={() => navigate('/products')} className="btn-continue">
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Giỏ hàng của bạn ({cartItems.length} sản phẩm)</h2>

      <div className="cart-content">
        {/* --- DANH SÁCH SẢN PHẨM --- */}
        <div className="cart-list">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="product-col">
                    <img src={item.img} alt={item.name} onError={(e) => e.target.src="https://via.placeholder.com/50"} />
                    <div>
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <span className="qty-badge">x{item.quantity}</span>
                  </td>
                  <td className="subtotal">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                  <td>
                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- TỔNG TIỀN & THANH TOÁN --- */}
        <div className="cart-summary">
          <h3>Tổng cộng</h3>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span className="free-ship">Miễn phí</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Thành tiền:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button 
            className="btn-checkout" 
            onClick={handleCheckout} 
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Tiến hành đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;