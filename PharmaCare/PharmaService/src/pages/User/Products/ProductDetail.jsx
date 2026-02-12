import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL (VD: /products/3)
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // --- 1. DANH SÁCH TẤT CẢ SẢN PHẨM (Dùng chung với ProductList) ---
  const allProducts = [
    { id: 1, name: "Paracetamol 500mg", price: 50000, oldPrice: 65000, discount: "-23%", category: "Thuốc & Dược phẩm", subcategory: "Giảm đau", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20250613080005-0-P25239.jpg?versionId=9KHZDMjWVuap6VZUff4Qmk2RQ1yCUTJO", brand: "PharmaGlobal", stock: true, rating: 4.8, sold: 1200 },
    { id: 2, name: "Vitamin C sủi Berry", price: 45000, oldPrice: 60000, discount: "-25%", category: "Thực phẩm chức năng", subcategory: "Vitamin & Khoáng chất", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P25904_1.jpg?v=041215", brand: "Plusssz", stock: true, rating: 4.5, sold: 850 },
    { id: 3, name: "Khẩu trang 3D Mask", price: 35000, oldPrice: 45000, discount: "-22%", category: "Chăm sóc cá nhân", subcategory: "Khẩu trang", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20251105100710-0-P28891.png?versionId=2jUzcZGjIogIJxSdM4zZHpjxE9sagd5C", brand: "Pharmacy", stock: true, rating: 4.9, sold: 3000 },
    { id: 4, name: "Máy đo huyết áp Omron", price: 1250000, oldPrice: 1500000, discount: "-16%", category: "Thiết bị y tế", subcategory: "Đo huyết áp", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/20241231034741-1-P26438_1.jpg?versionId=VQAsUewzR_h8icFA_AlpcmVdLgynBXMD", brand: "Omron", stock: false, rating: 4.7, sold: 200 },
    { id: 5, name: "Siro ho Prospan", price: 75000, oldPrice: 90000, discount: "-16%", category: "Thuốc & Dược phẩm", subcategory: "Cảm cúm", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/product/20250627031604-0-P29213_1.jpg?versionId=dFJdKPlBLptaOAkL9oW2XZq6qG7geBiU", brand: "Engelhard", stock: true, rating: 4.6, sold: 1500 },
    { id: 6, name: "Kem chống nắng Vichy", price: 480000, oldPrice: 550000, discount: "-12%", category: "Dược mỹ phẩm", subcategory: "Kem chống nắng", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/20241231034740-1-P07329_1.jpg?versionId=5v2k2vSixObzScBr2TZOzUETovjzib_H", brand: "Vichy", stock: true, rating: 4.8, sold: 600 },
    { id: 7, name: "Dầu cá Omega 3", price: 320000, oldPrice: 400000, discount: "-20%", category: "Thực phẩm chức năng", subcategory: "Dầu cá Omega", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/product/20250418083412-0-P25542.jpg?versionId=x4z.3YTjTq4igCORV7gHetqPhmWqO4Ll", brand: "Nature Made", stock: true, rating: 4.7, sold: 900 },
    { id: 8, name: "Nước súc miệng Listerine", price: 95000, oldPrice: 115000, discount: "-17%", category: "Chăm sóc cá nhân", subcategory: "Tẩu rửa miệng", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20240528093730-0-P17555_1.jpg", brand: "Listerine", stock: true, rating: 4.5, sold: 2200 },
    { id: 9, name: "Bông y tế Bạch Tuyết", price: 15000, oldPrice: 20000, discount: "-25%", category: "Thiết bị y tế", subcategory: "Oxy kế", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20250508080756-0-P10905.png?versionId=f5vjescM5iNX6hrdAJta6WUkSwItBn3w", brand: "Bạch Tuyết", stock: true, rating: 4.9, sold: 5000 },
  ];

  // --- 2. LOGIC TÌM SẢN PHẨM HIỆN TẠI ---
  const product = allProducts.find(p => p.id === parseInt(id));

  // --- 3. LOGIC SẢN PHẨM LIÊN QUAN (Lấy ngẫu nhiên 4 sản phẩm khác sản phẩm hiện tại) ---
  const relatedProducts = allProducts
    .filter(p => p.id !== parseInt(id))
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuantity(1); // Reset số lượng khi đổi sản phẩm
  }, [id]);

  // Nếu không tìm thấy sản phẩm
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>Sản phẩm không tồn tại</h2>
        <Link to="/products">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '40px 5%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <Link to="/products" style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', marginBottom: '20px', fontWeight: '500', fontSize: '0.9rem', gap: '5px' }}>
          <span style={{ fontSize: '1.2rem' }}>‹</span> Quay lại danh sách
        </Link>

        {/* --- Phần 1: Thông tin chính sản phẩm --- */}
        <div style={{ display: 'flex', gap: '40px', background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px', width: '100%' }}>
            <div style={{ position: 'relative', textAlign: 'center', background: 'white', border: '1px solid #eee', borderRadius: '15px', padding: '20px' }}>
              <img src={product.img} alt={product.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#d32f2f', color: 'white', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {product.discount}
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 450px' }}>
            <div style={{ marginBottom: '10px' }}>
               <span style={{ background: '#e3f2fd', color: '#0d47a1', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginRight: '10px' }}>{product.category.toUpperCase()}</span>
               <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '0.9rem' }}>{product.brand}</span>
            </div>
            
            <h1 style={{ margin: '10px 0', fontSize: '1.8rem', color: '#2c3e50', lineHeight: '1.3' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', fontSize: '0.9rem' }}>
              <div style={{ color: '#ffc107' }}>★★★★★ <span style={{ color: '#888' }}>({product.rating})</span></div>
              <div style={{ width: '1px', height: '15px', background: '#ddd' }}></div>
              <div style={{ color: '#666' }}>Đã bán: <strong>{product.sold.toLocaleString()}</strong></div>
            </div>

            <div style={{ background: '#fafafa', padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                <span style={{ fontSize: '2rem', color: '#d32f2f', fontWeight: 'bold', lineHeight: 1 }}>{product.price.toLocaleString()}đ</span>
                <span style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>{product.oldPrice.toLocaleString()}đ</span>
              </div>
              <p style={{ margin: '10px 0 0', color: product.stock ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }}>
                {product.stock ? "✓ Còn hàng" : "✕ Tạm hết hàng"}
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Số lượng:</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} style={{ padding: '10px 15px', border: 'none', background: 'white', cursor: 'pointer', borderRadius: '8px 0 0 8px' }}>-</button>
                <input type="text" value={quantity} readOnly style={{ width: '50px', textAlign: 'center', border: 'none', fontWeight: 'bold' }} />
                <button onClick={() => setQuantity(q => q+1)} style={{ padding: '10px 15px', border: 'none', background: 'white', cursor: 'pointer', borderRadius: '0 8px 8px 0' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <button disabled={!product.stock} style={{ flex: 1, minWidth: '180px', padding: '15px', background: 'white', color: '#d32f2f', border: '1px solid #d32f2f', borderRadius: '10px', fontWeight: 'bold', cursor: product.stock ? 'pointer' : 'not-allowed', opacity: product.stock ? 1 : 0.6 }}>
                THÊM VÀO GIỎ
              </button>
              <button disabled={!product.stock} style={{ flex: 1, minWidth: '180px', padding: '15px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: product.stock ? 'pointer' : 'not-allowed', opacity: product.stock ? 1 : 0.6 }}>
                MUA NGAY
              </button>
            </div>
          </div>
        </div>

        {/* --- Phần 2: Tab chi tiết --- */}
        <div style={{ marginTop: '30px', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            {['description', 'ingredients', 'usage'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '18px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', color: activeTab === t ? '#007bff' : '#888', borderBottom: activeTab === t ? '3px solid #007bff' : '3px solid transparent' }}>
                {t === 'description' ? 'MÔ TẢ' : t === 'ingredients' ? 'THÀNH PHẦN' : 'HƯỚNG DẪN'}
              </button>
            ))}
          </div>
          <div style={{ padding: '30px', lineHeight: '1.8' }}>
            {activeTab === 'description' && (
              <p>{product.name} là sản phẩm chất lượng cao thuộc nhóm {product.category}, được tin dùng bởi hàng triệu khách hàng tại hệ thống Pharmacy toàn quốc.</p>
            )}
            {activeTab === 'ingredients' && <p>Thành phần chi tiết của {product.name} bao gồm các hoạt chất đạt chuẩn dược phẩm quốc tế (GMP), an toàn cho sức khỏe.</p>}
            {activeTab === 'usage' && <p>Sử dụng theo chỉ định của bác sĩ hoặc hướng dẫn trên bao bì. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp.</p>}
          </div>
        </div>

        {/* --- Phần 3: Sản phẩm liên quan --- */}
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '25px' }}>Sản phẩm gợi ý cho bạn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {relatedProducts.map(p => (
              <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} style={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: '15px', padding: '20px', cursor: 'pointer' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'contain', marginBottom: '15px' }} />
                <h4 style={{ fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>{p.name}</h4>
                <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>{p.price.toLocaleString()}đ</p>
                <button style={{ width: '100%', padding: '8px', border: '1px solid #007bff', color: '#007bff', background: 'white', borderRadius: '8px', fontWeight: 'bold' }}>Xem chi tiết</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;