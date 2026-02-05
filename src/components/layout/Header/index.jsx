import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

/**
 * Header Component
 * Contains user profile, notifications, and logout
 */

const Header = ({ user = { name: 'Admin User', avatar: '👤' } }) => {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const [notificationCount] = React.useState(3); // Mock notification count

    const handleLogout = () => {
        // TODO: Implement logout logic
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-left">
                {/* Mobile menu toggle can be added here */}
                <h1 className="header-title">Quản trị nhà thuốc</h1>
            </div>

            <div className="header-right">
                {/* Notifications */}
                <button className="header-btn notification-btn">
                    <span className="notification-icon">🔔</span>
                    {notificationCount > 0 && (
                        <span className="notification-badge">{notificationCount}</span>
                    )}
                </button>

                {/* User Menu */}
                <div className="user-menu-wrapper">
                    <button
                        className="user-menu-trigger"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <span className="user-avatar">{user.avatar}</span>
                        <span className="user-name">{user.name}</span>
                        <span className="dropdown-arrow">▼</span>
                    </button>

                    {showUserMenu && (
                        <div className="user-menu-dropdown">
                            <button className="dropdown-item" onClick={() => navigate('/profile')}>
                                <span className="item-icon">👤</span>
                                Hồ sơ cá nhân
                            </button>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item danger" onClick={handleLogout}>
                                <span className="item-icon">🚪</span>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showUserMenu && (
                <div
                    className="dropdown-overlay"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
};

export default Header;
