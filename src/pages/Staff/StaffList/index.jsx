import React, { useState, useEffect } from 'react';
import { staffApi } from '../../../services/api';
import Table from '../../../components/common/Table/index';
import Button from '../../../components/common/Button/index';
import Input from '../../../components/common/Input/index';
import Modal from '../../../components/common/Modal/index';
import StaffForm from '../StaffForm';
import { toast } from 'react-toastify';
import './StaffList.css';

const StaffList = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, staffId: null });

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await staffApi.getAll();
            if (response.success) {
                setStaffList(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleEdit = (staff) => {
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedStaff(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedStaff(null);
    };

    const handleFormSubmit = async () => {
        await fetchStaff();
        handleModalClose();
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ isOpen: true, staffId: id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.staffId;
        setDeleteModal({ isOpen: false, staffId: null });
        try {
            const response = await staffApi.delete(id);
            if (response.success) {
                toast.success('Đã xóa nhân viên');
                fetchStaff();
            } else {
                toast.error('Không thể xóa: ' + response.error);
            }
        } catch (error) {
            console.error('Error deleting staff:', error);
            toast.error('Lỗi khi xóa nhân viên');
        }
    };

    const roleLabels = {
        'admin': 'Quản trị viên',
        'pharmacist': 'Dược sĩ'
    };

    const roleColors = {
        'admin': 'danger',
        'pharmacist': 'success'
    };

    const filteredStaff = staffList.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Họ tên', sortable: true },
        { key: 'email', label: 'Email' },
        {
            key: 'role',
            label: 'Vai trò',
            sortable: true,
            render: (role) => (
                <span className={`badge badge-${roleColors[role] || 'default'}`}>
                    {roleLabels[role] || role}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (status) => (
                <span className={status === 'Active' ? 'text-success font-medium' : 'text-gray-500'}>
                    {status === 'Active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </span>
            )
        },
        {
            key: 'actions',
            label: 'Hành động',
            render: (_, staff) => (
                <div className="flex gap-2">
                    <Button
                        size="small"
                        variant="ghost"
                        icon="✏️"
                        onClick={() => handleEdit(staff)}
                    >
                        Sửa
                    </Button>
                    <Button
                        size="small"
                        variant="ghost"
                        className="text-danger"
                        icon="🗑️"
                        onClick={() => handleDeleteClick(staff.id)}
                    >
                        Xóa
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="page-container">
            <div className="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-title">Quản lý Nhân viên</h1>
                    <p className="page-description">Quản lý tài khoản và phân quyền người dùng</p>
                </div>
                <Button variant="primary" icon="➕" onClick={handleAddNew}>
                    Thêm nhân viên
                </Button>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4 p-4">
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <Input
                            placeholder="Tìm kiếm nhân viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon="🔍"
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredStaff}
                    loading={loading}
                    pagination={true}
                    pageSize={10}
                    emptyMessage="Không tìm thấy nhân viên nào"
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={selectedStaff ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}
            >
                <StaffForm
                    staff={selectedStaff}
                    onSubmit={handleFormSubmit}
                    onCancel={handleModalClose}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, staffId: null })}
                title="Xác nhận xóa"
                size="small"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, staffId: null })}>Hủy</Button>
                        <Button variant="danger" onClick={confirmDelete}>Xác nhận xóa</Button>
                    </div>
                }
            >
                <p>Bạn có chắc chắn muốn xóa nhân viên này? Hành động này sẽ gỡ bỏ quyền truy cập của họ.</p>
            </Modal>
        </div>
    );
};

export default StaffList;
