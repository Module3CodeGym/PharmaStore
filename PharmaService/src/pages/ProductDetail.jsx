import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const relatedProducts = [
    { id: 2, name: "Vitamin C 1000mg", price: "120.000đ", img: "/images/vitamin-c.jpg" },
    { id: 5, name: "Nước súc miệng Listerine", price: "95.000đ", img: "/images/listerine.jpg" },
    { id: 4, name: "Khẩu trang N95", price: "25.000đ", img: "/images/khau-trang-n95.jpg" },
    { id: 8, name: "Kem chống nắng Laroche", price: "380.000đ", img: "/images/kcn-laroche.jpg" },
  ];

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <Link to="/products" style={{ textDecoration: 'none', color: '#007bff', display: 'block', marginBottom: '20px', fontWeight: 'bold' }}>
          ← Quay lại danh sách sản phẩm
        </Link>

        {/* --- Phần 1: Thông tin chính sản phẩm --- */}
        <div style={{ 
          display: 'flex', gap: '50px', background: 'white', padding: '40px', 
          borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 450px' }}>
            <div style={{ position: 'relative', textAlign: 'center', background: '#f9f9f9', borderRadius: '15px', padding: '20px' }}>
              <img src="/images/paracetamol.jpg" alt="Product" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#ff4757', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>-23%</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              {["/images/paracetamol.jpg", "/images/vitamin-c.jpg", "/images/omega3.jpg"].map((src, i) => (
                <div key={i} style={{ width: '80px', height: '80px', border: i === 0 ? '2px solid #007bff' : '1px solid #eee', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: '5px', background: 'white' }}>
                  <img src={src} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 500px' }}>
            <nav style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px' }}>Trang chủ / Thuốc / Giảm đau hạ sốt</nav>
            <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}>CHÍNH HÃNG GPP</span>
            <h1 style={{ margin: '15px 0', fontSize: '2.2rem', color: '#2c3e50' }}>Paracetamol Extra Strong - 500mg</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ color: '#ffc107' }}>⭐⭐⭐⭐⭐ <span style={{ color: '#888', fontSize: '0.9rem' }}>(128 đánh giá)</span></div>
              <div style={{ width: '1px', height: '20px', background: '#ddd' }}></div>
              <div style={{ color: '#28a745', fontWeight: 'bold' }}>Đã bán: 1.5k</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '25px' }}>
              <span style={{ fontSize: '2.5rem', color: '#d32f2f', fontWeight: 'bold' }}>50.000đ</span>
              <span style={{ fontSize: '1.4rem', color: '#999', textDecoration: 'line-through' }}>65.000đ</span>
              <span style={{ color: '#666', fontWeight: '500' }}>/ Hộp 3 vỉ x 10 viên</span>
            </div>
            <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '25px' }}>
               <p style={{ marginBottom: '10px' }}><strong>Thương hiệu:</strong> PharmaGlobal (Mỹ)</p>
               <p><strong>Tình trạng:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>Còn hàng</span></p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px' }}>
              <span style={{ fontWeight: 'bold' }}>Số lượng:</span>
              <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={{ padding: '10px 20px', border: 'none', background: '#f8f9fa', cursor: 'pointer' }}>-</button>
                <input type="text" value={quantity} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', fontWeight: 'bold' }} />
                <button onClick={() => setQuantity(q => q+1)} style={{ padding: '10px 20px', border: 'none', background: '#f8f9fa', cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button style={{ flex: 1, padding: '18px', background: '#ff9f43', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>THÊM VÀO GIỎ</button>
              <button style={{ flex: 1, padding: '18px', background: '#007bff', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>MUA NGAY</button>
            </div>
          </div>
        </div>

        {/* --- Phần 2: Tab chi tiết (ĐÃ CẬP NHẬT LOGIC TẠI ĐÂY) --- */}
        <div style={{ marginTop: '40px', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            {[
              { id: 'description', label: 'MÔ TẢ SẢN PHẨM' },
              { id: 'ingredients', label: 'THÀNH PHẦN' },
              { id: 'usage', label: 'HƯỚNG DẪN SỬ DỤNG' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  padding: '20px 40px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer',
                  color: activeTab === tab.id ? '#007bff' : '#666',
                  borderBottom: activeTab === tab.id ? '3px solid #007bff' : '3px solid transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '40px', lineHeight: '1.8', color: '#444' }}>
            {activeTab === 'description' && (
              <div>
                <h3 style={{ color: '#007bff' }}>Thông tin chung</h3>
                <p>Paracetamol Extra Strong là giải pháp hiệu quả cho các cơn đau từ nhẹ đến trung bình. Sản phẩm đạt tiêu chuẩn GPP, an toàn cho người sử dụng.</p>
              </div>
            )}
            {activeTab === 'ingredients' && (
              <div>
                <h3 style={{ color: '#007bff' }}>Thành phần chi tiết</h3>
                <ul>
                  <li>Paracetamol: 500mg</li>
                  <li>Cafein: 65mg</li>
                  <li>Tá dược vừa đủ 1 viên nén.</li>
                </ul>
              </div>
            )}
            {activeTab === 'usage' && (
              <div>
                <h3 style={{ color: '#007bff' }}>Cách dùng an toàn</h3>
                <p><strong>Người lớn:</strong> Uống 1-2 viên mỗi 4-6 giờ. Không quá 8 viên/ngày.</p>
                <p style={{ color: '#d32f2f' }}>* Không sử dụng cho người mẫn cảm với Paracetamol.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- Phần 3: Sản phẩm liên quan --- */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ marginBottom: '30px', borderLeft: '5px solid #007bff', paddingLeft: '15px' }}>Sản phẩm thường mua cùng</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {relatedProducts.map(p => (
              <div key={p.id} style={{ background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid #eee' }}>
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                    <img src={p.img} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <h4 style={{ margin: '10px 0', height: '40px', overflow: 'hidden', fontSize: '0.95rem' }}>{p.name}</h4>
                <p style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '15px' }}>{p.price}</p>
                <button style={{ width: '100%', padding: '10px', border: '1px solid #007bff', color: '#007bff', background: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Xem chi tiết</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;