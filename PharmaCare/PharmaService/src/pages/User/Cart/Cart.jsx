import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; 
import { auth } from '../../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import './Cart.css'; 

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Format tiền tệ an toàn
  const formatPrice = (amount) => {
    const validAmount = Number(amount) || 0; // Bảo vệ khỏi NaN
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(validAmount);
  };

  // Tính tổng tiền an toàn
  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return total + (price * qty);
  }, 0);

  const handleProceedToCheckout = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

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
              {cartItems.map((item) => {
                // Tính toán thành tiền riêng cho từng dòng để tránh NaN hiển thị
                const itemPrice = Number(item.price) || 0;
                const itemQty = Number(item.quantity) || 0;
                const subtotal = itemPrice * itemQty;

                return (
                  <tr key={item.id}>
                    <td className="product-col">
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.img || item.image} // Hỗ trợ cả 2 tên trường ảnh
                          alt={item.name} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px', borderRadius: '8px' }}
                          onError={(e) => e.target.src="https://via.placeholder.com/60"} 
                        />
                        <div>
                          <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ verticalAlign: 'middle' }}>{formatPrice(itemPrice)}</td>
                    
                    <td style={{ verticalAlign: 'middle' }}>
                      <div className="qty-control d-flex align-items-center">
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          style={{ width: '30px', height: '30px', padding: '0' }}
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={itemQty <= 1} 
                        >
                          -
                        </button>
                        
                        <span className="mx-3 fw-bold">{itemQty}</span>
                        
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          style={{ width: '30px', height: '30px', padding: '0' }}
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="subtotal" style={{ verticalAlign: 'middle', fontWeight: 'bold', color: '#2c3e50' }}>
                      {formatPrice(subtotal)}
                    </td>
                    
                    <td style={{ verticalAlign: 'middle' }}>
                      <button 
                        className="btn-remove btn btn-danger btn-sm" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="fas fa-trash"></i> Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
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