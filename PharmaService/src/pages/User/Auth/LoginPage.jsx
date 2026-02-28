import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import "./login.css";
import { auth, db, googleProvider } from '../../../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';
// import loginImg from '../../assets/loginImg.png'; 

import { useAuth } from '../../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- HÀM KIỂM TRA ROLE VÀ ĐIỀU HƯỚNG ---
  const handleRedirect = (user) => {
    const role = user.role;

    // Mapping roles to paths
    if (role === 'Admin' || role === 'admin') {
      navigate('/admin');
    } else if (role === 'Staff' || role === 'pharmacist' || role === 'staff') {
      navigate('/pharmacist/dashboard');
    } else if (role === 'doctor') {
      navigate('/doctor');
    } else if (role === 'User' || role === 'user') {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  // --- XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      handleRedirect(user);
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác!');
      setLoading(false);
    }
  };

  // --- XỬ LÝ ĐĂNG NHẬP GOOGLE (Tạm thời giữ nguyên hoặc tắt nếu mock) ---
  const handleGoogleLogin = async () => {
    setError('Tính năng đăng nhập Google đang được bảo trì cho hệ thống thống nhất.');
  };

  return (
    <div className="login-wrapper">
      <Container className="login-container shadow-lg">
        <Row className="justify-content-center">
          {/* Căn giữa nếu bỏ cột ảnh, hoặc giữ nguyên bố cục tùy bạn */}

          <Col md={6} className="login-form-section">
            <h5 className="text-muted mb-2">Welcome back!</h5>
            <h2 className="fw-bold mb-4">Log In</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end mb-4">
                <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#6a11cb' }}>Forgot Password?</Link>
              </div>

              <Button
                variant="success"
                type="submit"
                className="w-100 py-2 fw-bold login-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login Now'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted line-text">Or continue with</span>
            </div>

            <div className="social-login d-flex justify-content-center gap-3 mt-3">
              <button className="social-btn" onClick={handleGoogleLogin}>
                <img src={googleIcon} alt="Google" width="24" />
              </button>
              <button className="social-btn">
                <img src={facebookIcon} alt="Facebook" width="24" />
              </button>
            </div>

            <div className="text-center mt-4">
              Don't have an account yet? <Link to="/register" className="fw-bold" style={{ color: '#6a11cb' }}>Sign up</Link>
            </div>


          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;