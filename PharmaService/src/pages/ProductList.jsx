import React from 'react';

const ProductList = () => {
  return (
    <div style={{ display: 'flex', padding: '40px 5%', gap: '40px' }}>
      {/* Bộ lọc bên trái */}
      <aside style={{ width: '250px', background: 'white', padding: '20px', borderRadius: '10px', height: 'fit-content', position: 'sticky', top: '100px' }}>
        <h3>Bộ lọc</h3>
        <hr style={{ margin: '15px 0' }} />
        
        <h4 style={{ marginBottom: '10px' }}>Loại thuốc</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label><input type="checkbox" /> Thuốc giảm đau</label>
          <label><input type="checkbox" /> Thuốc kháng sinh</label>
          <label><input type="checkbox" /> Thực phẩm chức năng</label>
          <label><input type="checkbox" /> Chăm sóc cá nhân</label>
        </div>

        <h4 style={{ margin: '25px 0 10px' }}>Khoảng giá</h4>
        <input type="range" style={{ width: '100%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span>0đ</span>
          <span>5.000.000đ</span>
        </div>
        
        <button style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>Áp dụng</button>
      </aside>

      {/* Danh sách bên phải */}
      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <h2>Tất cả sản phẩm</h2>
          <select style={{ padding: '8px', borderRadius: '5px' }}>
            <option>Mặc định</option>
            <option>Giá từ thấp đến cao</option>
            <option>Giá từ cao đến thấp</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ background: 'white', border: '1px solid #eee', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
               <img src="https://via.placeholder.com/150" alt="thuoc" style={{ width: '100%' }} />
               <h4 style={{ margin: '15px 0' }}>Sản phẩm thuốc {i}</h4>
               <p style={{ color: 'red', fontWeight: 'bold' }}>120.000đ</p>
               <button style={{ marginTop: '10px', width: '100%', padding: '8px', background: 'none', border: '1px solid #007bff', color: '#007bff', borderRadius: '5px' }}>Xem sản phẩm</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;