import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import '../auth/Auth.css';

const UserHome = () => {
    const { user, logout } = useAuth();

    return (
        <div className="auth-container" style={{ padding: '20px' }}>
            <div className="auth-box" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={{ color: '#0984e3' }}>PharmaStore</h1>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span>Chào mừng, <strong>{user?.name}</strong></span>
                        <button onClick={logout} className="btn btn-secondary" style={{ padding: '5px 15px', width: 'auto' }}>Đăng xuất</button>
                    </div>
                </header>

                <div className="user-dashboard" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3><FaUserCircle /> Hồ sơ của tôi</h3>
                        <p>Vai trò: <strong>Khách hàng</strong></p>
                        <p>Đây là giao diện dành cho khách hàng.</p>
                    </div>

                    <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                        <h3><FaShoppingCart /> Đơn hàng của tôi</h3>
                        <p>Chưa có đơn hàng nào.</p>
                        <button className="btn btn-primary" style={{ marginTop: '10px', width: 'auto' }} onClick={() => alert('Tính năng mua sắm sắp ra mắt!')}>
                            Xem sản phẩm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
