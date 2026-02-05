import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route Component
 * Checks authentication and role permissions
 */

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <div className="spinner" />
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role permissions
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return (
            <div className="access-denied" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '1rem',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h2 style={{ color: 'var(--danger)' }}>⛔ Truy cập bị từ chối</h2>
                <p>Bạn không có quyền truy cập trang này.</p>
                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    Đăng xuất / Quay lại
                </button>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
