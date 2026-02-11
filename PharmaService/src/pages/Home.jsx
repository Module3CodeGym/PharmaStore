import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();

  // 1. Dữ liệu ảo cho danh mục (Icon/Category)
  const categories = [
  { id: 1, name: "Thuốc & Dược phẩm", icon: "💊", color: "#e3f2fd" },
  { id: 2, name: "Thực phẩm chức năng", icon: "🌿", color: "#e8f5e9" },
  { id: 3, name: "Dược mỹ phẩm", icon: "🧴", color: "#fff3e0" },
  { id: 4, name: "Thiết bị y tế", icon: "🌡️", color: "#fce4ec" },
  { id: 5, name: "Chăm sóc cá nhân", icon: "🪥", color: "#f3e5f5" },
  { id: 6, name: "Sản phẩm cho bé", icon: "🍼", color: "#fffde7" },
];


  // 2. Dữ liệu ảo cho sản phẩm bán chạy (8 sản phẩm)
  const bestSellers = [
  { id: 1, name: "Paracetamol 500mg", price: "50.000đ", oldPrice: "65.000đ", img: "/images/paracetamol.jpg", discount: "-23%" },
  { id: 2, name: "Vitamin C 1000mg", price: "120.000đ", oldPrice: "150.000đ", img: "/images/vitamin-c.jpg", discount: "-20%" },
  { id: 3, name: "Dầu cá Omega 3", price: "450.000đ", oldPrice: "500.000đ", img: "/images/omega3.jpg", discount: "-10%" },
  { id: 4, name: "Khẩu trang N95", price: "25.000đ", oldPrice: "30.000đ", img: "/images/khau-trang-n95.jpg", discount: "-16%" },
  { id: 5, name: "Nước súc miệng Listerine", price: "95.000đ", oldPrice: "110.000đ", img: "/images/listerine.jpg", discount: "-13%" },
  { id: 6, name: "Máy đo đường huyết", price: "850.000đ", oldPrice: "1.000.000đ", img: "/images/may-do-duong-huyet.jpg", discount: "-15%" },
  { id: 7, name: "Sữa bột Pediasure", price: "620.000đ", oldPrice: "680.000đ", img: "/images/sua-pediasure.jpg", discount: "-8%" },
  { id: 8, name: "Kem chống nắng Laroche Posay", price: "380.000đ", oldPrice: "420.000đ", img: "/images/kcn-laroche.jpg", discount: "-9%" },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      
{/* --- SECTION 1: HERO BANNER --- */}
<section style={{ width: '100%', overflow: 'hidden' }}>
  <div style={{ 
    background: 'linear-gradient(135deg, #a5c9f3 0%, #dae9f9 100%)', 
    padding: '60px 5%', 
    display: 'flex',
    flexDirection: 'column', // Chuyển sang cột để xếp chữ và ảnh theo chiều dọc
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '650px', 
    position: 'relative',
    textAlign: 'center' // Căn giữa toàn bộ chữ
  }}>
    
    {/* Vòng tròn trang trí mờ phía sau */}
    <div style={{ 
      position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
      width: '500px', height: '500px', background: 'rgba(255,255,255,0.2)', 
      borderRadius: '50%', zIndex: 0 
    }}></div>

    {/* PHẦN CHỮ: Nằm ngang phía trên */}
    <div style={{ zIndex: 2, maxWidth: '900px', marginBottom: '40px' }}>
      <div style={{ 
        display: 'inline-block',
        background: '#007bff', color: 'white',
        padding: '5px 20px', borderRadius: '50px', 
        fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '20px'
      }}>
        TIÊU CHUẨN GPP QUỐC TẾ
      </div>

      <h1 style={{ 
        fontSize: '3.5rem', fontWeight: '900', color: '#1a3a5a',
        margin: '0 0 20px 0', lineHeight: '1.2'
      }}>
        Chăm sóc <span style={{ color: '#007bff' }}>sức khỏe</span> người thân
      </h1>

      <p style={{ fontSize: '1.2rem', color: '#5a7184', maxWidth: '700px', margin: '0 auto 30px' }}>
        PharmaCare đồng hành cùng gia đình bạn với đội ngũ dược sĩ chuyên môn cao và sản phẩm chính hãng 100%. Dàn đều dịch vụ chăm sóc tận tâm nhất.
      </p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <button style={{ 
          padding: '15px 40px', background: '#007bff', color: 'white',
          border: 'none', borderRadius: '8px', fontWeight: 'bold', 
          cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(0,123,255,0.2)'
        }}>
          KHÁM PHÁ NGAY
        </button>
        <button style={{ 
          padding: '15px 40px', background: 'white', color: '#007bff',
          border: '2px solid #007bff', borderRadius: '8px', fontWeight: 'bold', 
          cursor: 'pointer', fontSize: '1.1rem'
        }}>
          TƯ VẤN BÁC SĨ
        </button>
      </div>
    </div>

    {/* PHẦN ẢNH: Nằm ở giữa, dàn đều nội dung 2 bên (nếu có card sản phẩm) */}
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-end', 
      justifyContent: 'center', 
      width: '100%', 
      zIndex: 2,
      gap: '50px' // Khoảng cách để dàn đều 2 bên ảnh
    }}>
      
      {/* Bạn có thể thêm Card sản phẩm bên trái ảnh ở đây nếu muốn giống mẫu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '50px' }}>
         {/* Card trái... */}
      </div>

      <img 
        src="/images/bacsi.jpg" 
        alt="Bác sĩ" 
        style={{ 
          height: '450px', 
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))'
        }} 
        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1559839734-2b71f1536783?q=80&w=800"; }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '50px' }}>
         {/* Card phải... */}
      </div>
    </div>
  </div>
</section>

      {/* --- SECTION 2: SERVICES COMMITMENT --- */}
      <section style={{ display: 'flex', justifyContent: 'space-around', padding: '40px 5%', background: 'white', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#007bff' }}>🚚 MIỄN PHÍ VẬN CHUYỂN</h4>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Cho đơn hàng từ 300.000đ</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#007bff' }}>🛡️ 100% CHÍNH HÃNG</h4>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Kiểm tra thuốc trước khi nhận</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#007bff' }}>👩‍⚕️ TƯ VẤN TẬN TÂM</h4>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Đội ngũ bác sĩ giàu kinh nghiệm</p>
        </div>
      </section>

      {/* --- SECTION 3: CATEGORIES GRID --- */}
      <section style={{ padding: '60px 5%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Danh Mục Sản Phẩm</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px' }}>
          {categories.map(cat => (
  <div
    key={cat.id}
    onClick={() =>
      navigate("/products", {
        state: { category: cat.name }
      })
    }
    style={{
      background: cat.color,
      padding: '25px 15px',
      borderRadius: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
      {cat.icon}
    </div>
    <h4 style={{ fontSize: '0.9rem' }}>{cat.name}</h4>
  </div>
))}

        </div>
      </section>

      {/* --- SECTION 4: BEST SELLERS --- */}
      <section style={{ padding: '40px 5%', background: '#f8f9fa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ borderLeft: '5px solid #007bff', paddingLeft: '15px' }}>Sản Phẩm Bán Chạy</h2>
          <a href="/products" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Xem tất cả →</a>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
          {bestSellers.map(product => (
            <div key={product.id} className="product-card" style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '15px', 
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
            }}>
              <span style={{ 
                position: 'absolute', top: '10px', left: '10px', 
                background: '#ff4757', color: 'white', padding: '2px 8px', 
                borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' 
              }}>{product.discount}</span>
              
              <img src={product.img} alt={product.name} style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} />
              <h4 style={{ marginBottom: '10px', height: '40px', overflow: 'hidden' }}>{product.name}</h4>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price}</span>
                <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.9rem', marginLeft: '10px' }}>{product.oldPrice}</span>
              </div>
              
              <button style={{ 
                width: '100%', padding: '10px', 
                background: '#007bff', color: 'white', 
                border: 'none', borderRadius: '8px', 
                fontWeight: 'bold', cursor: 'pointer' 
              }}>Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION 5: HEALTH NEWS (BONUS) --- */}
<section style={{ padding: '60px 5%', textAlign: 'center' }}>
  <h2>Góc Sức Khỏe</h2>
  <p style={{ color: '#666', marginBottom: '40px' }}>Cập nhật kiến thức y khoa hữu ích mỗi ngày</p>
  <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
    {[
      {
        id: 1,
        title: "Cách tăng sức đề kháng trong mùa dịch...",
        desc: "Bác sĩ khuyên bạn nên bổ sung các loại Vitamin cần thiết từ rau củ quả tươi...",
        img: "/images/news-1.jpg"
      },
      {
        id: 2,
        title: "Bí quyết ngủ ngon không cần dùng thuốc",
        desc: "Thói quen sinh hoạt và các bài tập nhẹ nhàng giúp bạn cải thiện giấc ngủ sâu hơn...",
        img: "/images/news-2.jpg"
      },
      {
        id: 3,
        title: "Dấu hiệu thiếu hụt canxi ở người lớn tuổi",
        desc: "Nhận biết sớm các biểu hiện tê mỏi chân tay để bổ sung dinh dưỡng kịp thời...",
        img: "/images/news-3.jpg"
      }
    ].map(item => (
      <div key={item.id} style={{ 
        width: '300px', 
        textAlign: 'left', 
        background: 'white', 
        borderRadius: '15px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s'
      }}>
        {/* Phần hiển thị ảnh thực tế */}
        <div style={{ height: '180px', overflow: 'hidden' }}>
          <img 
            src={item.img} 
            alt={item.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x180?text=Health+News"; }} // Dự phòng nếu ảnh lỗi
          />
        </div>
        
        <div style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#2c3e50', lineHeight: '1.4' }}>{item.title}</h4>
          <p style={{ fontSize: '0.85rem', color: '#777', height: '45px', overflow: 'hidden' }}>{item.desc}</p>
          <button style={{ 
            marginTop: '15px', 
            color: '#007bff', 
            border: 'none', 
            background: 'none', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            padding: 0
          }}>Đọc tiếp →</button>
        </div>
      </div>
    ))}
  </div>
</section>

    </main>
  );
};

export default Home;