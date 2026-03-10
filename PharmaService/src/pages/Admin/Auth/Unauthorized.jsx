import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoBack = () => {
        if (!user) {
            navigate('/admin/login');
            return;
        }

        switch (user.role) {
            case 'Admin':
                navigate('/admin');
                break;
            case 'Staff':
                navigate('/admin/inventory');
                break;
            default:
                navigate('/admin/login');
        }
    };

    return (
        <div className="admin-auth-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className="admin-auth-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px' }}>
                <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>Truy cập bị từ chối</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                    Bạn không có quyền xem trang này.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={handleGoBack}
                    style={{ marginRight: '10px' }}
                >
                    Quay lại trang chủ
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/admin/login')}
                >
                    Đăng nhập lại
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
