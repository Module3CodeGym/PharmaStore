import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const PharmacistRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Tạo tài khoản Authentication
      const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = res.user;

      // 2. Lưu thông tin vào Firestore với role 'pharmacist'
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: formData.name,
        email: formData.email,
        phone: formData.phone,
        
        role: "pharmacist", // <--- QUAN TRỌNG NHẤT
        
        isVerified: true, // Tạm thời để true để test luôn (Thực tế nên để false chờ Admin duyệt)
        createdAt: serverTimestamp()
      });

      alert("Đăng ký tài khoản Dược sĩ thành công!");
      navigate('/login');

    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="p-4 shadow rounded bg-white" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center text-success mb-4">Đăng ký Dược Sĩ 💊</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control type="text" name="name" onChange={handleChange} required placeholder="Nguyễn Văn A" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" onChange={handleChange} required placeholder="pharmacist@example.com" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control type="text" name="phone" onChange={handleChange} required placeholder="09xxxx" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control type="password" name="password" onChange={handleChange} required />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </Button>
        </Form>
        
        <div className="text-center mt-3">
            <Link to="/login">Quay lại Đăng nhập</Link>
        </div>
      </div>
    </Container>
  );
};

export default PharmacistRegister;