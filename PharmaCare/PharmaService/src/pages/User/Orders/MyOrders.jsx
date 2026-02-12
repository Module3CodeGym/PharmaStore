import React, { useEffect, useState } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 1. Thêm State quản lý Tab
  const navigate = useNavigate();

  // 2. Danh sách các Tab
  const TABS = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'confirmed', label: 'Vận chuyển' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

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

  const fetchOrders = async (userId) => {
    try {
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

  // 3. Logic lọc đơn hàng theo Tab đang chọn
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'confirmed') return ['confirmed', 'shipping'].includes(order.status);
    return order.status === activeTab;
  });

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper lấy màu chữ trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12'; // Cam
      case 'confirmed': return '#3498db'; // Xanh dương
      case 'shipping': return '#16a085'; // Xanh ngọc
      case 'completed': return '#27ae60'; // Xanh lá
      case 'cancelled': return '#e74c3c'; // Đỏ
      default: return '#333';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'CHỜ XÁC NHẬN';
      case 'confirmed': return 'ĐANG CHUẨN BỊ';
      case 'shipping': return 'ĐANG GIAO HÀNG';
      case 'completed': return 'HOÀN THÀNH';
      case 'cancelled': return 'ĐÃ HỦY';
      default: return status;
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

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '900px' }}>
      <h3 className="mb-4">Đơn mua</h3>

      {/* 4. GIAO DIỆN THANH TAB (CSS Inline trực tiếp) */}
      <div className="bg-white shadow-sm mb-3 d-flex sticky-top" style={{ overflowX: 'auto', borderBottom: '1px solid #eee', zIndex: 10 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '15px 10px',
              border: 'none',
              background: 'transparent',
              whiteSpace: 'nowrap',
              color: activeTab === tab.id ? '#ee4d2d' : '#555', // Màu cam khi active
              borderBottom: activeTab === tab.id ? '2px solid #ee4d2d' : '2px solid transparent',
              fontWeight: activeTab === tab.id ? '500' : 'normal',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. HIỂN THỊ DANH SÁCH ĐÃ LỌC (filteredOrders) */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5 bg-white shadow-sm">
          <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/orderlist/5fafbb923393b712b964.png" alt="Empty" style={{width: '100px'}} />
          <p className="mt-3 text-muted">Chưa có đơn hàng nào ở mục này</p>
          <button className="btn btn-outline-primary" onClick={() => navigate('/products')}>Mua sắm ngay</button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white shadow-sm p-3 border rounded">
              
              {/* Header Card */}
              <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                <span className="fw-bold">PharmaStore</span>
                <span style={{ color: getStatusColor(order.status), fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                  {getStatusText(order.status)}
                </span>
              </div>

              {/* Body Card - Click vào xem chi tiết */}
              <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/orders/${order.id}`)}>
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="d-flex mb-3">
                    <img 
                      src={item.img || "https://via.placeholder.com/80"} 
                      alt={item.name} 
                      style={{width: '80px', height: '80px', objectFit: 'cover', border: '1px solid #eee', borderRadius: '4px'}} 
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <small className="text-muted">x{item.quantity}</small>
                      <div className="d-flex justify-content-between mt-1">
                        <span></span>
                        <span className="text-danger fw-bold">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Card */}
              <div className="border-top pt-3 text-end">
                <div className="mb-3">
                  <span className="text-muted me-2">Thành tiền:</span>
                  <span className="fs-5 fw-bold text-danger">{formatPrice(order.totalAmount)}</span>
                </div>
                
                <div className="d-flex justify-content-end gap-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/orders/${order.id}`)}>
                    Xem chi tiết
                  </button>
                  
                  {(order.status === 'completed' || order.status === 'cancelled') && (
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/products')}>
                      Mua lại
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;