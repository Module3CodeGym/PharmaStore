import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1. Kiểm tra đăng nhập và lấy userId
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchOrders(currentUser.uid);
      } else {
        setLoading(false);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Hàm lấy danh sách đơn hàng từ Firebase
  const fetchOrders = async (userId) => {
    try {
      // Lấy đơn hàng của user đó, sắp xếp mới nhất lên đầu
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Format tiền tệ
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper: Format ngày tháng từ Firebase Timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    // Nếu là Firestore Timestamp thì convert, nếu không thì dùng new Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  // Helper: Dịch trạng thái sang tiếng Việt
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return <span className="badge bg-warning text-dark">Chờ xử lý</span>;
      case 'confirmed': return <span className="badge bg-primary">Đã xác nhận</span>;
      case 'shipping': return <span className="badge bg-info text-dark">Đang giao</span>;
      case 'completed': return <span className="badge bg-success">Hoàn thành</span>;
      case 'cancelled': return <span className="badge bg-danger">Đã hủy</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải đơn hàng...</div>;

  if (!user) {
    return (
      <div className="text-center mt-5">
        <p>Vui lòng đăng nhập để xem đơn hàng.</p>
        <button className="btn btn-primary" onClick={() => navigate('/login')}>Đăng nhập ngay</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-5">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" alt="No Orders" style={{width: '100px'}} />
        <p className="mt-3">Bạn chưa có đơn hàng nào.</p>
        <button className="btn btn-outline-primary" onClick={() => navigate('/products')}>Mua sắm ngay</button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lịch sử đơn hàng của tôi</h2>
      
      <div className="d-flex flex-column gap-4">
        {orders.map((order) => (
          <div key={order.id} className="card shadow-sm border-0">
            {/* Header đơn hàng */}
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <div>
                <strong>Mã đơn: #{order.id.slice(0, 8)}...</strong>
                <span className="text-muted ms-2" style={{fontSize: '0.9rem'}}>
                  | {formatDate(order.createdAt)}
                </span>
              </div>
              <div>{getStatusLabel(order.status)}</div>
            </div>

            {/* Body: Danh sách sản phẩm */}
            <div className="card-body">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="d-flex align-items-center border-bottom py-3 last-no-border">
                  <img 
                    src={item.img || "https://via.placeholder.com/60"} 
                    alt={item.name} 
                    style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px', marginRight: '15px'}}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <small className="text-muted">Đơn giá: {formatPrice(item.price)}</small>
                  </div>
                  <div className="text-end">
                    <span className="d-block">x{item.quantity}</span>
                    <strong className="text-primary">{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer: Tổng tiền */}
            <div className="card-footer bg-light d-flex justify-content-end align-items-center py-3">
              <span className="me-2">Tổng tiền thanh toán:</span>
              <h5 className="mb-0 text-danger fw-bold">{formatPrice(order.totalAmount)}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;