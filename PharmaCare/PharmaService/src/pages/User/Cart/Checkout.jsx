import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { auth, db } from '../../../firebaseConfig';
import { collection, addDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD'); 

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const formatPrice = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        toast.error("Vui lòng đăng nhập để thanh toán!");
        navigate('/login');
        return;
      }
      setUser(currentUser);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setShippingInfo(prev => ({
            ...prev,
            name: data.displayName || currentUser.displayName || '',
            phone: data.phone || '',
            address: data.address || ''
          }));
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin:", error);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (cartItems.length === 0) navigate('/products');
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // --- HÀM CẬP NHẬT TRẠNG THÁI TIẾNG VIỆT ---
  const finalizeOrder = async (id) => {
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, { 
        status: 'Chờ xác nhận', // Đồng bộ với hình image_4dff3b.png
        paymentVerified: true,
        updatedAt: serverTimestamp() 
      });

      await addDoc(collection(db, "notifications"), {
        userId: user.uid,
        type: "payment_success",
        message: `Thanh toán cho đơn hàng ${id.slice(-6)} đã được gửi. Dược sĩ sẽ kiểm tra và giao hàng sớm nhất!`,
        isRead: false,
        createdAt: serverTimestamp()
      });
      
      clearCart();
      setShowQR(false);
      toast.success("🎉 Ghi nhận chuyển khoản thành công! Đang chuyển hướng...");

      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error("Lỗi hoàn tất đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi xác nhận thanh toán.");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast.warning("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        userName: shippingInfo.name,
        userPhone: shippingInfo.phone,
        userAddress: shippingInfo.address,
        userEmail: user.email,
        note: shippingInfo.note,
        items: cartItems,
        totalAmount: totalPrice,
        paymentMethod: paymentMethod,
        // Chuyển đổi trạng thái khởi tạo sang Tiếng Việt
        status: paymentMethod === 'BANKING' ? 'Chờ thanh toán' : 'Chờ xác nhận',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(docRef.id);

      if (paymentMethod === 'BANKING') {
        setShowQR(true);
        setLoading(false);
      } else {
        await finalizeOrder(docRef.id);
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5" style={{ position: 'relative' }}>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
      
      <h2 className="text-center mb-4">Thanh toán đơn hàng</h2>
      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white"><h5 className="mb-0">📍 Thông tin giao hàng</h5></div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="fw-bold">Họ tên người nhận <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="name" value={shippingInfo.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="fw-bold">Số điện thoại <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="phone" value={shippingInfo.phone} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="fw-bold">Địa chỉ <span className="text-danger">*</span></label>
                  <textarea className="form-control" name="address" value={shippingInfo.address} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="fw-bold">Ghi chú</label>
                  <textarea className="form-control" name="note" value={shippingInfo.note} onChange={handleChange} placeholder="Giao giờ hành chính..." />
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white"><h5 className="mb-0">💳 Phương thức thanh toán</h5></div>
            <div className="card-body">
              <div className="form-check mb-2">
                <input className="form-check-input" type="radio" name="pay" id="cod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                <label className="form-check-label pointer" htmlFor="cod" style={{ cursor: 'pointer' }}>Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="pay" id="bank" checked={paymentMethod === 'BANKING'} onChange={() => setPaymentMethod('BANKING')} />
                <label className="form-check-label pointer" htmlFor="bank" style={{ cursor: 'pointer' }}>Chuyển khoản ngân hàng (VietQR)</label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm sticky-top" style={{ top: '90px' }}>
            <div className="card-header bg-primary text-white"><h5 className="mb-0">📦 Đơn hàng của bạn</h5></div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {cartItems.map(item => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between fw-bold bg-light">
                  <span>Tổng cộng</span>
                  <span className="text-danger fs-5">{formatPrice(totalPrice)}</span>
                </li>
              </ul>
            </div>
            <div className="card-footer bg-white p-3">
              <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handlePlaceOrder} disabled={loading}>
                {loading ? "Đang xử lý..." : paymentMethod === 'BANKING' ? "TIẾP TỤC THANH TOÁN" : "ĐẶT HÀNG NGAY"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showQR && (
        <div style={modalOverlayStyle}>
          <div className="card p-3 text-center shadow-lg" style={modalContentStyle}>
            <h5 className="mb-2 fw-bold" style={{ color: '#2d3436' }}>Quét mã thanh toán</h5>
            <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>Mở App Ngân hàng để quét mã VietQR</p>
            
            <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '15px', border: '1px solid #f1f2f6', marginBottom: '15px' }}>
              <img 
                src={`https://img.vietqr.io/image/MB-123456789-compact2.png?amount=${totalPrice}&addInfo=PHARMA%20${orderId.slice(-6)}&accountName=PHARMA%20STORE`} 
                alt="VietQR"
                className="img-fluid"
                style={{ maxHeight: '250px', objectFit: 'contain' }}
              />
            </div>

            <div className="text-start bg-light p-3 rounded mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              <div className="d-flex justify-content-between"><span>Ngân hàng:</span> <strong style={{ color: '#0984e3' }}>MB Bank</strong></div>
              <div className="d-flex justify-content-between"><span>Số tài khoản:</span> <strong>123456789</strong></div>
              <div className="d-flex justify-content-between"><span>Số tiền:</span> <strong className="text-danger">{formatPrice(totalPrice)}</strong></div>
              <div className="d-flex justify-content-between"><span>Nội dung:</span> <strong>PHARMA {orderId.slice(-6)}</strong></div>
            </div>

            <button className="btn btn-success w-100 py-2 fw-bold mb-2 shadow-sm" onClick={() => finalizeOrder(orderId)}>
              TÔI ĐÃ CHUYỂN KHOẢN XONG
            </button>
            <button className="btn btn-link btn-sm text-decoration-none text-muted" onClick={() => setShowQR(false)}>
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 2500, padding: '15px', backdropFilter: 'blur(3px)'
};

const modalContentStyle = {
  width: '100%', maxWidth: '380px', borderRadius: '24px', border: 'none',
  animation: 'fadeIn 0.3s ease-in-out'
};

export default Checkout;