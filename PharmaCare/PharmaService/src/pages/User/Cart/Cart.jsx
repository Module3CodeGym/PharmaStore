import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; 
import { auth, db } from '../../../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';

// 1. Import Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!user) {
      // 2. Sử dụng toast thay cho alert
      toast.warning("Vui lòng đăng nhập để thanh toán!", { position: "top-right" });
      setTimeout(() => navigate('/login'), 2000); // Chờ 2s cho khách xem toast rồi mới chuyển trang
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        items: cartItems,
        totalAmount: totalPrice,
        status: 'pending',
        createdAt: serverTimestamp(),
        paymentMethod: 'COD'
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();

      // 3. Thông báo thành công
      toast.success("Đặt hàng thành công! Bác sĩ sẽ sớm liên hệ xác nhận.", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => navigate('/orders'), 3000);

    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      // 4. Thông báo lỗi
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <ToastContainer /> {/* Vẫn cần để hiện toast nếu user nhấn nút khi chưa đăng nhập */}
        <img 
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" 
          alt="Empty" 
          style={{ width: '150px', marginBottom: '20px' }} 
        />
        <p>Giỏ hàng của bạn đang trống</p>
        <button onClick={() => navigate('/products')} className="btn-continue">
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      {/* 5. Cấu hình ToastContainer để hiển thị toast */}
      <ToastContainer pauseOnHover={false} theme="colored" />
      
      <h2 className="cart-title">Giỏ hàng của bạn ({cartItems.length} sản phẩm)</h2>

      <div className="cart-content">
        <div className="cart-list">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Sản phẩm</th>
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
                    <div className="d-flex align-items-center">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px', borderRadius: '8px' }}
                      />
                      <div>
                        <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>{formatPrice(item.price)}</td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <div className="qty-control d-flex align-items-center">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                      > - </button>
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, 1)}
                      > + </button>
                    </div>
                  </td>
                  <td className="subtotal" style={{ verticalAlign: 'middle', fontWeight: 'bold', color: '#2c3e50' }}>
                    {formatPrice(item.price * item.quantity)}
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <button 
                      className="btn-remove btn btn-danger btn-sm" 
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.info(`Đã xóa ${item.name}`);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <h3>Tổng cộng</h3>
          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span className="free-ship" style={{ color: '#27ae60', fontWeight: 'bold' }}>Miễn phí</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Thành tiền:</span>
            <span style={{ color: '#d35400', fontSize: '1.5rem' }}>{formatPrice(totalPrice)}</span>
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