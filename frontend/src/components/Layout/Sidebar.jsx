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
    FaFileInvoiceDollar
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import LogoutModal from './LogoutModal';
import './Sidebar.css';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const menuItems = [
        { path: '/', name: 'Tổng quan', icon: <FaHome /> },
        { path: '/products', name: 'Sản phẩm', icon: <FaBoxOpen /> },
        { path: '/inventory', name: 'Kho hàng', icon: <FaWarehouse /> },
        { path: '/orders', name: 'Đơn hàng', icon: <FaFileInvoiceDollar /> },
        { path: '/customers', name: 'Khách hàng', icon: <FaUsers /> },
        { path: '/employees', name: 'Nhân viên', icon: <FaUserTie /> },
        { path: '/logs', name: 'Lịch sử hệ thống', icon: <FaHistory /> },
    ];

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        logout();
        navigate('/login');
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h2>PharmaStore</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                <span className="icon">{item.icon}</span>
                                <span className="label">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogoutClick} className="nav-link logout-btn">
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
