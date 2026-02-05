import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersApi } from '../../../services/api';
import Table from '../../../components/common/Table/index';
import Button from '../../../components/common/Button/index';
import Input from '../../../components/common/Input/index';
import './CustomerList.css';

const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await customersApi.getAll();
                if (response.success) {
                    setCustomers(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { key: 'id', label: 'Mã KH', sortable: true },
        { key: 'name', label: 'Họ tên', sortable: true },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'email', label: 'Email' },
        {
            key: 'loyaltyPoints',
            label: 'Điểm tích lũy',
            sortable: true,
            render: (value) => <span className="font-bold text-primary">{value} điểm</span>
        },
        { key: 'totalSpent', label: 'Tổng chi tiêu', sortable: true, render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) },
        {
            key: 'actions',
            label: 'Hành động',
            render: (_, customer) => (
                <Button
                    size="small"
                    variant="ghost"
                    icon="👁️"
                    onClick={() => navigate(`/customers/${customer.id}`)}
                >
                    Chi tiết
                </Button>
            )
        }
    ];

    return (
        <div className="page-container">
            <div className="page-header mb-6">
                <h1 className="page-title">Quản lý Khách hàng</h1>
                <p className="page-description">Danh sách khách hàng và lịch sử mua hàng</p>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4 p-4">
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <Input
                            placeholder="Tìm kiếm theo tên, SĐT hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon="🔍"
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredCustomers}
                    loading={loading}
                    pagination={true}
                    pageSize={10}
                    emptyMessage="Không tìm thấy khách hàng nào"
                />
            </div>
        </div>
    );
};

export default CustomerList;
