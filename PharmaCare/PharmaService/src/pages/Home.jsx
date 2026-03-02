import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebaseConfig'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';

// Import thư viện Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [realDoctors, setRealDoctors] = useState([]); 

  const searchQuery = searchParams.get('s') || "";
  const categoryFilter = searchParams.get('cat') || "";

  // 1. Lấy dữ liệu Bác sĩ thời gian thực từ Firestore
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "doctor"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setRealDoctors(data);
    }, (error) => {
      console.error("Lỗi lấy dữ liệu bác sĩ:", error);
    });
    
    return () => unsubscribe();
  }, []);

  const handleCategoryClick = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryFilter === categoryName) {
      newParams.delete('cat');
    } else {
      newParams.set('cat', categoryName);
    }
    setSearchParams(newParams);
  };

  // --- MOCK DATA SẢN PHẨM ---
  const categories = [
    { id: 1, name: "Thuốc kê đơn", icon: "💊", color: "#e3f2fd" },
    { id: 2, name: "Thực phẩm chức năng", icon: "🌿", color: "#e8f5e9" },
    { id: 3, name: "Dược mỹ phẩm", icon: "🧴", color: "#fff3e0" },
    { id: 4, name: "Thiết bị y tế", icon: "🌡️", color: "#fce4ec" },
    { id: 5, name: "Chăm sóc cá nhân", icon: "🪥", color: "#f3e5f5" },
    { id: 6, name: "Sản phẩm cho bé", icon: "🍼", color: "#fffde7" },
  ];

  const bestSellers = [
    { id: 1, name: "Paracetamol 500mg", price: "50.000đ", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20250613080005-0-P25239.jpg?versionId=9KHZDMjWVuap6VZUff4Qmk2RQ1yCUTJO", category: "Thuốc kê đơn" },
    { id: 2, name: "Vitamin C 1000mg", price: "120.000đ", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P25904_1.jpg?v=041215", category: "Thực phẩm chức năng" },
    { id: 3, name: "Dầu cá Omega 3", price: "450.000đ", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/product/20250418083412-0-P25542.jpg?versionId=x4z.3YTjTq4igCORV7gHetqPhmWqO4Ll", category: "Thực phẩm chức năng" },
    { id: 4, name: "Khẩu trang N95", price: "25.000đ", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20251105100710-0-P28891.png?versionId=2jUzcZGjIogIJxSdM4zZHpjxE9sagd5C", category: "Thiết bị y tế" }
  ];

  const filteredProducts = bestSellers.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    const cleanPrice = parseInt(product.price.replace(/\./g, '').replace('đ', '')) || 0;
    addToCart({ ...product, price: cleanPrice });
    toast.success(`Đã thêm "${product.name}" vào giỏ!`);
  };

  // --- LOGIC HIỂN THỊ SAO ĐÁNH GIÁ THỜI GIAN THỰC ---
  const renderStars = (rating) => {
    const numericRating = Math.min(5, Math.max(0, Number(rating) || 0));
    const fullStars = Math.floor(numericRating);
    
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "3px", alignItems: "center" }}>
        {[...Array(5)].map((_, index) => (
          <span key={index} style={{ 
            color: index < fullStars ? "#ffc107" : "#e4e5e9", 
            fontSize: "18px" 
          }}>★</span>
        ))}
        <span style={{ marginLeft: '5px', fontWeight: 'bold', color: '#2d3436', fontSize: '0.9rem' }}>
          {numericRating > 0 ? numericRating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* HERO SECTION */}
      <section style={heroSectionStyle}>
        <div style={overlayStyle}></div>
        <div style={heroContentStyle}>
          <h1 style={{ fontSize: '3rem', color: '#1a3a5a' }}>Chăm sóc <span style={{ color: '#007bff' }}>sức khỏe</span> toàn diện</h1>
          <p style={{ fontSize: '1.2rem', color: '#5a7184', marginBottom: '30px' }}>PharmaStore - Đồng hành cùng gia đình bạn mỗi ngày.</p>
          <Link to="/appointment">
            <button style={btnAppointmentStyle}>ĐẶT LỊCH KHÁM NGAY</button>
          </Link>
        </div>
      </section>

      {/* DANH MỤC */}
      <section style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '30px', color: '#2d3436' }}>Danh Mục Sản Phẩm</h2>
        <div style={categoryGridStyle}>
          {categories.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.name)} 
              style={{ 
                ...categoryCardStyle, 
                background: cat.color,
                border: categoryFilter === cat.name ? '2px solid #007bff' : '2px solid transparent' 
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{cat.icon}</div>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DANH SÁCH BÁC SĨ THỰC TẾ */}
      <section style={{ padding: '60px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={sectionHeaderStyle}>Đội Ngũ Bác Sĩ Chuyên Khoa👨‍⚕️</h2>
          <div style={doctorGridStyle}>
            {realDoctors.map(doctor => (
              <div key={doctor.id} style={doctorCardStyle}>
                <img 
                  src={doctor.photoURL || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                  style={doctorAvatarStyle} 
                  alt={doctor.displayName || "Bác sĩ"}
                />
                <h4 style={{ margin: '0', color: '#2d3436' }}>{doctor.displayName || "Bác sĩ chuyên khoa"}</h4>
                <p style={{ color: '#007bff', fontWeight: 'bold', margin: '5px 0' }}>{doctor.specialty || "Đa khoa"}</p>
                
                {/* Khu vực hiển thị Rating */}
                <div style={{ margin: '15px 0' }}>
                  {renderStars(doctor.rating)}
                  <span style={{ fontSize: '13px', color: '#636e72' }}>
                    {doctor.reviewCount > 0 ? `(${doctor.reviewCount} đánh giá)` : "(Chưa có đánh giá)"}
                  </span>
                </div>

                <Link to={`/appointment?doctorId=${doctor.id}&doctorName=${encodeURIComponent(doctor.displayName || "Bác sĩ")}&specialty=${encodeURIComponent(doctor.specialty || "Đa khoa")}`} style={{ textDecoration: 'none' }}>
                  <button style={btnBookStyle}>Đặt lịch khám</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SẢN PHẨM BÁN CHẠY */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '30px' }}>Sản Phẩm Bán Chạy 🔥</h2>
          <div style={productGridStyle}>
            {filteredProducts.map(product => (
              <div key={product.id} style={productCardStyle}>
                <img src={product.img} style={productImgStyle} alt={product.name} />
                <h4 style={productNameStyle}>{product.name}</h4>
                <p style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '15px' }}>{product.price}</p>
                <button onClick={(e) => handleAddToCart(e, product)} style={btnCartStyle}>+ Thêm vào giỏ</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

// --- STYLES ---
const heroSectionStyle = { width: '100%', backgroundImage: "url('https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/640/324455921873985536/2024/1/1/truong-hop-bac-si-duoc-quyen-tu-choi-kham-benh-1704096961139471832464.png')", backgroundSize: 'cover', backgroundPosition: 'center', padding: '100px 20px', position: 'relative' };
const overlayStyle = { position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.7)' };
const heroContentStyle = { position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto', textAlign: 'center' };
const btnAppointmentStyle = { padding: '18px 45px', background: 'linear-gradient(45deg, #007bff, #00b894)', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,123,255,0.3)' };
const categoryGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' };
const categoryCardStyle = { padding: '25px', borderRadius: '20px', cursor: 'pointer', transition: 'transform 0.2s', textAlign: 'center' };
const doctorGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' };
const doctorCardStyle = { background: '#f8f9fa', padding: '30px', borderRadius: '25px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const doctorAvatarStyle = { width: '110px', height: '110px', borderRadius: '50%', marginBottom: '15px', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', objectFit: 'cover' };
const sectionHeaderStyle = { borderLeft: '6px solid #007bff', paddingLeft: '15px', marginBottom: '40px', color: '#1a3a5a' };
const btnBookStyle = { width: '100%', padding: '12px', background: 'white', color: '#007bff', border: '2px solid #007bff', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' };
const productGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '25px' };
const productCardStyle = { background: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f1f1' };
const productImgStyle = { width: '100%', height: '160px', objectFit: 'contain', marginBottom: '15px' };
const productNameStyle = { fontSize: '0.95rem', height: '45px', overflow: 'hidden', marginBottom: '10px', color: '#2d3436' };
const btnCartStyle = { width: '100%', padding: '10px', background: '#e3f2fd', color: '#007bff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default Home;