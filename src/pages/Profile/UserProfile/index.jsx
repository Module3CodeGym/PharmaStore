import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { staffApi } from '../../../services/api';
import Input from '../../../components/common/Input/index';
import Button from '../../../components/common/Button/index';
import { toast } from 'react-toastify';
import './UserProfile.css';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmNewPassword) {
                    toast.error('Mật khẩu mới không khớp');
                    setLoading(false);
                    return;
                }
                if (formData.newPassword.length < 6) {
                    toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
                    setLoading(false);
                    return;
                }
            }

            // Prepare update data
            const updateData = {
                name: formData.name,
                phone: formData.phone
            };

            // Call API
            const response = await staffApi.update(user.id, updateData);

            if (response.success) {
                // Update local auth context
                updateUser({ ...user, ...response.data });
                toast.success('Cập nhật hồ sơ thành công');

                // Reset password fields
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }));
            } else {
                toast.error(response.error || 'Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            toast.error('Lỗi kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header mb-6">
                <h1 className="page-title">Hồ sơ cá nhân</h1>
                <p className="page-description">Quản lý thông tin tài khoản của bạn</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="card p-6 text-center">
                    <div className="w-24 h-24 bg-primary-light rounded-full mx-auto flex items-center justify-center text-primary-dark text-3xl font-bold mb-4 border-4 border-white shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <div className="text-primary font-medium mb-1 capitalize">
                        {user?.role === 'pharmacist' ? 'Dược sĩ' : user?.role}
                    </div>
                    <div className="text-gray-500 text-sm">{user?.email}</div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center gap-2">
                        <span className="badge badge-success">Đang hoạt động</span>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2 card p-6">
                    <h3 className="font-bold text-lg mb-6 text-primary border-b border-gray-100 pb-2">
                        Thông tin chi tiết
                    </h3>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Input
                                label="Họ tên"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                icon="👤"
                            />

                            <Input
                                label="Email"
                                name="email"
                                value={formData.email}
                                disabled // Email is typically immutable or requires special process
                                icon="✉️"
                                title="Không thể thay đổi email"
                            />

                            <Input
                                label="Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                icon="📞"
                            />

                            <Input
                                label="Vai trò"
                                value={user?.role === 'pharmacist' ? 'Dược sĩ' : 'Quản trị viên'}
                                disabled
                                icon="🛡️"
                            />
                        </div>

                        <h3 className="font-bold text-lg mb-4 text-primary border-b border-gray-100 pb-2">
                            Đổi mật khẩu
                        </h3>

                        <div className="space-y-4 mb-6">
                            <Input
                                type="password"
                                label="Mật khẩu hiện tại"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu hiện tại để xác nhận"
                                icon="🔒"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    type="password"
                                    label="Mật khẩu mới"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Để trống nếu không đổi"
                                    icon="🔑"
                                />

                                <Input
                                    type="password"
                                    label="Xác nhận mật khẩu mới"
                                    name="confirmNewPassword"
                                    value={formData.confirmNewPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu mới"
                                    icon="✅"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                icon="💾"
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
