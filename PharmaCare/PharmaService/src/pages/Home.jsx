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
  // 4. DỮ LIỆU BÁC SĨ THEO CHUYÊN NGÀNH
  const doctors = [
    {
      id: 1,
      name: "BS. Trần Văn A",
      specialty: "Nội tổng quát",
      experience: "10 năm kinh nghiệm",
      rating: 4.8,
      reviews: 124,
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
    },
    {
      id: 2,
      name: "BS. Nguyễn Thị B",
      specialty: "Da liễu",
      experience: "8 năm kinh nghiệm",
      rating: 4.6,
      reviews: 98,
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
    },
    {
      id: 3,
      name: "BS. Lê Văn C",
      specialty: "Tim mạch",
      experience: "12 năm kinh nghiệm",
      rating: 4.9,
      reviews: 210,
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
    },
    {
      id: 4,
      name: "BS. Phạm Thị D",
      specialty: "Nhi khoa",
      experience: "7 năm kinh nghiệm",
      rating: 4.7,
      reviews: 76,
      img: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
    }
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
    // Render sao đánh giá
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const totalStars = 5;

    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "3px" }}>
        {[...Array(totalStars)].map((_, index) => (
          <span
            key={index}
            style={{
              color: index < fullStars ? "#ffc107" : "#e4e5e9",
              fontSize: "16px"
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
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
<section style={{ padding: '60px 5%', textAlign: 'center' }}>
  <h2>Góc Sức Khỏe</h2>
  <p style={{ color: '#666', marginBottom: '40px' }}>Cập nhật kiến thức y khoa hữu ích mỗi ngày</p>
  <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
    {[
      {
        id: 1,
        title: "Cách tăng sức đề kháng trong mùa dịch...",
        desc: "Bác sĩ khuyên bạn nên bổ sung các loại Vitamin cần thiết từ rau củ quả tươi...",
        img: "https://moh.gov.vn/documents/176127/0/13.8.2020++Info-4-5-1-2.jpg/2f126694-d029-474a-80fc-1a4a622a6216?t=1597323404918"
      },
      {
        id: 2,
        title: "Bí quyết ngủ ngon không cần dùng thuốc",
        desc: "Thói quen sinh hoạt và các bài tập nhẹ nhàng giúp bạn cải thiện giấc ngủ sâu hơn...",
        img: "data:image/jpeg;base64,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"
      },
      {
        id: 3,
        title: "Dấu hiệu thiếu hụt canxi ở người lớn tuổi",
        desc: "Nhận biết sớm các biểu hiện tê mỏi chân tay để bổ sung dinh dưỡng kịp thời...",
        img: "data:image/jpeg;base64,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"
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
    {/* SECTION: BÁC SĨ THEO CHUYÊN NGÀNH */}
      <section style={{ padding: '70px 20px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '50px' 
          }}>
            <h2 style={{ 
              borderLeft: '5px solid #007bff', 
              paddingLeft: '15px',
              fontSize: '28px'
            }}>
              Đội Ngũ Bác Sĩ 👨‍⚕️
            </h2>

            <Link 
              to="/appointment" 
              style={{ 
                color: '#007bff', 
                fontWeight: 'bold', 
                textDecoration: 'none' 
              }}
            >
              Đặt lịch ngay →
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '30px' 
          }}>

            {doctors.map(doctor => (
              <div key={doctor.id}
                style={{
                  background: '#ffffff',
                  padding: '30px 20px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                  transition: '0.3s',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                }}
              >

                {/* Badge Online */}
                <span style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#28c76f',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  Online
                </span>

                <img
                  src={doctor.img}
                  alt={doctor.name}
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    marginBottom: '15px',
                    objectFit: 'cover',
                    border: '4px solid #f1f1f1'
                  }}
                />

                <h4 style={{ marginBottom: '6px', fontWeight: '600' }}>
                  {doctor.name}
                </h4>

                <p style={{ 
                  color: '#007bff', 
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {doctor.specialty}
                </p>

                {/* Rating */}
                <div style={{ marginBottom: '8px' }}>
                  {renderStars(doctor.rating)}
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {doctor.rating} ({doctor.reviews} đánh giá)
                  </div>
                </div>

                <p style={{ 
                  fontSize: '14px', 
                  color: '#777', 
                  marginBottom: '18px' 
                }}>
                  {doctor.experience}
                </p>

                <Link to="/appointment" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '10px 25px',
                    background: 'linear-gradient(45deg,#007bff,#00b894)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}>
                    Đặt lịch ngay
                  </button>
                </Link>

              </div>
            ))}
          </div>
        </div>
      </section>


    
    </main>
  );
};

export default Home;