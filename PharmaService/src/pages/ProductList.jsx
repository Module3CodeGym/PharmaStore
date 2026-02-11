import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProductList = () => {
  const location = useLocation();
  
  // --- DỮ LIỆU SẢN PHẨM (Giá đã chuẩn hóa thành số) ---
  const products = [
    { id: 1, name: "Paracetamol 500mg", price: 50000, category: "Thuốc & Dược phẩm", subcategory: "Giảm đau", img: "/images/paracetamol.jpg", brand: "PharmaGlobal", stock: true },
    { id: 2, name: "Vitamin C sủi Berry", price: 45000, category: "Thực phẩm chức năng", subcategory: "Vitamin & Khoáng chất", img: "/images/vitamin-c.jpg", brand: "Plusssz", stock: true },
    { id: 3, name: "Khẩu trang 3D Mask", price: 35000, category: "Chăm sóc cá nhân", subcategory: "Khẩu trang", img: "/images/khau-trang-n95.jpg", brand: "Pharmacy", stock: true },
    { id: 4, name: "Máy đo huyết áp Omron", price: 1250000, category: "Thiết bị y tế", subcategory: "Đo huyết áp", img: "/images/may-do-duong-huyet.jpg", brand: "Omron", stock: false },
    { id: 5, name: "Siro ho Prospan", price: 75000, category: "Thuốc & Dược phẩm", subcategory: "Cảm cúm", img: "/images/thuoc-ho.jpg", brand: "Engelhard", stock: true },
    { id: 6, name: "Kem chống nắng Vichy", price: 480000, category: "Dược mỹ phẩm", subcategory: "Kem chống nắng", img: "/images/kcn-laroche.jpg", brand: "Vichy", stock: true },
    { id: 7, name: "Dầu cá Omega 3", price: 320000, category: "Thực phẩm chức năng", subcategory: "Dầu cá Omega", img: "/images/omega3.jpg", brand: "Nature Made", stock: true },
    { id: 8, name: "Nước súc miệng Listerine", price: 95000, category: "Chăm sóc cá nhân", subcategory: "Tẩu rửa miệng", img: "/images/listerine.jpg", brand: "Listerine", stock: true },
    { id: 9, name: "Bông y tế Bạch Tuyết", price: 15000, category: "Thiết bị y tế", subcategory: "Oxy kế", img: "/images/bong-y-te.jpg", brand: "Bạch Tuyết", stock: true },
  ];

  // Dữ liệu danh mục với chức năng con
  const categoriesWithSubcategories = [
    { 
      name: "Thuốc & Dược phẩm",
      subcategories: ["Giảm đau", "Cảm cúm", "Tiêu hóa", "Kháng sinh", "Chống viêm"]
    },
    { 
      name: "Thực phẩm chức năng",
      subcategories: ["Vitamin & Khoáng chất", "Dầu cá Omega", "Hỗ trợ xương khớp", "Tăng sức đề kháng"]
    },
    { 
      name: "Dược mỹ phẩm",
      subcategories: ["Kem chống nắng", "Serum & Tinh chất", "Toner & Nước hoa hồng", "Mặt nạ"]
    },
    { 
      name: "Thiết bị y tế",
      subcategories: ["Đo huyết áp", "Nhiệt kế", "Oxy kế", "Máy massage"]
    },
    { 
      name: "Chăm sóc cá nhân",
      subcategories: ["Kem đánh răng", "Tẩu rửa miệng", "Chăm sóc da", "Khẩu trang"]
    },
    { 
      name: "Sản phẩm cho bé",
      subcategories: ["Sữa bột", "Sơ sinh", "Chăm sóc bé", "Luyện tập"]
    },
  ];

  const categories = categoriesWithSubcategories.map(c => c.name);
  const brands = ["Tất cả thương hiệu", "PharmaGlobal", "Omron", "Vichy", "Plusssz", "Nature Made", "Listerine"];

  // --- CÁC PHỄU LỌC (STATE) ---
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả thương hiệu");
  const [sortOrder, setSortOrder] = useState("Mới nhất");

  // Lấy danh sách chức năng con của các danh mục được chọn
  const getSubcategoriesForSelectedCategories = () => {
    if (selectedCategories.length === 0) return [];
    const subcats = new Set();
    selectedCategories.forEach(cat => {
      const catData = categoriesWithSubcategories.find(c => c.name === cat);
      if (catData) {
        catData.subcategories.forEach(sub => subcats.add(sub));
      }
    });
    return Array.from(subcats);
  };

  // Cập nhật filter khi category từ Home được truyền
  useEffect(() => {
  // Nếu có category truyền từ Home
  if (location.state?.category) {
    setSelectedCategories([location.state.category]);
  }

  // Scroll lên đầu trang
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}, [location.state]);


  // Hàm xử lý checkbox danh mục
  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(item => item !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Hàm xử lý checkbox chức năng con
  const handleSubcategoryChange = (subcat) => {
    if (selectedSubcategories.includes(subcat)) {
      setSelectedSubcategories(selectedSubcategories.filter(item => item !== subcat));
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcat]);
    }
  };

  // --- LOGIC LỌC & SẮP XẾP TỔNG HỢP ---
  const filteredProducts = products
    .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category))
    .filter(p => selectedSubcategories.length === 0 || selectedSubcategories.includes(p.subcategory))
    .filter(p => p.price <= maxPrice)
    .filter(p => selectedBrand === "Tất cả thương hiệu" || p.brand === selectedBrand)
    .sort((a, b) => {
      if (sortOrder === "Giá: Thấp đến Cao") return a.price - b.price;
      if (sortOrder === "Giá: Cao đến Thấp") return b.price - a.price;
      return 0;
    });

  const availableSubcategories = getSubcategoriesForSelectedCategories();

  return (
    <div style={{ display: 'flex', padding: '40px 5%', gap: '40px', backgroundColor: '#f4f7f6' }}>
      
      {/* --- SIDEBAR BỘ LỌC --- */}
      <aside style={{ width: '280px', background: 'white', padding: '25px', borderRadius: '15px', height: 'fit-content', position: 'sticky', top: '100px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2c3e50' }}>Bộ lọc</h3>
        <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />
        
        {/* Lọc theo loại */}
        <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Danh mục sản phẩm</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {categories.map((cat, index) => (
            <label key={index} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.95rem' }}>
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                style={{ marginRight: '10px', width: '16px', height: '16px' }} 
              /> 
              <strong>{cat}</strong>
            </label>
          ))}
        </div>

        {/* Lọc theo chức năng con */}
        {availableSubcategories.length > 0 && (
          <>
            <h4 style={{ marginBottom: '15px', fontSize: '1rem' }}>Chức năng</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', paddingLeft: '15px', borderLeft: '3px solid #007bff' }}>
              {availableSubcategories.map((subcat, index) => (
                <label key={index} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedSubcategories.includes(subcat)}
                    onChange={() => handleSubcategoryChange(subcat)}
                    style={{ marginRight: '10px', width: '16px', height: '16px' }} 
                  /> 
                  {subcat}
                </label>
              ))}
            </div>
          </>
        )}

        {/* Lọc theo giá - ĐÃ ĐIỀU CHỈNH THEO Ý BẠN */}
        <h4 style={{ margin: '30px 0 15px', fontSize: '1rem' }}>Khoảng giá (VNĐ)</h4>
        
        {/* Ô nhập số trực tiếp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
          <input 
            type="number" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #007bff', outline: 'none' }}
            placeholder="Nhập giá tối đa..."
          />
          <span style={{ fontWeight: 'bold', color: '#007bff' }}>đ</span>
        </div>

        {/* Thanh kéo điều chỉnh (Giới hạn 500k để nhạy hơn với thuốc giá rẻ) */}
        <input 
          type="range" min="0" max="500000" step="5000"
          value={maxPrice > 500000 ? 500000 : maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }} 
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '5px', color: '#666' }}>
          <span>0đ</span>
          <span>500.000đ+</span>
        </div>
        
        {/* Lọc theo thương hiệu */}
        <h4 style={{ margin: '30px 0 15px', fontSize: '1rem' }}>Thương hiệu</h4>
        <select 
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
        >
          {brands.map((brand, index) => (
            <option key={index} value={brand}>{brand}</option>
          ))}
        </select>
        
        {/* Nút reset bộ lọc nhanh */}
        <button 
          onClick={() => { setSelectedCategories([]); setSelectedSubcategories([]); setMaxPrice(1500000); setSelectedBrand("Tất cả thương hiệu"); }}
          style={{ width: '100%', marginTop: '30px', padding: '12px', background: '#f8f9fa', color: '#666', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          XÓA TẤT CẢ
        </button>
      </aside>

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Sắp xếp:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option>Mới nhất</option>
              <option>Giá: Thấp đến Cao</option>
              <option>Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>

        {/* Grid Sản phẩm */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card" style={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: '15px', padding: '20px', textAlign: 'center', position: 'relative' }}>
              <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: product.stock ? '#e8f5e9' : '#ffebee', color: product.stock ? '#2e7d32' : '#c62828', fontWeight: 'bold' }}>
                {product.stock ? "Còn hàng" : "Hết hàng"}
              </span>

              <img src={product.img} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'contain', marginBottom: '15px' }} />
              <p style={{ color: '#888', fontSize: '0.85rem' }}>{product.brand}</p>
              <h4 style={{ margin: '5px 0 15px', height: '45px', overflow: 'hidden' }}>{product.name}</h4>
              <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.2rem' }}>{product.price.toLocaleString()}đ</p>
              
              <button style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid #007bff', color: '#007bff', borderRadius: '8px', fontWeight: 'bold', opacity: product.stock ? 1 : 0.5 }}>
                {product.stock ? "Xem sản phẩm" : "Liên hệ"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;