import React, { useState } from 'react';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div style={{ padding: '50px 10%' }}>
      <div style={{ display: 'flex', gap: '60px', background: 'white', padding: '30px', borderRadius: '20px' }}>
        {/* Ảnh lớn bên trái */}
        <div style={{ flex: 1 }}>
          <img src="https://via.placeholder.com/500" alt="Large Medicine" style={{ width: '100%', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }} />
        </div>

        {/* Nội dung bên phải */}
        <div style={{ flex: 1.2 }}>
          <span style={{ color: '#28a745', fontWeight: 'bold' }}>Thương hiệu: PharmaGlobal</span>
          <h1 style={{ margin: '15px 0', fontSize: '2.2rem' }}>Paracetamol Extra Strong - 500mg</h1>
          <p style={{ fontSize: '1.5rem', color: '#d32f2f', fontWeight: 'bold' }}>150.000đ / Hộp 30 viên</p>
          
          <div style={{ margin: '30px 0', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
            <p><strong>Mô tả:</strong> Hỗ trợ giảm đau đầu, đau răng, hạ sốt hiệu quả chỉ sau 15-30 phút sử dụng.</p>
            <p style={{ marginTop: '10px' }}><strong>Liều dùng:</strong> Uống 1 viên sau ăn, ngày tối đa 3 lần. Cách nhau ít nhất 4-6 tiếng.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <span>Số lượng:</span>
            <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '5px' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={{ padding: '10px 15px', border: 'none', background: 'none' }}>-</button>
              <input type="text" value={quantity} readOnly style={{ width: '40px', textAlign: 'center', border: 'none', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc' }} />
              <button onClick={() => setQuantity(q => q+1)} style={{ padding: '10px 15px', border: 'none', background: 'none' }}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={{ flex: 1, padding: '15px', background: '#ff9f43', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>THÊM VÀO GIỎ</button>
            <button style={{ flex: 1, padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>MUA NGAY</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;