import React from 'react';

const ProductList = () => {
  // 1. Cập nhật đường dẫn ảnh thực tế từ thư mục public/images/
  const products = [
    { id: 1, name: "Paracetamol 500mg", price: "50.000đ", category: "Thuốc giảm đau", img: "/images/paracetamol.jpg", brand: "PharmaGlobal", stock: true },
    { id: 2, name: "Vitamin C sủi Berry", price: "45.000đ", category: "Thực phẩm chức năng", img: "/images/vitamin-c.jpg", brand: "Plusssz", stock: true },
    { id: 3, name: "Khẩu trang 3D Mask", price: "35.000đ", category: "Chăm sóc cá nhân", img: "/images/khau-trang-n95.jpg", brand: "Pharmacy", stock: true },
    { id: 4, name: "Máy đo huyết áp Omron", price: "1.250.000đ", category: "Thiết bị y tế", img: "/images/may-do-duong-huyet.jpg", brand: "Omron", stock: false },
    { id: 5, name: "Siro ho Prospan", price: "75.000đ", category: "Dược phẩm", img: "/images/thuoc-ho.jpg", brand: "Engelhard", stock: true },
    { id: 6, name: "Kem chống nắng Vichy", price: "480.000đ", category: "Mỹ phẩm", img: "/images/kcn-laroche.jpg", brand: "Vichy", stock: true },
    { id: 7, name: "Dầu cá Omega 3", price: "320.000đ", category: "Thực phẩm chức năng", img: "/images/omega3.jpg", brand: "Nature Made", stock: true },
    { id: 8, name: "Nước súc miệng Listerine", price: "95.000đ", category: "Chăm sóc cá nhân", img: "/images/listerine.jpg", brand: "Listerine", stock: true },
    { id: 9, name: "Bông y tế Bạch Tuyết", price: "15.000đ", category: "Thiết bị y tế", img: "/images/bong-y-te.jpg", brand: "Bạch Tuyết", stock: true },
  ];

  const categories = ["Thuốc giảm đau", "Thuốc kháng sinh", "Thực phẩm chức năng", "Chăm sóc cá nhân", "Thiết bị y tế", "Mỹ phẩm"];

  return (
    <div style={{ display: 'flex', padding: '40px 5%', gap: '40px', backgroundColor: '#f4f7f6' }}>
      
      {/* --- SIDEBAR BỘ LỌC --- */}
      <aside style={{ 
        width: '280px', 
        background: 'white', 
        padding: '25px', 
        borderRadius: '15px', 
        height: 'fit-content', 
        position: 'sticky', 
        top: '100px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2c3e50' }}>
          <i className="fas fa-filter" style={{ color: '#007bff' }}></i> Bộ lọc
        </h3>
        <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />
        
        {/* Lọc theo loại */}
        <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Loại sản phẩm</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map((cat, index) => (
            <label key={index} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input type="checkbox" style={{ marginRight: '10px', width: '16px', height: '16px' }} /> {cat}
            </label>
          ))}
        </div>

        {/* Lọc theo giá */}
        <h4 style={{ margin: '30px 0 15px', fontSize: '1rem' }}>Khoảng giá (VNĐ)</h4>
        <input type="range" min="0" max="5000000" style={{ width: '100%', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginTop: '10px', color: '#666' }}>
          <span>0đ</span>
          <span>5.000.000đ</span>
        </div>
        
        {/* Lọc theo thương hiệu */}
        <h4 style={{ margin: '30px 0 15px', fontSize: '1rem' }}>Thương hiệu</h4>
        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}>
          <option>Tất cả thương hiệu</option>
          <option>PharmaGlobal</option>
          <option>Omron</option>
          <option>Vichy</option>
        </select>
        
        <button style={{ 
          width: '100%', 
          marginTop: '30px', 
          padding: '12px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: '0.3s'
        }}>ÁP DỤNG</button>
      </aside>

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      <main style={{ flex: 1 }}>
        <div style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'white',
          padding: '15px 25px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: '1.4rem' }}>Tìm thấy <strong>{products.length}</strong> sản phẩm</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Sắp xếp:</span>
            <select style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}>
              <option>Mới nhất</option>
              <option>Giá: Thấp đến Cao</option>
              <option>Giá: Cao đến Thấp</option>
              <option>Bán chạy nhất</option>
            </select>
          </div>
        </div>

        {/* Grid Sản phẩm */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          {products.map(product => (
            <div key={product.id} className="product-card" style={{ 
              background: 'white', 
              border: '1px solid #f0f0f0', 
              borderRadius: '15px', 
              padding: '20px', 
              textAlign: 'center',
              transition: '0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Badge trạng thái */}
              <span style={{ 
                position: 'absolute', top: '15px', right: '15px', 
                fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px',
                background: product.stock ? '#e8f5e9' : '#ffebee',
                color: product.stock ? '#2e7d32' : '#c62828',
                fontWeight: 'bold'
              }}>
                {product.stock ? "Còn hàng" : "Hết hàng"}
              </span>

              <img 
                src={product.img} 
                alt={product.name} 
                style={{ width: '100%', height: '180px', objectFit: 'contain', marginBottom: '15px' }} 
                onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=PharmaCare"; }}
              />
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '5px' }}>{product.brand}</p>
              <h4 style={{ margin: '5px 0 15px', height: '45px', overflow: 'hidden', lineHeight: '1.4' }}>{product.name}</h4>
              <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>{product.price}</p>
              
              <button style={{ 
                width: '100%', 
                padding: '10px', 
                background: 'white', 
                border: '1px solid #007bff', 
                color: '#007bff', 
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: product.stock ? 'pointer' : 'not-allowed',
                opacity: product.stock ? 1 : 0.5
              }}>
                {product.stock ? "Xem sản phẩm" : "Liên hệ"}
              </button>
            </div>
          ))}
        </div>

        {/* Phân trang ảo */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '50px' }}>
          {[1, 2, 3].map(num => (
            <button key={num} style={{ 
              width: '40px', height: '40px', borderRadius: '8px', border: '1px solid #ddd',
              background: num === 1 ? '#007bff' : 'white',
              color: num === 1 ? 'white' : '#333',
              cursor: 'pointer', fontWeight: 'bold'
            }}>{num}</button>
          ))}
          <button style={{ padding: '0 15px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Trang sau →</button>
        </div>
      </main>
    </div>
  );
};

export default ProductList;