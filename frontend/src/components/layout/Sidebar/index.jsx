import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar Navigation Component
 * Role-based menu items
 */

const Sidebar = ({ userRole = 'admin' }) => {
    const location = useLocation();

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/',
            icon: '📊',
            roles: ['admin', 'pharmacist']
        },
        {
            name: 'Kho hàng',
            path: '/inventory',
            icon: '📦',
            roles: ['admin', 'pharmacist']
        },
        {
            name: 'Đơn hàng',
            path: '/orders',
            icon: '🛒',
            roles: ['admin', 'pharmacist']
        },
        {
            name: 'Khách hàng',
            path: '/customers',
            icon: '👥',
            roles: ['admin', 'pharmacist']
        },
        {
            name: 'Nhân viên',
            path: '/staff',
            icon: '👨‍⚕️',
            roles: ['admin']
        },
        {
            name: 'Lịch sử hệ thống',
            path: '/system-logs',
            icon: '📜',
            roles: ['admin']
        }
    ];

    // Filter menu based on user role
    const filteredMenu = menuItems.filter(item =>
        item.roles.includes(userRole)
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span className="logo-icon">⚕️</span>
                    <h2 className="logo-text">PharmaCare</h2>
                </div>
                <p className="logo-subtitle">Quản trị hệ thống</p>
            </div>

            <nav className="sidebar-nav">
                {filteredMenu.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                {/* User badge removed as requested */}
            </div>
        </aside>
    );
};

export default Sidebar;
