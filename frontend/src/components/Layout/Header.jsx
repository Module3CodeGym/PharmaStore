import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="top-header">
            <div className="header-left">
                {/* Placeholder for breadcrumbs or page title if needed */}
                <h3>Dashboard</h3>
            </div>
            <div className="header-right">
                <div className="notification-icon">
                    <FaBell />
                    <span className="badge">3</span>
                </div>
                <div className="user-profile">
                    <FaUserCircle className="user-avatar" />
                    <span className="user-name">{user ? user.name : 'Guest'}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
