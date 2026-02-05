import React from 'react';

const Home = () => {
  return (
    <main style={{ padding: '20px 5%', minHeight: '60vh' }}>
      <section className="hero-banner" style={{ background: '#e3f2fd', padding: '50px', borderRadius: '15px', textAlign: 'center' }}>
        <h1>Chào mừng đến với PharmaStore</h1>
        <p>Chăm sóc sức khỏe gia đình bạn là sứ mệnh của chúng tôi.</p>
        <button style={{ padding: '10px 25px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Mua ngay
        </button>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Sản phẩm nổi bật</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {/* Đây là nơi bạn sẽ map danh sách sản phẩm sau này */}
          <div className="product-card" style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'center' }}>
            <div style={{ height: '150px', background: '#eee', marginBottom: '10px' }}>Ảnh thuốc</div>
            <h4>Paracetamol 500mg</h4>
            <p style={{ color: 'red', fontWeight: 'bold' }}>50.000đ</p>
            <button>Thêm vào giỏ</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;