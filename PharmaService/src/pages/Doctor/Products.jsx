import React, { useState, useEffect } from 'react';

const Products = () => {
    // 1. DỮ LIỆU GIẢ LẬP ĐẦY ĐỦ (Database chuẩn)
    const [products] = useState([
        { 
            id: 1, 
            ten: "Panadol Extra", 
            hoat_chat: "Paracetamol 500mg, Caffeine 65mg", 
            nhom: "Giảm đau - Hạ sốt",
            gia: 2000, 
            ton: 500, 
            donvi: "Viên", 
            hinh_anh: "https://via.placeholder.com/150?text=Panadol",
            chi_dinh: "Điều trị đau nhẹ đến vừa: đau đầu, đau nửa đầu, đau cơ, đau bụng kinh...",
            chong_chi_dinh: "Quá mẫn với paracetamol. Suy gan nặng.",
            lieu_dung: "Người lớn: 1-2 viên/lần, mỗi 4-6 giờ. Không quá 8 viên/ngày."
        },
        { 
            id: 2, 
            ten: "Vitamin C 500mg", 
            hoat_chat: "Acid Ascorbic", 
            nhom: "Vitamin & Khoáng chất",
            gia: 15000, 
            ton: 50, 
            donvi: "Vỉ", 
            hinh_anh: "https://via.placeholder.com/150?text=VitaminC",
            chi_dinh: "Phòng và trị bệnh do thiếu Vitamin C (Scurvy). Tăng sức đề kháng.",
            chong_chi_dinh: "Người bị sỏi thận (oxalat), thiếu hụt men G6PD.",
            lieu_dung: "Uống 1 viên/ngày sau ăn sáng."
        },
        { 
            id: 3, 
            ten: "Siro Prospan", 
            hoat_chat: "Cao khô lá thường xuân", 
            nhom: "Hô hấp",
            gia: 75000, 
            ton: 0, 
            donvi: "Chai", 
            hinh_anh: "https://via.placeholder.com/150?text=Prospan",
            chi_dinh: "Viêm đường hô hấp cấp có kèm ho. Điều trị triệu chứng bệnh lý phế quản mạn tính.",
            chong_chi_dinh: "Bất dung nạp fructose.",
            lieu_dung: "Trẻ em: 2.5ml x 3 lần/ngày. Người lớn: 5-7.5ml x 3 lần/ngày."
        },
        { 
            id: 4, 
            ten: "Augmentin 1g", 
            hoat_chat: "Amoxicillin + Clavulanic", 
            nhom: "Kháng sinh",
            gia: 25000, 
            ton: 200, 
            donvi: "Viên", 
            hinh_anh: "https://via.placeholder.com/150?text=Augmentin",
            chi_dinh: "Nhiễm khuẩn đường hô hấp trên/dưới, da, mô mềm, xương khớp.",
            chong_chi_dinh: "Tiền sử vàng da/rối loạn chức năng gan do penicillin.",
            lieu_dung: "1 viên 1g x 2 lần/ngày (Mỗi 12 giờ)."
        },
        { 
            id: 5, 
            ten: "Gaviscon Dual", 
            hoat_chat: "Natri alginat", 
            nhom: "Tiêu hóa",
            gia: 6500, 
            ton: 300, 
            donvi: "Gói", 
            hinh_anh: "https://via.placeholder.com/150?text=Gaviscon",
            chi_dinh: "Điều trị chứng trào ngược dạ dày thực quản (ợ nóng, ợ chua).",
            chong_chi_dinh: "Mẫn cảm với thành phần thuốc.",
            lieu_dung: "1-2 gói sau ăn và lúc đi ngủ."
        },
    ]);

    // 2. STATE QUẢN LÝ
    const [searchTerm, setSearchTerm] = useState("");
    const [displayList, setDisplayList] = useState(products);
    const [isSearching, setIsSearching] = useState(false);
    const [viewProduct, setViewProduct] = useState(null); // <--- Đã thêm lại State xem chi tiết

    // Xử lý tìm kiếm mượt (Debounce)
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            const filtered = products.filter(p => 
                p.ten.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.hoat_chat.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDisplayList(filtered);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, products]);

    return (
        <div className="tab-container">
            {/* CSS Animation & Styles */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .product-row {
                    animation: fadeInUp 0.4s ease-out forwards;
                }
                .search-wrapper {
                    position: relative;
                    width: 100%;
                    max-width: 400px;
                    transition: all 0.3s;
                }
                .search-wrapper:focus-within {
                    transform: scale(1.02);
                    box-shadow: 0 4px 15px rgba(9, 132, 227, 0.2);
                }
                .clear-btn {
                    position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
                    background: #ddd; color: white; border-radius: 50%;
                    width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
                    font-size: 12px; cursor: pointer; border: none; transition: 0.2s;
                }
                .clear-btn:hover { background: #d63031; }
            `}</style>

            <div className="header-flex" style={{marginBottom: '20px', alignItems: 'flex-start'}}>
                <div>
                    <h2 style={{margin: 0, color: '#2d3436'}}>💊 Tra cứu thuốc</h2>
                    <p style={{color: '#636e72', fontSize: '0.9rem', marginTop: '5px'}}>
                        Kho dữ liệu: {products.length} đầu thuốc
                    </p>
                </div>

                {/* THANH TÌM KIẾM PRO */}
                <div className="search-wrapper">
                    <i className="fas fa-search" style={{
                        position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', 
                        color: isSearching ? '#0984e3' : '#b2bec3',
                        fontSize: '1.1rem', transition: '0.3s'
                    }}></i>
                    
                    <input 
                        type="text" 
                        placeholder="Nhập tên thuốc hoặc hoạt chất..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%', padding: '12px 40px 12px 45px', 
                            border: '1px solid #dfe6e9', borderRadius: '30px', 
                            fontSize: '1rem', outline: 'none', background: '#f8f9fa',
                            color: '#000', fontWeight: '500' // <--- Đã sửa: Màu chữ ĐEN và ĐẬM
                        }}
                    />

                    {searchTerm && (
                        <button className="clear-btn" onClick={() => setSearchTerm("")}>✕</button>
                    )}
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div style={{background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', overflow: 'hidden'}}>
                <table className="data-table">
                    <thead style={{background: '#f1f2f6'}}>
                        <tr>
                            <th style={{padding: '15px'}}>Sản phẩm</th>
                            <th>Thông tin chi tiết</th>
                            <th>Giá bán</th>
                            <th>Tồn kho</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayList.length > 0 ? displayList.map((p, index) => (
                            <tr 
                                key={p.id} 
                                className="product-row"
                                style={{animationDelay: `${index * 0.05}s`}} 
                            >
                                <td style={{padding: '15px'}}>
                                    <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                                        <img src={p.hinh_anh} alt="" style={{width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #eee'}} />
                                        <div>
                                            <div style={{fontWeight: 'bold', color: '#2d3436'}}>{p.ten}</div>
                                            <div style={{fontSize: '0.85rem', color: '#00b894', background: '#e3f2fd', display: 'inline-block', padding: '2px 8px', borderRadius: '4px', marginTop: '4px'}}>
                                                {p.nhom}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{fontSize: '0.9rem'}}><strong>HC:</strong> {p.hoat_chat}</div>
                                    <div style={{fontSize: '0.9rem', color: '#636e72'}}><strong>ĐV:</strong> {p.donvi}</div>
                                </td>
                                <td style={{fontWeight: 'bold', color: '#d63031'}}>{p.gia.toLocaleString()}đ</td>
                                <td>
                                    <span style={{
                                        padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                                        background: p.ton === 0 ? '#ffebee' : (p.ton < 100 ? '#fff3e0' : '#e8f5e9'),
                                        color: p.ton === 0 ? '#c62828' : (p.ton < 100 ? '#e67e22' : '#27ae60')
                                    }}>
                                        {p.ton === 0 ? "Hết hàng" : `Còn ${p.ton}`}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => setViewProduct(p)} // <--- Đã thêm lại sự kiện bấm nút
                                        style={{border: 'none', background: 'none', cursor: 'pointer', color: '#0984e3', fontWeight: 'bold'}}
                                    >
                                        Chi tiết ➝
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{padding: '40px', textAlign: 'center', color: '#b2bec3'}}>
                                    <i className="fas fa-box-open" style={{fontSize: '2rem', marginBottom: '10px', display: 'block'}}></i>
                                    Không tìm thấy sản phẩm nào...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL CHI TIẾT SẢN PHẨM (ĐÃ KHÔI PHỤC) --- */}
            {viewProduct && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    backdropFilter: 'blur(3px)'
                }} onClick={() => setViewProduct(null)}>
                    
                    <div style={{
                        background: 'white', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto',
                        borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative',
                        animation: 'fadeInUp 0.3s ease-out'
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        <div style={{padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa'}}>
                            <h3 style={{margin: 0, color: '#0984e3'}}>{viewProduct.ten}</h3>
                            <button onClick={() => setViewProduct(null)} style={{border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666'}}>×</button>
                        </div>

                        <div style={{padding: '25px'}}>
                            <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                                <img src={viewProduct.hinh_anh} alt={viewProduct.ten} style={{width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee'}} />
                                <div>
                                    <p><strong>Hoạt chất:</strong> {viewProduct.hoat_chat}</p>
                                    <p><strong>Nhóm:</strong> {viewProduct.nhom}</p>
                                    <p style={{color: '#d63031', fontWeight: 'bold', fontSize: '1.1rem'}}>{viewProduct.gia.toLocaleString()}đ / {viewProduct.donvi}</p>
                                    <p><strong>Tồn kho:</strong> {viewProduct.ton}</p>
                                </div>
                            </div>
                            <hr style={{border: 'none', borderTop: '1px dashed #ddd', margin: '20px 0'}} />
                            <div style={{marginBottom: '15px'}}>
                                <h4 style={{color: '#2d3436'}}>✅ Chỉ định:</h4>
                                <p style={{color: '#555'}}>{viewProduct.chi_dinh}</p>
                            </div>
                            <div style={{marginBottom: '15px'}}>
                                <h4 style={{color: '#d63031'}}>⛔ Chống chỉ định:</h4>
                                <p style={{color: '#555'}}>{viewProduct.chong_chi_dinh}</p>
                            </div>
                            <div>
                                <h4 style={{color: '#0984e3'}}>💊 Liều dùng:</h4>
                                <div style={{background: '#e3f2fd', padding: '10px', borderRadius: '6px', color: '#0984e3'}}>
                                    {viewProduct.lieu_dung}
                                </div>
                            </div>
                        </div>

                        <div style={{padding: '15px 25px', background: '#f8f9fa', borderTop: '1px solid #eee', textAlign: 'right'}}>
                            <button onClick={() => setViewProduct(null)} style={{padding: '10px 25px', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Products;