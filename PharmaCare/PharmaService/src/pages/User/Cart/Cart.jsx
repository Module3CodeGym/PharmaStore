import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; 
import { auth } from '../../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import './Cart.css'; 

const Cart = () => {
  // Lấy các hàm xử lý từ Context
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [user, setUser] = useState(null);
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

  // --- HÀM MỚI: CHUYỂN HƯỚNG SANG TRANG THANH TOÁN ---
  const handleProceedToCheckout = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }
    // Chuyển sang trang Checkout để điền thông tin giao hàng
    navigate('/checkout');
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
                  
                  {/* Cột Số Lượng */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <div className="qty-control d-flex align-items-center">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        style={{ width: '30px', height: '30px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1} 
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

        {/* --- TỔNG TIỀN & NÚT ĐI TIẾP --- */}
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
            onClick={handleProceedToCheckout} 
            style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Tiến hành thanh toán &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;