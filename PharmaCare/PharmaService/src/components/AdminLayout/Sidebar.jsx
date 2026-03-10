import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaHome,
    FaBoxOpen,
    FaWarehouse,
    FaUsers,
    FaUserTie,
    FaHistory,
    FaSignOutAlt,
    FaFileInvoiceDollar,
    FaUserCircle
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from './LogoutModal';
import './Sidebar.css';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const menuItems = [
        { path: '/admin', name: 'Tổng quan', icon: <FaHome />, roles: ['Admin'], end: true },
        { path: '/admin/products', name: 'Sản phẩm', icon: <FaBoxOpen />, roles: ['Admin', 'Staff'] },
        { path: '/admin/inventory', name: 'Kho hàng', icon: <FaWarehouse />, roles: ['Admin', 'Staff'] },
        { path: '/admin/orders', name: 'Đơn hàng', icon: <FaFileInvoiceDollar />, roles: ['Admin', 'Staff'] },
        { path: '/admin/customers', name: 'Khách hàng', icon: <FaUsers />, roles: ['Admin', 'Staff'] },
        { path: '/admin/employees', name: 'Nhân viên', icon: <FaUserTie />, roles: ['Admin'] },
        { path: '/admin/logs', name: 'Lịch sử hệ thống', icon: <FaHistory />, roles: ['Admin'] },
    ];

    // Filter items based on user role
    const filteredItems = menuItems.filter(item => {
        if (!user) return false;
        return item.roles.includes(user.role);
    });

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        logout();
        navigate('/login');
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar-logo">
                <h2>PharmaStore</h2>
            </div>
            <nav className="admin-sidebar-nav">
                <ul>
                    {filteredItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="label">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="admin-sidebar-footer">
                <div className="admin-sidebar-user">
                    <div className="admin-user-profile">
                        <FaUserCircle className="admin-user-avatar" />
                        <div className="admin-user-info">
                            <span className="admin-user-name">{user ? user.name : 'Khách'}</span>
                            <span className="admin-user-role">{user ? user.role : ''}</span>
                        </div>
                    </div>
                </div>
                <button onClick={handleLogoutClick} className="admin-nav-link admin-logout-btn">
                    <span className="icon"><FaSignOutAlt /></span>
                    <span className="label">Đăng xuất</span>
                </button>
            </div>

            <LogoutModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleConfirmLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </div>
    );
};

export default Sidebar;