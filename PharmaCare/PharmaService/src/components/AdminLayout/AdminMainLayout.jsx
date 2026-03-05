import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminMainLayout = () => {
    return (
        <div className="admin-wrapper">
            <Sidebar />
            <div className="admin-main-content">
                <div className="admin-content-area">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminMainLayout;