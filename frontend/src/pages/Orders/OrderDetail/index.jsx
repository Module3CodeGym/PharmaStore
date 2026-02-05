import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../../services/api';
import Button from '../../../components/common/Button/index';
import Modal from '../../../components/common/Modal/index';
import { useReactToPrint } from 'react-to-print';
import Invoice from '../Invoice';
import './OrderDetail.css';
import { toast } from 'react-toastify';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, status: null });
    const invoiceRef = useRef();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await ordersApi.getById(id);
                if (response.success) {
                    setOrder(response.data);
                } else {
                    toast.error('Không tìm thấy đơn hàng');
                    navigate('/orders');
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                toast.error('Lỗi khi tải thông tin đơn hàng');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, navigate]);

    const handleStatusUpdateClick = (newStatus) => {
        setConfirmModal({
            isOpen: true,
            status: newStatus
        });
    };

    const confirmStatusChange = async () => {
        const newStatus = confirmModal.status;
        setConfirmModal({ ...confirmModal, isOpen: false }); // Close modal immediately

        try {
            const response = await ordersApi.updateStatus(id, newStatus);
            if (response.success) {
                setOrder(response.data);
                toast.success(`Đã cập nhật trạng thái: ${newStatus}`);

                // Log the action
                import('../../../services/api').then(({ systemLogsApi }) => {
                    systemLogsApi.logAction({
                        user: 'Admin', // Mock user
                        action: `Cập nhật đơn hàng #${id}`,
                        module: 'Orders',
                        details: `Trạng thái: ${order.status} -> ${newStatus}`
                    });
                });
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Lỗi kết nối');
        }
    };

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
        documentTitle: `Invoice-${order?.id || 'invoice'}`
    });

    if (loading || !order) return <div className="p-6 text-center">Đang tải...</div>;

    const statusFlow = ['Pending', 'Confirmed', 'Preparing', 'Delivering', 'Completed'];
    const currentStatusIndex = statusFlow.indexOf(order.status);
    const nextStatus = statusFlow[currentStatusIndex + 1];

    const statusLabels = {
        'Pending': 'Chờ xác nhận',
        'Confirmed': 'Đã xác nhận',
        'Preparing': 'Đang chuẩn bị',
        'Delivering': 'Đang giao',
        'Completed': 'Hoàn thành',
        'Cancelled': 'Đã hủy'
    };

    return (
        <div className="page-container">
            <div className="page-header flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" icon="⬅️" onClick={() => navigate('/orders')}>
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="page-title">Đơn hàng #{order.id}</h1>
                        <p className="page-description">
                            Tạo ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {nextStatus && order.status !== 'Cancelled' && (
                        <Button
                            variant="primary"
                            onClick={() => handleStatusUpdateClick(nextStatus)}
                        >
                            Chuyển sang: {statusLabels[nextStatus]}
                        </Button>
                    )}
                    {order.status === 'Pending' && (
                        <Button
                            variant="danger"
                            onClick={() => handleStatusUpdateClick('Cancelled')}
                        >
                            Hủy đơn
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        icon="🖨️"
                        onClick={handlePrint}
                    >
                        In hóa đơn
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content: Product List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h3 className="font-bold text-lg mb-4 text-primary">Danh sách sản phẩm</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-gray-500 border-b border-gray-100">
                                    <tr>
                                        <th className="pb-2 font-medium">Sản phẩm</th>
                                        <th className="pb-2 font-medium text-center">SL</th>
                                        <th className="pb-2 font-medium text-right">Đơn giá</th>
                                        <th className="pb-2 font-medium text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-3 font-medium">{item.productName}</td>
                                            <td className="py-3 text-center">{item.quantity}</td>
                                            <td className="py-3 text-right">
                                                {new Intl.NumberFormat('vi-VN').format(item.price)}
                                            </td>
                                            <td className="py-3 text-right">
                                                {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t border-gray-100 bg-gray-50">
                                    <tr>
                                        <td colSpan="3" className="py-3 text-right font-medium">Tạm tính</td>
                                        <td className="py-3 text-right">{new Intl.NumberFormat('vi-VN').format(order.subtotal)} ₫</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="py-3 text-right font-medium">Phí ship</td>
                                        <td className="py-3 text-right">{new Intl.NumberFormat('vi-VN').format(order.shippingFee)} ₫</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="py-3 text-right font-medium">Giảm giá</td>
                                        <td className="py-3 text-right text-danger">-{new Intl.NumberFormat('vi-VN').format(order.discount)} ₫</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="3" className="py-3 text-right font-bold text-lg">Tổng cộng</td>
                                        <td className="py-3 text-right font-bold text-lg text-primary">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    <div className="card p-6 hidden">
                        {/* Hidden Invoice Component for Printing */}
                        <div style={{ display: 'none' }}>
                            <Invoice ref={invoiceRef} order={order} />
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className={`card card-glass p-6 border-l-4 border-${order.status === 'Completed' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'primary'
                        }`}>
                        <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Trạng thái đơn hàng</h3>
                        <div className={`text-xl font-bold status-${order.status.toLowerCase()} inline-block px-4 py-2 rounded-full`}>
                            {statusLabels[order.status]}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">Cập nhật cuối: Hôm nay</div>
                    </div>

                    {/* Customer Info */}
                    <div className="card card-glass p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-white font-bold">
                                {order.customerName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary">Khách hàng</h3>
                                <div className="text-xs text-gray-500">Thông tin liên hệ</div>
                            </div>
                        </div>

                        <div className="space-y-3 pl-2">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">👤</span>
                                <div>
                                    <div className="font-medium hover:text-primary cursor-pointer transition">
                                        {order.customerName}
                                    </div>
                                    <div className="text-sm text-gray-500">Người nhận</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">📞</span>
                                <div>
                                    <div>{order.customerPhone}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-xl">📧</span>
                                <div>
                                    <div>{order.customerEmail || 'Chưa cập nhật email'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="card card-glass p-6">
                        <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                            <span>🚚</span> Giao hàng & Thanh toán
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</div>
                                <div className="font-medium text-gray-800">{order.customerAddress}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Phương thức thanh toán</div>
                                <div className="badge badge-outline bg-white border border-gray-300 py-1 px-3 rounded shadow-sm">
                                    💳 {order.paymentMethod}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                title="Xác nhận thay đổi trạng thái"
                size="small"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            variant={confirmModal.status === 'Cancelled' ? 'danger' : 'primary'}
                            onClick={confirmStatusChange}
                        >
                            Đồng ý
                        </Button>
                    </div>
                }
            >
                <p>
                    Bạn có chắc chắn muốn chuyển trạng thái đơn hàng sang:
                    <span className="font-bold ml-1">
                        {confirmModal.status === 'Cancelled' ? 'Hủy đơn' : statusLabels[confirmModal.status]}
                    </span>?
                </p>
                {confirmModal.status === 'Cancelled' && (
                    <p className="text-danger text-sm mt-2">
                        ⚠️ Hành động này không thể hoàn tác!
                    </p>
                )}
            </Modal>
        </div>
    );
};

export default OrderDetail;
