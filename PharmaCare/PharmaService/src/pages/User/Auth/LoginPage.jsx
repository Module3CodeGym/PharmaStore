import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import "./login.css";
import { auth, db, googleProvider } from '../../../firebaseConfig'; // Đảm bảo đường dẫn đúng
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// import loginImg from '../../assets/loginImg.png'; 
import googleIcon from '../../../assets/google.png';
import facebookIcon from '../../../assets/facebook.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkRoleAndRedirect = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.role === 'admin') {
          navigate('/admin'); // Admin vào Dashboard quản lý
        } else if (userData.role === 'doctor') {
          // Nếu là bác sĩ, kiểm tra đã được duyệt chưa
          if (userData.isVerified) {
            navigate('/doctor');
          } else {
             navigate('/waiting-approval'); // Chưa duyệt thì vào trang chờ
          }
        } else {
          navigate('/'); // Khách hàng về trang chủ
        }
      } else {
        // Trường hợp đăng nhập Google lần đầu chưa có trong DB (xử lý sau)
        navigate('/'); 
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu user:", err);
      navigate('/');
    }
  };

  // --- XỬ LÝ ĐĂNG NHẬP EMAIL/PASS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await checkRoleAndRedirect(res.user.uid);
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác!');
      setLoading(false);
    }
  };

  // --- XỬ LÝ ĐĂNG NHẬP GOOGLE ---
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await checkRoleAndRedirect(res.user.uid);
    } catch (err) {
      setError('Đăng nhập Google thất bại.');
    }
  };

  return (
    <div className="login-wrapper">
      <Container className="login-container shadow-lg">
        <Row>
          {/* --- CỘT TRÁI: FORM --- */}
          <Col md={6} className="login-form-section ">
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
                <Link to="/forgot-password" style={{textDecoration: 'none', color: '#6a11cb'}}>Forgot Password?</Link>
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
              Don't have an account yet? <Link to="/register" className="fw-bold" style={{color: '#6a11cb'}}>Sign up</Link>
            </div>

            {/* Link dành riêng cho Bác sĩ như trong thiết kế */}
            <div className="text-center mt-3">
              <small>Bạn là Bác sĩ? <Link to="/doctor/login" className="text-primary">Đăng nhập chuyên gia</Link></small>
            </div>
          </Col>

          {/* <Col md={6} className="d-none d-md-block p-0">
           <Col md={6} className="d-none d-md-block login-img-col">
            <img 
              src={loginImg} 
              alt="Login Banner" 
              className="img-fluid h-100 w-100" 
              style={{objectFit: 'cover', borderTopRightRadius: '15px', borderBottomRightRadius: '15px'}} 
            />
            </Col>
          </Col> */}
        </Row>
      </Container>
    </div>
  );
};
export default LoginPage;