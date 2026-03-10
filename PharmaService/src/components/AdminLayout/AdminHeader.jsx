import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
    const { user } = useAuth();

    return (
        <header className="admin-top-header">
            <div className="admin-header-left">
                <h3>Dashboard</h3>
            </div>
            <div className="admin-header-right">
                <div className="admin-notification-icon">
                    <FaBell />
                    <span className="admin-header-badge">3</span>
                </div>
                <div className="admin-user-profile">
                    <FaUserCircle className="admin-user-avatar" />
                    <span className="admin-user-name">{user ? user.name : 'Guest'}</span>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;