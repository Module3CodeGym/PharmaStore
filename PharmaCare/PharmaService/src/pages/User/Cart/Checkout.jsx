import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { auth, db } from '../../../firebaseConfig';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD'); 

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const formatPrice = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // 1. Tự động điền thông tin từ Hồ sơ (Profile)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        alert("Vui lòng đăng nhập để thanh toán!");
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // Lấy data từ Firestore users
      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setShippingInfo(prev => ({
            ...prev,
            name: data.name || currentUser.displayName || '',
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

  // Redirect nếu giỏ hàng trống
  useEffect(() => {
    if (cartItems.length === 0) navigate('/products');
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // 2. Xử lý Đặt hàng
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
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
        status: 'pending', // Mặc định là Chờ xử lý
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "orders"), orderData);
      
      clearCart(); // Xóa giỏ hàng
      alert("Đặt hàng thành công!");
      navigate('/orders'); // Chuyển sang trang lịch sử

    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Có lỗi xảy ra, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2 className="text-center mb-4">Thanh toán đơn hàng</h2>
      <div className="row">
        {/* Cột trái: Nhập thông tin */}
        <div className="col-md-7">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white"><h5 className="mb-0">📍 Thông tin giao hàng</h5></div>
            <div className="card-body">
              <form onSubmit={handlePlaceOrder}>
                <div className="mb-3">
                  <label>Họ tên người nhận <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="name" value={shippingInfo.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Số điện thoại <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="phone" value={shippingInfo.phone} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Địa chỉ <span className="text-danger">*</span></label>
                  <textarea className="form-control" name="address" value={shippingInfo.address} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Ghi chú</label>
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
                <label className="form-check-label" htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="pay" id="bank" checked={paymentMethod === 'BANKING'} onChange={() => setPaymentMethod('BANKING')} />
                <label className="form-check-label" htmlFor="bank">Chuyển khoản ngân hàng</label>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Tổng kết đơn */}
        <div className="col-md-5">
          <div className="card shadow-sm">
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
                {loading ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;