import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../../../services/api';
import Table from '../../../components/common/Table/index';
import Button from '../../../components/common/Button/index';
import Input from '../../../components/common/Input/index';
import Modal from '../../../components/common/Modal/index';
import './InventoryList.css';
import { toast } from 'react-toastify';

const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modal state
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleViewDetail = (item) => {
        setSelectedBatch(item);
        setIsDetailModalOpen(true);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await inventoryApi.getAll();
            if (response.success) {
                setInventory(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status, expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const monthsUntilExpiry = (expiry - today) / (1000 * 60 * 60 * 24 * 30);

        let className = 'badge ';
        let label = status;

        if (monthsUntilExpiry < 0) {
            className += 'badge-danger';
            label = 'Đã hết hạn';
        } else if (monthsUntilExpiry < 3) {
            className += 'badge-warning';
            label = 'Sắp hết hạn';
        } else if (status === 'Low Stock' || status === 'Out of Stock') {
            className += 'badge-danger';
        } else {
            className += 'badge-success';
        }

        return <span className={className}>{label}</span>;
    };

    // Filter logic
    const filteredData = inventory.filter(item => {
        const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

        // Simple status filter mapping
        let matchesStatus = true;
        if (statusFilter) {
            if (statusFilter === 'expiring') {
                const today = new Date();
                const expiry = new Date(item.expiryDate);
                const monthsUntilExpiry = (expiry - today) / (1000 * 60 * 60 * 24 * 30);
                matchesStatus = monthsUntilExpiry < 3 && monthsUntilExpiry >= 0;
            } else if (statusFilter === 'expired') {
                matchesStatus = new Date(item.expiryDate) < new Date();
            } else {
                matchesStatus = item.status === statusFilter;
            }
        }

        return matchesSearch && matchesStatus;
    });

    const columns = [
        { key: 'productName', label: 'Tên sản phẩm', sortable: true },
        { key: 'batchNumber', label: 'Số lô', sortable: true },
        { key: 'expiryDate', label: 'Hạn sử dụng', sortable: true },
        { key: 'quantity', label: 'Tồn kho', sortable: true },
        { key: 'shelfLocation', label: 'Vị trí kệ' },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (_, item) => getStatusBadge(item.status, item.expiryDate)
        },
        {
            key: 'actions',
            label: '',
            render: (_, item) => (
                <Button size="small" variant="ghost" icon="📝" onClick={() => handleViewDetail(item)}>
                    Chi tiết
                </Button>
            )
        }
    ];

    return (
        <div className="page-container">
            <div className="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-title">Quản lý Kho</h1>
                    <p className="page-description">Theo dõi tồn kho, hạn sử dụng và lô hàng</p>
                </div>
                <Link to="/inventory/import">
                    <Button variant="primary" icon="📥">
                        Nhập kho
                    </Button>
                </Link>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4 p-4 flex-wrap">
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <Input
                            placeholder="Tìm theo tên thuốc hoặc số lô..."
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
                            options={[
                                { value: 'Available', label: 'Sẵn sàng' },
                                { value: 'Low Stock', label: 'Sắp hết hàng' },
                                { value: 'expiring', label: 'Sắp hết hạn (< 3 tháng)' },
                                { value: 'expired', label: 'Đã hết hạn' }
                            ]}
                            placeholder="Tất cả trạng thái"
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredData}
                    loading={loading}
                    pagination={true}
                    pageSize={10}
                    emptyMessage="Không có dữ liệu tồn kho"
                />
            </div>
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Chi tiết lô hàng"
            >
                {selectedBatch && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-500 block">Sản phẩm</label>
                                <div className="font-medium text-lg text-primary">{selectedBatch.productName}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Số lô (Batch)</label>
                                <div className="font-medium">{selectedBatch.batchNumber}</div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500 block">Nhà cung cấp</label>
                                <div>{selectedBatch.supplier || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Giá nhập</label>
                                <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBatch.importPrice || 0)}</div>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500 block">Ngày nhập</label>
                                <div>{selectedBatch.importDate}</div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-500 block">Hạn sử dụng</label>
                                <div className={new Date(selectedBatch.expiryDate) < new Date() ? 'text-danger font-bold' : ''}>
                                    {selectedBatch.expiryDate}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-4 pt-4">
                            <Input
                                label="Vị trí kệ (Shelf Location)"
                                value={selectedBatch.shelfLocation}
                                onChange={(e) => {
                                    // Optimistic update for UI demo
                                    const newVal = e.target.value;
                                    setInventory(prev => prev.map(item =>
                                        item.id === selectedBatch.id ? { ...item, shelfLocation: newVal } : item
                                    ));
                                    setSelectedBatch(prev => ({ ...prev, shelfLocation: newVal }));
                                }}
                                placeholder="Ví dụ: A-01"
                            />

                            <div className="mt-2">
                                <label className="text-sm text-gray-500 block mb-1">Ghi chú</label>
                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 min-h-[60px]">
                                    {selectedBatch.notes || 'Không có ghi chú'}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
                            <Button variant="primary" onClick={() => {
                                alert('Đã cập nhật vị trí!'); // Mock API call
                                setIsDetailModalOpen(false);
                            }}>Lưu thay đổi</Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InventoryList;
