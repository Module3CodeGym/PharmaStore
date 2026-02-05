import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customersApi, ordersApi } from '../../../services/api';
import Button from '../../../components/common/Button/index';
import Table from '../../../components/common/Table/index';
import { toast } from 'react-toastify';
import './CustomerDetail.css';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                // Fetch customer details
                const custResponse = await customersApi.getById(id);
                if (custResponse.success) {
                    setCustomer(custResponse.data);
                } else {
                    toast.error('Không tìm thấy khách hàng');
                    navigate('/customers');
                    return;
                }

                // Fetch customer orders (mocking this by filtering all orders for now, ideally API handles this)
                const ordersResponse = await ordersApi.getAll();
                if (ordersResponse.success) {
                    // Filter orders belonging to this customer (by name for mock match, ideally by ID)
                    const custOrders = ordersResponse.data.filter(o =>
                        o.customerName === custResponse.data.name
                    );
                    setOrders(custOrders);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id, navigate]);

    if (loading || !customer) return <div className="p-6 text-center">Đang tải...</div>;

    const orderColumns = [
        { key: 'id', label: 'Mã đơn' },
        { key: 'orderDate', label: 'Ngày đặt' },
        {
            key: 'total',
            label: 'Tổng tiền',
            render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (value) => (
                <span className={`badge status-${value.toLowerCase()}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'actions',
            label: '',
            render: (_, order) => (
                <Button
                    size="small"
                    variant="ghost"
                    onClick={() => navigate(`/orders/${order.id}`)}
                >
                    Xem
                </Button>
            )
        }
    ];

    return (
        <div className="page-container">
            <div className="page-header mb-6">
                <Button variant="outline" icon="⬅️" onClick={() => navigate('/customers')} className="mb-4">
                    Quay lại danh sách
                </Button>
                <h1 className="page-title">Hồ sơ khách hàng</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card p-6 text-center">
                        <div className="w-24 h-24 bg-primary-light rounded-full mx-auto flex items-center justify-center text-primary-dark text-3xl font-bold mb-4">
                            {customer.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold">{customer.name}</h2>
                        <div className="text-gray-500 mb-4">Thành viên từ: {customer.joinDate}</div>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{customer.loyaltyPoints}</div>
                                <div className="text-xs text-gray-500 uppercase">Điểm tích lũy</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-700">{orders.length}</div>
                                <div className="text-xs text-gray-500 uppercase">Đơn hàng</div>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6">
                        <h3 className="font-bold text-lg mb-4 text-primary">Thông tin liên hệ</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase block">Email</label>
                                <div className="font-medium">{customer.email}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase block">Số điện thoại</label>
                                <div className="font-medium">{customer.phone}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase block">Địa chỉ</label>
                                <div className="font-medium">{customer.address}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Purchases Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="card p-4 bg-primary text-white">
                            <div className="text-sm opacity-80 mb-1">Tổng chi tiêu</div>
                            <div className="text-2xl font-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent)}
                            </div>
                        </div>
                        <div className="card p-4">
                            <div className="text-sm text-gray-500 mb-1">Trung bình đơn</div>
                            <div className="text-2xl font-bold text-gray-800">
                                {orders.length > 0
                                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent / orders.length)
                                    : '0 ₫'
                                }
                            </div>
                        </div>
                        <div className="card p-4">
                            <div className="text-sm text-gray-500 mb-1">Hạng thành viên</div>
                            <div className="text-2xl font-bold text-warning">Gold</div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="card p-6">
                        <h3 className="font-bold text-lg mb-4 text-primary">Lịch sử mua hàng</h3>
                        <Table
                            columns={orderColumns}
                            data={orders}
                            pagination={true}
                            pageSize={5}
                            emptyMessage="Chưa có đơn hàng nào"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetail;
