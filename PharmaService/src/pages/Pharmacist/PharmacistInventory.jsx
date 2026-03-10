import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; 
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore'; 
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PharmacistInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: 'Hộp', stock: '', expiry: '', price: '' });

  // Load Data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      products.sort((a, b) => a.name.localeCompare(b.name));
      setInventory(products);
    });
    return () => unsubscribe();
  }, []);

  // Filter
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const resetForm = () => { setFormData({ name: '', unit: 'Hộp', stock: '', expiry: '', price: '' }); setEditingId(null); setIsModalOpen(false); };
  
  const handleEditClick = (product) => { setFormData({ ...product }); setEditingId(product.id); setIsModalOpen(true); };
  
  const handleSave = async () => {
    if (!formData.name) return toast.warning("⚠️ Vui lòng nhập tên thuốc!");
    if (!formData.price || !formData.stock) return toast.warning("⚠️ Vui lòng nhập giá và số lượng!");

    const data = { ...formData, stock: Number(formData.stock), price: Number(formData.price), updatedAt: new Date() };
    
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), data);
        toast.success("✅ Cập nhật thuốc thành công!");
      } else {
        await addDoc(collection(db, "products"), { ...data, createdAt: new Date() });
        toast.success("✅ Đã thêm thuốc mới vào kho!");
      }
      resetForm();
    } catch (e) { 
      console.error(e); 
      toast.error("❌ Có lỗi xảy ra!"); 
    }
  };

  const handleDelete = async (id) => { 
    // Giữ confirm native để an toàn, nhưng thông báo kết quả bằng toast
    if(window.confirm("Bạn chắc chắn muốn xóa thuốc này?")) {
        try {
            await deleteDoc(doc(db, "products", id));
            toast.success("🗑️ Đã xóa thuốc khỏi kho.");
        } catch (error) {
            toast.error("❌ Lỗi khi xóa.");
        }
    }
  };

  const getStatus = (stock, expiry) => {
    if (expiry && new Date(expiry) < new Date()) return { label: "Hết hạn", color: "#d63031", bg: "#ffebee" };
    if (stock <= 0) return { label: "Hết hàng", color: "#d63031", bg: "#ffebee" };
    if (stock < 20) return { label: "Sắp hết", color: "#e67e22", bg: "#fff3e0" };
    return { label: "Sẵn hàng", color: "#00b894", bg: "#e3f9e5" };
  };

  const btnStyle = { padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '5px' };

  return (
    <div style={{ padding: '40px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <ToastContainer autoClose={2000} position="top-right" />
      
      {/* Header & Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
            <Link to="/pharmacist/dashboard" style={{ textDecoration: 'none', color: '#636e72', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px', fontWeight: 'bold' }}>
                ⬅ Quay lại Dashboard
            </Link>
            <h2 style={{ color: '#2d3436', margin: 0, fontSize: '2rem' }}>📦 Quản lý Kho Thuốc</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '15px' }}>
            <input 
                type="text" placeholder="🔍 Tìm tên thuốc..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '12px 20px', borderRadius: '50px', border: 'none', width: '300px', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
            />
            <button onClick={() => { resetForm(); setIsModalOpen(true); }} 
                style={{ ...btnStyle, background: '#00b894', color: 'white', boxShadow: '0 4px 10px rgba(0, 184, 148, 0.3)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
                + Nhập thuốc mới
            </button>
        </div>
      </div>

      {/* Table Card */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa', color: '#636e72', borderBottom: '2px solid #eee' }}>
            <tr>
              {['Tên thuốc', 'Giá bán', 'Tồn kho', 'Hạn sử dụng', 'Trạng thái', 'Hành động'].map((h, i) => (
                  <th key={i} style={{ padding: '18px', textAlign: i===5?'center':'left', fontWeight: '600' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => {
              const status = getStatus(item.stock, item.expiry);
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fbfd'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '18px', fontWeight: 'bold', color: '#2d3436' }}>{item.name}</td>
                  <td style={{ padding: '18px', color: '#0984e3', fontWeight: 'bold' }}>{(Number(item.price)||0).toLocaleString()}đ</td>
                  <td style={{ padding: '18px' }}><span style={{fontWeight:'bold'}}>{item.stock}</span> {item.unit}</td>
                  <td style={{ padding: '18px', color: '#636e72' }}>{item.expiry || "--"}</td>
                  <td style={{ padding: '18px' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 'bold', background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: '18px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={() => handleEditClick(item)} style={{ ...btnStyle, background: '#dfe6e9', color: '#2d3436' }}>✎</button>
                    <button onClick={() => handleDelete(item.id)} style={{ ...btnStyle, background: '#ffebee', color: '#d63031' }}>🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Animation */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '450px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ margin: '0 0 20px 0', color: editingId ? '#0984e3' : '#00b894' }}>{editingId ? "Cập nhật thuốc" : "Nhập thuốc mới"}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input placeholder="Tên thuốc" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9', outline: 'none' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="number" placeholder="Giá" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9' }} />
                    <select value={formData.unit} onChange={e=>setFormData({...formData, unit: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9' }}><option>Hộp</option><option>Vỉ</option><option>Chai</option><option>Lọ</option></select>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="number" placeholder="Số lượng" value={formData.stock} onChange={e=>setFormData({...formData, stock: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9' }} />
                    <input type="date" value={formData.expiry} onChange={e=>setFormData({...formData, expiry: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={handleSave} style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: editingId ? '#0984e3' : '#00b894', color: 'white' }}>Lưu</button>
                    <button onClick={() => setIsModalOpen(false)} style={{ ...btnStyle, flex: 1, justifyContent: 'center', background: '#f1f2f6', color: '#636e72' }}>Hủy</button>
                </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};
export default PharmacistInventory;