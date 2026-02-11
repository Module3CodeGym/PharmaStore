import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; 
import { auth, db } from '../../../firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import './Cart.css'; // Đảm bảo file CSS này đã tồn tại

const Cart = () => {
  // Lấy hàm updateQuantity từ Context
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
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
        items: cartItems, // Lưu danh sách thuốc kèm số lượng và giá tại thời điểm mua
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

  // Giao diện khi giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
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
      <h2 className="cart-title">Giỏ hàng của bạn ({cartItems.length} sản phẩm)</h2>

      <div className="cart-content">
        {/* --- DANH SÁCH SẢN PHẨM --- */}
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
                        onError={(e) => e.target.src="https://via.placeholder.com/60"} 
                      />
                      <div>
                        <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ verticalAlign: 'middle' }}>{formatPrice(item.price)}</td>
                  
                  {/* Cột Số Lượng có nút Tăng/Giảm */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <div className="qty-control d-flex align-items-center">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        style={{ width: '30px', height: '30px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1} // Vô hiệu hóa nút giảm nếu số lượng là 1
                      >
                        -
                      </button>
                      
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        style={{ width: '30px', height: '30px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="subtotal" style={{ verticalAlign: 'middle', fontWeight: 'bold', color: '#2c3e50' }}>
                    {formatPrice(item.price * item.quantity)}
                  </td>
                  
                  <td style={{ verticalAlign: 'middle' }}>
                    <button 
                      className="btn-remove btn btn-danger btn-sm" 
                      onClick={() => removeFromCart(item.id)}
                      title="Xóa khỏi giỏ"
                    >
                      <i className="fas fa-trash"></i> Xóa
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
            style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Đang xử lý..." : "Tiến hành đặt hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;