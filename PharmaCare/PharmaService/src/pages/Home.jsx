import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

// 1. Import thư viện Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { addToCart } = useCart();

  const categories = [
    { id: 1, name: "Thuốc kê đơn", icon: "💊", color: "#e3f2fd" },
    { id: 2, name: "Thực phẩm chức năng", icon: "🌿", color: "#e8f5e9" },
    { id: 3, name: "Dược mỹ phẩm", icon: "🧴", color: "#fff3e0" },
    { id: 4, name: "Thiết bị y tế", icon: "🌡️", color: "#fce4ec" },
    { id: 5, name: "Chăm sóc cá nhân", icon: "🪥", color: "#f3e5f5" },
    { id: 6, name: "Sản phẩm cho bé", icon: "🍼", color: "#fffde7" },
  ];

  // 2. Dữ liệu sản phẩm (GIỮ NGUYÊN LINK ẢNH CỦA BẠN)
  const bestSellers = [
    { 
      id: 1, 
      name: "Paracetamol 500mg", 
      price: "50.000đ", 
      oldPrice: "65.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20250613080005-0-P25239.jpg?versionId=9KHZDMjWVuap6VZUff4Qmk2RQ1yCUTJO", 
      discount: "-23%" 
    },
    { 
      id: 2, 
      name: "Vitamin C 1000mg", 
      price: "120.000đ", 
      oldPrice: "150.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P25904_1.jpg?v=041215", 
      discount: "-20%" 
    },
    { 
      id: 3, 
      name: "Dầu cá Omega 3", 
      price: "450.000đ", 
      oldPrice: "500.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/product/20250418083412-0-P25542.jpg?versionId=x4z.3YTjTq4igCORV7gHetqPhmWqO4Ll", 
      discount: "-10%" 
    },
    { 
      id: 4, 
      name: "Khẩu trang N95", 
      price: "25.000đ", 
      oldPrice: "30.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20251105100710-0-P28891.png?versionId=2jUzcZGjIogIJxSdM4zZHpjxE9sagd5C", 
      discount: "-16%" 
    },
    { 
      id: 5, 
      name: "Nước súc miệng Listerine", 
      price: "95.000đ", 
      oldPrice: "110.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20240528093730-0-P17555_1.jpg", 
      discount: "-13%" 
    },
    { 
      id: 6, 
      name: "Máy đo đường huyết", 
      price: "850.000đ", 
      oldPrice: "1.000.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/promotion_sku_images/20260131104635-0-P19794.png?versionId=TTphOn6d8hE9S_Y5qRP_pfrozwRgmlXt", 
      discount: "-15%" 
    },
    { 
      id: 7, 
      name: "Sữa bột Pediasure", 
      price: "620.000đ", 
      oldPrice: "680.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/promotion_sku_images/20260131105039-4-P20532.png?versionId=lHdkX2eaY8l9a800UJXU2gsQob0RpKqE", 
      discount: "-8%" 
    },
    { 
      id: 8, 
      name: "Kem chống nắng Laroche", 
      price: "380.000đ", 
      oldPrice: "420.000đ", 
      img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/promotion_sku_images/20260131105039-3-P18815.png?versionId=ByV7EcekA84PH76LPItLFul77GIdmk9U", 
      discount: "-9%" 
    },
  ];

  // 3. SỬA HÀM XỬ LÝ (Dùng Toast thay Alert)
  const handleAddToCart = (e, product) => {
    e.preventDefault(); 
    
    // Chuyển giá từ chuỗi sang số
    const cleanPrice = parseInt(product.price.replace(/\./g, '').replace('đ', ''));
    
    const productToAdd = {
      ...product,
      price: cleanPrice 
    };

    addToCart(productToAdd);
    
    // --- HIỆN TOAST THÔNG BÁO ---
    toast.success(`Đã thêm "${product.name}" vào giỏ!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
    });
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300?text=Sản+Phẩm"; 
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      
      {/* 4. Đặt container chứa Toast ở đây */}
      <ToastContainer />

      <style>
        {`
          .product-link {
            text-decoration: none !important;
            color: inherit !important;
            display: block;
            height: 100%;
          }
          .product-link:hover, .product-link:focus {
            text-decoration: none !important;
            color: inherit !important;
          }
          .add-btn:hover {
            background-color: #d0eaff !important;
            transform: translateY(-2px);
          }
          .add-btn:active {
            transform: translateY(0);
          }
        `}
      </style>
      
      {/* SECTION 1: HERO BANNER */}
      <section 
        style={{ 
          width: '100%',
          backgroundImage: "url('https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2024/1/1/truong-hop-bac-si-duoc-quyen-tu-choi-kham-benh-1704096961139471832464.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          padding: '80px 20px'
        }}
      >
        {/* Overlay trắng mờ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.56)'
        }}></div>

        <div style={{ 
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '50px' 
        }}>
          
          <div style={{ flex: '1 1 500px', textAlign: 'left' }}>
            <span style={{ background: '#007bff', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
              TIÊU CHUẨN GPP QUỐC TẾ
            </span>

            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1a3a5a', margin: '20px 0', lineHeight: '1.2' }}>
              Chăm sóc <span style={{ color: '#007bff' }}>sức khỏe</span> <br/> toàn diện cho bạn
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#5a7184', marginBottom: '30px' }}>
              PharmaStore đồng hành cùng gia đình bạn với đội ngũ dược sĩ chuyên môn cao và sản phẩm chính hãng 100%.
            </p>

            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to="/Appointment" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '15px 40px', 
                  background: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  boxShadow: '0 10px 20px rgba(0, 123, 255, 0.2)' 
                }}>
                  ĐẶT LỊCH NGAY
                </button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: SERVICES */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '40px 5%', flexWrap: 'wrap', background: 'white', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
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

      {/* SECTION 3: CATEGORIES */}
      <section style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Danh Mục Sản Phẩm</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {categories.map(cat => (
            <div key={cat.id} style={{ background: cat.color, padding: '25px 15px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{cat.icon}</div>
              <h4 style={{ fontSize: '0.9rem' }}>{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BEST SELLERS */}
      <section style={{ padding: '60px 20px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
             <h2 style={{ borderLeft: '5px solid #007bff', paddingLeft: '15px' }}>Sản Phẩm Bán Chạy 🔥</h2>
             <Link to="/products" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: '30px' 
          }}>
            {bestSellers.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-link">
                <div style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '15px', 
                  textAlign: 'center', 
                  position: 'relative', 
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#ff4757', color: 'white', padding: '2px 8px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: 'bold' }}>{product.discount}</span>
                  
                  {/* Ảnh sản phẩm dùng link của bạn */}
                  <div style={{ height: '180px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                        onError={handleImageError}
                      />
                  </div>
                  
                  <h4 style={{ marginBottom: '10px', height: '40px', overflow: 'hidden', fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>{product.name}</h4>
                  
                  <div style={{ marginBottom: '15px', marginTop: 'auto' }}>
                    <span style={{ color: '#007bff', fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price}</span>
                    <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '0.9rem', marginLeft: '10px' }}>
                        {product.oldPrice}
                    </span>
                  </div>
                  
                  {/* Nút thêm vào giỏ */}
                  <button 
                    className="add-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      background: '#e3f2fd', 
                      color: '#007bff', 
                      border: 'none', 
                      borderRadius: '8px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      transition: '0.2s'
                    }}
                  >
                    + Thêm vào giỏ
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;