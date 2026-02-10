import { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes, FaFileInvoiceDollar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../services/mockData';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency } from '../../../utils/format';
import OrderDetailModal from './OrderDetailModal';
import './OrderList.css';

const OrderList = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await mockApi.getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error loading orders:", error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await mockApi.updateOrderStatus(id, newStatus, user?.name);
            loadOrders();
            toast.success(`Order #${id} status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.message || 'Failed to update order status');
        }
    };

    if (loading) return <div className="orders-container">Loading orders...</div>;

    return (
        <div className="orders-container">
            <div className="page-header">
                <h2>Quản lý đơn hàng</h2>
                <div className="header-actions">
                    <button className="btn btn-outline">
                        <FaFileInvoiceDollar /> Xuất báo cáo
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.customerName}</td>
                                <td>{order.date}</td>
                                <td>{order.items} sản phẩm</td>
                                <td>{formatCurrency(order.total)}</td>
                                <td>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-icon view"
                                            title="Xem chi tiết"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            <FaEye />
                                        </button>

                                        {order.status !== 'Done' && order.status !== 'Cancelled' ? (
                                            <select
                                                className="status-select"
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            >
                                                <option value="Pending" disabled={order.status !== 'Pending'}>Pending</option>
                                                <option value="Processing" disabled={['Processing', 'Shipping', 'Done'].includes(order.status) && order.status !== 'Pending'}>Processing</option>
                                                <option value="Shipping" disabled={['Shipping', 'Done'].includes(order.status) && !['Pending', 'Processing'].includes(order.status)}>Shipping</option>
                                                <option value="Done">Done</option>
                                                <option value="Cancelled">Hủy đơn</option>
                                            </select>
                                        ) : (
                                            <span className="status-fixed">N/A</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>Chưa có đơn hàng nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default OrderList;
