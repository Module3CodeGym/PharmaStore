import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    // Giả lập dữ liệu nhận được từ Bác sĩ/Dược sĩ gửi qua
    const mockData = {
      id: id,
      doctorName: "BS. Nguyễn Văn A",
      date: "12/02/2026",
      diagnosis: "Viêm họng cấp tính",
      medicines: [
        { id: "m1", name: "Amoxicillin 500mg", quantity: 10, price: 500000, usage: "Sáng 1, chiều 1 sau ăn", image: "https://vcdn1-suckhoe.vnecdn.net/2023/02/03/thuoc-1675399403-1675399415-4654-1675400244.jpg" },
        { id: "m2", name: "Paracetamol 500mg", quantity: 5, price: 200000, usage: "Uống khi sốt trên 38.5 độ", image: "https://vcdn1-suckhoe.vnecdn.net/2023/02/03/thuoc-1675399403-1675399415-4654-1675400244.jpg" }
      ]
    };
    setPrescription(mockData);
  }, [id]);

 const handleBuyAll = () => {
  prescription.medicines.forEach(med => {
    addToCart({
      id: med.id,
      name: med.name,
      price: med.price, // Đảm bảo med.price ở đây là giá đã tăng
      quantity: med.quantity,
      image: med.image || "URL_MAC_DINH"
    });
  });

  toast.success("🛒 Đã thêm đơn thuốc với giá ưu đãi vào giỏ hàng!");
  navigate('/cart');
};
  if (!prescription) return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải đơn thuốc...</div>;

  const total = prescription.medicines.reduce((sum, m) => sum + (m.price * m.quantity), 0);

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <ToastContainer position="top-center" autoClose={1500} theme="colored" />
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#00b894', margin: 0 }}>ĐƠN THUỐC ĐIỆN TỬ</h2>
          <p style={{ color: '#b2bec3' }}>Mã đơn: {prescription.id}</p>
        </div>

        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
          <p style={{ margin: '0 0 8px 0' }}><strong>Bác sĩ:</strong> {prescription.doctorName}</p>
          <p style={{ margin: '0 0 8px 0' }}><strong>Chẩn đoán:</strong> {prescription.diagnosis}</p>
          <p style={{ margin: 0 }}><strong>Ngày kê:</strong> {prescription.date}</p>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px' }}>Danh mục thuốc</h4>
          {prescription.medicines.map(med => (
            <div key={med.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f1f2f6' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#2d3436' }}>{med.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#0984e3', marginTop: '4px' }}>HDSD: {med.usage}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontWeight: 'bold' }}>x{med.quantity}</div>
                <div style={{ color: '#ff4757', fontSize: '0.9rem' }}>{(med.price * med.quantity).toLocaleString()}đ</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '20px', background: '#fff9db', borderRadius: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Tổng tiền đơn thuốc:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ff4757' }}>{total.toLocaleString()}đ</span>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate('/myhealth')} style={secondaryBtnStyle}>Quay lại</button>
          <button onClick={handleBuyAll} style={primaryBtnStyle}>MUA ĐƠN THUỐC NÀY</button>
        </div>
      </div>
    </div>
  );
};

const primaryBtnStyle = { flex: 2, padding: '16px', background: '#00b894', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const secondaryBtnStyle = { flex: 1, padding: '16px', background: 'white', color: '#636e72', border: '1px solid #dfe6e9', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };

export default PrescriptionDetail;