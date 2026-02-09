import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './login.css'; // Dùng lại CSS của trang Login cho đẹp

import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Import ảnh (dùng chung ảnh login hoặc ảnh khác tùy bạn)
// import loginImg from '../assets/loginImg.png'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPass) {
      return setError('Mật khẩu xác nhận không khớp!');
    }

    setLoading(true);
    try {
      // 1. Tạo tài khoản Authentication
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // 2. Lưu thông tin người dùng vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        role: "customer", // Mặc định là khách hàng
        createdAt: new Date(),
        isVerified: true
      });

      alert("Đăng ký thành công!");
      navigate('/login'); // Chuyển về trang đăng nhập
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã được sử dụng.');
      } else if (err.code === 'auth/weak-password') {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <Container className="login-container">
        <Row>
          {/* CỘT TRÁI: FORM ĐĂNG KÝ */}
          <Col md={6} className="login-form-section">
            <h5 className="text-muted mb-2">Start for free</h5>
            <h2 className="fw-bold mb-4">Sign Up</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Nguyen Van A" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="At least 6 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Repeat password" 
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required 
                />
              </Form.Group>

              <Button 
                type="submit" 
                className="w-100 login-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              Already have an account? <Link to="/login" style={{fontWeight: 'bold', color: '#6a11cb'}}>Log In</Link>
            </div>
          </Col>

         
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;