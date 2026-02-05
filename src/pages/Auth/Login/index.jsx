import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Input from '../../../components/common/Input/index';
import Button from '../../../components/common/Button/index';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect to original destination after login, or dashboard
    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        try {
            setLoading(true);
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.error || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    // Quick fill for demo purposes
    const fillCredentials = (role) => {
        const creds = {
            admin: { email: 'admin@pharmacare.com', password: 'password123' },
            pharmacist: { email: 'duocsi.d@pharmacare.com', password: 'password123' },
            warehouse: { email: 'nhanvien.e@pharmacare.com', password: 'password123' }
        };
        setFormData(creds[role]);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">⚕️</div>
                    <h1 className="login-title">PharmaCare</h1>
                    <p className="login-subtitle">Hệ thống quản lý nhà thuốc</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nhanvien@pharmacare.com"
                        required
                        disabled={loading}
                        icon="✉️"
                    />

                    <Input
                        label="Mật khẩu"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        disabled={loading}
                        icon="🔒"
                    />

                    <div className="form-actions">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                        </div>
                        <a href="#" className="forgot-password">Quên mật khẩu?</a>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="large"
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </form>

                {/* Demo Helper - Remove in production */}
                <div className="demo-helper">
                    <p>Tài khoản demo:</p>
                    <div className="demo-buttons">
                        <button type="button" onClick={() => fillCredentials('admin')}>Admin</button>
                        <button type="button" onClick={() => fillCredentials('pharmacist')}>Dược sĩ</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
