import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#0984e3' }}>PharmaConnect</h1>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span>Welcome, <strong>{user?.name}</strong></span>
                    <button onClick={logout} className="btn btn-secondary">Logout</button>
                </div>
            </header>

            <div className="user-dashboard">
                <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3><FaUserCircle /> My Profile</h3>
                    <p>Role: {user?.role}</p>
                    <p>This is the customer-facing interface.</p>
                </div>

                <br />

                <div className="card" style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3><FaShoppingCart /> My Orders</h3>
                    <p>No active orders.</p>
                    <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={() => alert('Shop feature coming soon!')}>
                        Browse Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
