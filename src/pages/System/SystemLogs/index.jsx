import React, { useState, useEffect } from 'react';
import { systemLogsApi } from '../../../services/api';
import Table from '../../../components/common/Table/index';
import Button from '../../../components/common/Button/index';
import Input from '../../../components/common/Input/index';
import './SystemLogs.css';


const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await systemLogsApi.getLogs();
            if (response.success) {
                setLogs(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || log.module === filterType;

        // Date filtering
        let matchesDate = true;
        if (startDate) {
            const logDate = new Date(log.timestamp.split(' ')[0]); // Get YYYY-MM-DD part
            const startFilterDate = new Date(startDate);
            matchesDate = matchesDate && (logDate >= startFilterDate);
        }
        if (endDate) {
            const logDate = new Date(log.timestamp.split(' ')[0]);
            const endFilterDate = new Date(endDate);
            matchesDate = matchesDate && (logDate <= endFilterDate);
        }

        return matchesSearch && matchesType && matchesDate;
    });

    const columns = [
        { key: 'timestamp', label: 'Thời gian', sortable: true },
        {
            key: 'user',
            label: 'Người thực hiện',
            render: (user) => <span className="font-medium text-primary-dark">{user}</span>
        },
        {
            key: 'module',
            label: 'Phân hệ',
            render: (module) => {
                let color = 'secondary';
                if (module === 'Auth') color = 'warning';
                if (module === 'Orders') color = 'info';
                if (module === 'Staff') color = 'danger';
                return (
                    <span className={`badge badge-${color} text-xs`}>
                        {module}
                    </span>
                );
            }
        },
        { key: 'action', label: 'Hành động', sortable: true },
        { key: 'details', label: 'Chi tiết' }
    ];

    return (
        <div className="page-container">
            <div className="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-title">Lịch sử hệ thống</h1>
                    <p className="page-description">Theo dõi các thay đổi và hoạt động của nhân viên</p>
                </div>
                <Button variant="outline" icon="🔄" onClick={fetchLogs}>
                    Làm mới
                </Button>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4 p-4 flex-wrap items-end">
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <Input
                            placeholder="Tìm kiếm hành động hoặc người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon="🔍"
                        />
                    </div>
                    <div style={{ width: '180px' }}>
                        <Input
                            type="select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            options={[
                                { value: 'all', label: 'Tất cả phân hệ' },
                                { value: 'Auth', label: 'Hệ thống/Login' },
                                { value: 'Products', label: 'Sản phẩm' },
                                { value: 'Inventory', label: 'Kho hàng' },
                                { value: 'Orders', label: 'Đơn hàng' },
                                { value: 'Staff', label: 'Nhân viên' }
                            ]}
                        />
                    </div>
                    <div style={{ width: '180px' }}>
                        <Input
                            type="date"
                            label="Từ ngày"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '180px' }}>
                        <Input
                            type="date"
                            label="Đến ngày"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredLogs}
                    loading={loading}
                    pagination={true}
                    pageSize={15}
                    emptyMessage="Không có nhật ký hệ thống nào"
                />
            </div>
        </div>
    );
};

export default SystemLogs;
