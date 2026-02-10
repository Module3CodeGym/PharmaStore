import { FaTimes, FaUser, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content order-detail-modal">
                <div className="modal-header">
                    <h2>Chi tiết đơn hàng #{order.id}</h2>
                    <button className="close-btn" onClick={onClose}><FaTimes /></button>
                </div>

                <div className="modal-body">
                    <div className="order-info-section">
                        <div className="info-group">
                            <span className="info-icon"><FaUser /></span>
                            <div>
                                <label>Khách hàng</label>
                                <p>{order.customerName}</p>
                            </div>
                        </div>
                        <div className="info-group">
                            <span className="info-icon"><FaCalendarAlt /></span>
                            <div>
                                <label>Ngày đặt</label>
                                <p>{order.date}</p>
                            </div>
                        </div>
                        <div className="info-group">
                            <span className="info-icon"><FaInfoCircle /></span>
                            <div>
                                <label>Trạng thái</label>
                                <p>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="order-info-section secondary-info">
                        <div className="info-group">
                            <span className="info-icon"><label style={{ fontSize: '1.2rem' }}>📞</label></span>
                            <div>
                                <label>Số điện thoại</label>
                                <p>{order.phoneNumber || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="info-group">
                            <span className="info-icon"><label style={{ fontSize: '1.2rem' }}>📍</label></span>
                            <div>
                                <label>Địa chỉ nhận hàng</label>
                                <p>{order.shippingAddress || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="info-group">
                            <span className="info-icon"><label style={{ fontSize: '1.2rem' }}>💳</label></span>
                            <div>
                                <label>Thanh toán</label>
                                <p>{order.paymentMethod || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-items-section">
                        <h3>Danh sách sản phẩm</h3>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.itemsList?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="total-label">Tổng cộng:</td>
                                    <td className="total-value">${order.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
