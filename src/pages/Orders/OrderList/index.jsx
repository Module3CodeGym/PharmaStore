import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../../services/api';
import Table from '../../../components/common/Table/index';
import Button from '../../../components/common/Button/index';
import Input from '../../../components/common/Input/index';
import Modal from '../../../components/common/Modal/index';
import './OrderList.css';

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersApi.getAll();
            if (response.success) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickView = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const statusColors = {
        'Pending': 'warning',
        'Confirmed': 'info',
        'Preparing': 'primary',
        'Delivering': 'secondary',
        'Completed': 'success',
        'Cancelled': 'danger'
    };

    const statusLabels = {
        'Pending': 'Chờ xác nhận',
        'Confirmed': 'Đã xác nhận',
        'Preparing': 'Đang chuẩn bị',
        'Delivering': 'Đang giao',
        'Completed': 'Hoàn thành',
        'Cancelled': 'Đã hủy'
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? order.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        { key: 'id', label: 'Mã đơn', sortable: true },
        { key: 'orderDate', label: 'Ngày đặt', sortable: true },
        { key: 'customerName', label: 'Khách hàng', sortable: true },
        {
            key: 'total',
            label: 'Tổng tiền',
            sortable: true,
            render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (value) => (
                <span className={`badge badge-${statusColors[value] || 'default'}`}>
                    {statusLabels[value] || value}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Hành động',
            render: (_, order) => (
                <div className="flex gap-2">
                    <Button
                        size="small"
                        variant="ghost"
                        icon="👁️"
                        onClick={() => handleQuickView(order)}
                        title="Xem nhanh"
                    >
                        Xem
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="page-container">
            <div className="page-header mb-6">
                <h1 className="page-title">Quản lý Đơn hàng</h1>
                <p className="page-description">Danh sách đơn đặt hàng từ khách</p>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4 p-4 flex-wrap">
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <Input
                            placeholder="Tìm theo mã đơn hoặc tên khách..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon="🔍"
                        />
                    </div>
                    <div style={{ width: '200px' }}>
                        <Input
                            type="select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={Object.keys(statusLabels).map(key => ({
                                value: key,
                                label: statusLabels[key]
                            }))}
                            placeholder="Tất cả trạng thái"
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredOrders}
                    loading={loading}
                    pagination={true}
                    pageSize={10}
                    emptyMessage="Không tìm thấy đơn hàng nào"
                />
            </div>

            {/* Quick View Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedOrder ? `Chi tiết đơn hàng #${selectedOrder.id}` : 'Chi tiết đơn hàng'}
                size="large"
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500 block">Khách hàng</label>
                                <div className="font-medium">{selectedOrder.customerName}</div>
                                <div className="text-sm text-gray-600">{selectedOrder.customerPhone}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Ngày đặt</label>
                                <div className="font-medium">{selectedOrder.orderDate}</div>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm text-gray-500 block">Địa chỉ giao hàng</label>
                                <div>{selectedOrder.customerAddress}</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-sm text-gray-500 uppercase mb-2">Sản phẩm</h4>
                            <div className="bg-gray-50 rounded p-4">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-2">Tên sản phẩm</th>
                                            <th className="text-center py-2">SL</th>
                                            <th className="text-right py-2">Đơn giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                                                <td className="py-2">{item.productName}</td>
                                                <td className="text-center py-2">{item.quantity}</td>
                                                <td className="text-right py-2">{new Intl.NumberFormat('vi-VN').format(item.price)} ₫</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="font-medium">
                                        <tr>
                                            <td colSpan="2" className="pt-3 text-right">Tổng tiền:</td>
                                            <td className="pt-3 text-right text-lg text-primary">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedOrder.total)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Đóng</Button>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/orders/${selectedOrder.id}`)}
                                icon="🔗"
                            >
                                Xem chi tiết đầy đủ
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderList;
