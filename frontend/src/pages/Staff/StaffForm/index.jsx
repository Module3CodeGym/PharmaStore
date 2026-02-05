import React, { useState, useEffect } from 'react';
import { staffApi } from '../../../services/api';
import Input from '../../../components/common/Input/index';
import Button from '../../../components/common/Button/index';
import { toast } from 'react-toastify';
import './StaffForm.css';

const StaffForm = ({ staff, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'pharmacist',
        status: 'Active',
        password: '' // Only for new users
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name || '',
                email: staff.email || '',
                phone: staff.phone || '',
                role: staff.role || 'pharmacist',
                status: staff.status || 'Active',
                password: ''
            });
        }
    }, [staff]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (staff) {
                // Remove password if empty (don't update it)
                const { password, ...updateData } = formData;
                result = await staffApi.update(staff.id, updateData);
            } else {
                result = await staffApi.create(formData);
            }

            if (result.success) {
                toast.success(staff ? 'Cập nhật thành công!' : 'Thêm nhân viên thành công!');
                onSubmit(result.data);
            } else {
                toast.error(result.error || 'Có lỗi xảy ra');
            }
        } catch (err) {
            toast.error('Lỗi kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Error display removed as using toast */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Họ tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nguyễn Văn A"
                />

                <Input
                    type="email"
                    label="Email (Tên đăng nhập)"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    disabled={!!staff} // Cannot change email after creation
                />

                <Input
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
                />

                <Input
                    type="select"
                    label="Vai trò"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    options={[
                        { value: 'admin', label: 'Quản trị viên (Admin)' },
                        { value: 'pharmacist', label: 'Dược sĩ' }
                    ]}
                />

                {!staff && (
                    <Input
                        type="password"
                        label="Mật khẩu"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Mật khẩu khởi tạo"
                    />
                )}

                <Input
                    type="select"
                    label="Trạng thái"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    options={[
                        { value: 'Active', label: 'Đang hoạt động' },
                        { value: 'Inactive', label: 'Ngừng hoạt động' }
                    ]}
                />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy bỏ
                </Button>
                <Button type="submit" variant="primary" loading={loading}>
                    {staff ? 'Cập nhật' : 'Thêm nhân viên'}
                </Button>
            </div>
        </form>
    );
};

export default StaffForm;
