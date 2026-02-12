import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- DỮ LIỆU SẢN PHẨM ---
  const products = [
    { id: 1, name: "Paracetamol 500mg", price: 50000, category: "Thuốc & Dược phẩm", subcategory: "Giảm đau", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20250613080005-0-P25239.jpg?versionId=9KHZDMjWVuap6VZUff4Qmk2RQ1yCUTJO", brand: "PharmaGlobal", stock: true },
    { id: 2, name: "Vitamin C sủi Berry", price: 45000, category: "Thực phẩm chức năng", subcategory: "Vitamin & Khoáng chất", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/P25904_1.jpg?v=041215", brand: "Plusssz", stock: true },
    { id: 3, name: "Khẩu trang 3D Mask", price: 35000, category: "Chăm sóc cá nhân", subcategory: "Khẩu trang", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20251105100710-0-P28891.png?versionId=2jUzcZGjIogIJxSdM4zZHpjxE9sagd5C", brand: "Pharmacy", stock: true },
    { id: 4, name: "Máy đo huyết áp Omron", price: 1250000, category: "Thiết bị y tế", subcategory: "Đo huyết áp", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/20241231034741-1-P26438_1.jpg?versionId=VQAsUewzR_h8icFA_AlpcmVdLgynBXMD", brand: "Omron", stock: false },
    { id: 5, name: "Siro ho Prospan", price: 75000, category: "Thuốc & Dược phẩm", subcategory: "Cảm cúm", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/product/20250627031604-0-P29213_1.jpg?versionId=dFJdKPlBLptaOAkL9oW2XZq6qG7geBiU", brand: "Engelhard", stock: true },
    { id: 6, name: "Kem chống nắng Vichy", price: 480000, category: "Dược mỹ phẩm", subcategory: "Kem chống nắng", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/ecommerce/20241231034740-1-P07329_1.jpg?versionId=5v2k2vSixObzScBr2TZOzUETovjzib_H", brand: "Vichy", stock: true },
    { id: 7, name: "Dầu cá Omega 3", price: 320000, category: "Thực phẩm chức năng", subcategory: "Dầu cá Omega", img: "https://production-cdn.pharmacity.io/digital/1080x1080/plain/e-com/images/product/20250418083412-0-P25542.jpg?versionId=x4z.3YTjTq4igCORV7gHetqPhmWqO4Ll", brand: "Nature Made", stock: true },
    { id: 8, name: "Nước súc miệng Listerine", price: 95000, category: "Chăm sóc cá nhân", subcategory: "Tẩu rửa miệng", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20240528093730-0-P17555_1.jpg", brand: "Listerine", stock: true },
    { id: 9, name: "Bông y tế Bạch Tuyết", price: 15000, category: "Thiết bị y tế", subcategory: "Oxy kế", img: "https://production-cdn.pharmacity.io/digital/425x425/plain/e-com/images/ecommerce/20250508080756-0-P10905.png?versionId=f5vjescM5iNX6hrdAJta6WUkSwItBn3w", brand: "Bạch Tuyết", stock: true },
  ];

  const categoriesWithSubcategories = [
    { name: "Thuốc & Dược phẩm", subcategories: ["Giảm đau", "Cảm cúm", "Tiêu hóa", "Kháng sinh", "Chống viêm"] },
    { name: "Thực phẩm chức năng", subcategories: ["Vitamin & Khoáng chất", "Dầu cá Omega", "Hỗ trợ xương khớp", "Tăng sức đề kháng"] },
    { name: "Dược mỹ phẩm", subcategories: ["Kem chống nắng", "Serum & Tinh chất", "Toner & Nước hoa hồng", "Mặt nạ"] },
    { name: "Thiết bị y tế", subcategories: ["Đo huyết áp", "Nhiệt kế", "Oxy kế", "Máy massage"] },
    { name: "Chăm sóc cá nhân", subcategories: ["Kem đánh răng", "Tẩu rửa miệng", "Chăm sóc da", "Khẩu trang"] },
    { name: "Sản phẩm cho bé", subcategories: ["Sữa bột", "Sơ sinh", "Chăm sóc bé", "Luyện tập"] },
  ];

  const categories = categoriesWithSubcategories.map(c => c.name);
  const brands = ["Tất cả thương hiệu", "PharmaGlobal", "Omron", "Vichy", "Plusssz", "Nature Made", "Listerine"];

  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [selectedBrand, setSelectedBrand] = useState("Tất cả thương hiệu");
  const [sortOrder, setSortOrder] = useState("Mới nhất");

  const getSubcategoriesForSelectedCategories = () => {
    if (selectedCategories.length === 0) return [];
    const subcats = new Set();
    selectedCategories.forEach(cat => {
      const catData = categoriesWithSubcategories.find(c => c.name === cat);
      if (catData) catData.subcategories.forEach(sub => subcats.add(sub));
    });
    return Array.from(subcats);
  };

  useEffect(() => {
    if (location.state?.category) setSelectedCategories([location.state.category]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.state]);

  const handleCategoryChange = (cat) => {
    if (selectedCategories.includes(cat)) setSelectedCategories(selectedCategories.filter(item => item !== cat));
    else setSelectedCategories([...selectedCategories, cat]);
  };

  const handleSubcategoryChange = (subcat) => {
    if (selectedSubcategories.includes(subcat)) setSelectedSubcategories(selectedSubcategories.filter(item => item !== subcat));
    else setSelectedSubcategories([...selectedSubcategories, subcat]);
  };

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
    <div style={{ display: 'flex', padding: '40px 5%', gap: '30px', backgroundColor: '#f4f7f6', alignItems: 'flex-start', minHeight: '100vh' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '280px', minWidth: '280px', background: 'white', padding: '25px', borderRadius: '15px', position: 'sticky', top: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
        <h3 style={{ marginTop: 0 }}>Bộ lọc</h3>
        <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />
        
        <h4 style={{ fontSize: '1rem', marginBottom: '15px' }}>Danh mục</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {categories.map((cat, index) => (
            <label key={index} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} style={{ marginRight: '10px' }} /> 
              {cat}
            </label>
          ))}
        </div>

        {availableSubcategories.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '15px' }}>Chức năng</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '10px', borderLeft: '2px solid #007bff' }}>
              {availableSubcategories.map((sub, i) => (
                <label key={i} style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedSubcategories.includes(sub)} onChange={() => handleSubcategoryChange(sub)} style={{ marginRight: '8px' }} /> {sub}
                </label>
              ))}
            </div>
          </div>
        )}

        <h4 style={{ marginTop: '30px' }}>Khoảng giá</h4>
        <input type="range" min="0" max="1500000" step="50000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#007bff', fontWeight: 'bold' }}>Dưới {maxPrice.toLocaleString()}đ</div>

        <button 
          onClick={() => { setSelectedCategories([]); setSelectedSubcategories([]); setMaxPrice(1500000); setSelectedBrand("Tất cả thương hiệu"); }}
          style={{ width: '100%', marginTop: '30px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer' }}
        >XÓA LỌC</button>
      </aside>

      {/* DANH SÁCH */}
      <main style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Kết quả: <strong>{filteredProducts.length}</strong> sản phẩm</h2>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <option>Mới nhất</option>
            <option>Giá: Thấp đến Cao</option>
            <option>Giá: Cao đến Thấp</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              // SỬA LỖI: Cập nhật đường dẫn thành /products/ khớp với App.js
              onClick={() => navigate(`/products/${product.id}`)} 
              style={{ 
                background: 'white', border: '1px solid #eee', borderRadius: '15px', padding: '20px', 
                display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: '0.3s', position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <span style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem', background: product.stock ? '#e8f5e9' : '#ffebee', color: product.stock ? '#2e7d32' : '#d32f2f', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                {product.stock ? "Còn hàng" : "Hết hàng"}
              </span>
              <img src={product.img} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'contain', marginBottom: '15px' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>{product.brand}</p>
                <h4 style={{ margin: '5px 0', fontSize: '1rem', color: '#333' }}>{product.name}</h4>
                <p style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '1.1rem' }}>{product.price.toLocaleString()}đ</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  if(product.stock) navigate(`/products/${product.id}`); // SỬA LỖI ĐƯỜNG DẪN
                }}
                style={{ width: '100%', padding: '10px', border: '1px solid #007bff', background: 'none', color: '#007bff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {product.stock ? "Xem chi tiết" : "Liên hệ"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;