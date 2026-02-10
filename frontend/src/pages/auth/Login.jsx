import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await login(formData.username, formData.password);

            // Role-based redirect
            if (user.role === 'Admin') navigate('/');
            else if (user.role === 'Staff') navigate('/inventory');
            else if (user.role === 'User') navigate('/user-home');
            else navigate('/');

        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>PharmaCare Login</h2>
                <p className="auth-subtitle">Sign in to your account</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="admin / staff / user"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="123"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    <div className="demo-credentials">
                        <small>Demo Credentials:</small>
                        <ul>
                            <li>Admin: admin / 123</li>
                            <li>Staff: staff / 123</li>
                            <li>User: user / 123</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
