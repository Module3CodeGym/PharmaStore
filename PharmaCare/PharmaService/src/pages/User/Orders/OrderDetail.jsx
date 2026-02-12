import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

const OrderDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy chi tiết đơn hàng từ Firebase
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Không tìm thấy đơn hàng này!");
          navigate('/orders');
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  // Helper: Format tiền tệ
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper: Format ngày tháng
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  // Helper: Hiển thị trạng thái
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

  if (loading) return <div className="text-center mt-5">Đang tải thông tin...</div>;
  if (!order) return null;

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/orders')}>
        &larr; Quay lại danh sách
      </button>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Chi tiết đơn hàng #{order.id.slice(0, 8)}...</h5>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        
        <div className="card-body">
          {/* Thông tin chung */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="fw-bold">Thông tin người nhận:</h6>
              <p className="mb-1">Tên: {order.userName}</p>
              <p className="mb-1">Email: {order.userEmail}</p>
              <p className="mb-1">Phương thức thanh toán: <strong>{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}</strong></p>
              <p className="btn btn-primary"
                  onClick={() => {
                    window.location.href =
                      "https://buy.stripe.com/test_00w00iabI1Xda7takSdnW00";
                  }}
                >
                  Thanh toán bằng thẻ
                </p>

            </div>
            <div className="col-md-6 text-md-end">
              <h6 className="fw-bold">Trạng thái đơn hàng:</h6>
              <div style={{fontSize: '1.2rem'}}>{getStatusLabel(order.status)}</div>
            </div>
          </div>

          <hr />

          {/* Danh sách sản phẩm */}
          <h6 className="fw-bold mb-3">Sản phẩm đã đặt:</h6>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Sản phẩm</th>
                  <th className="text-center">Đơn giá</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-end">Tạm tính</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={item.img || "https://via.placeholder.com/40"} 
                          alt={item.name} 
                          style={{width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px'}}
                        />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="text-center">{formatPrice(item.price)}</td>
                    <td className="text-center">x{item.quantity}</td>
                    <td className="text-end fw-bold">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">Phí vận chuyển:</td>
                  <td className="text-end text-success">Miễn phí</td>
                </tr>
                <tr className="table-active">
                  <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                  <td className="text-end fw-bold text-danger fs-5">{formatPrice(order.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;