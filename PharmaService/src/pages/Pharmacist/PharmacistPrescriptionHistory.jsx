import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const PharmacistPrescriptionHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // 1. Lắng nghe dữ liệu thời gian thực từ bảng prescriptions
    const q = query(collection(db, "prescriptions"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(data);
    }, (error) => {
      // Báo lỗi chi tiết nều bị lỗi phân quyền (Rules) hoặc thiếu Index
      console.error("Lỗi Firestore:", error.message);
    });

    return () => unsubscribe();
  }, []);

  // Lọc tìm kiếm an toàn: kiểm tra tồn tại của chuỗi trước khi chuyển toLowerCase
  const filteredHistory = history.filter(item => {
    const name = item.patientName ? item.patientName.toLowerCase() : "";
    const id = item.id ? item.id.toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    return name.includes(search) || id.includes(search);
  });

  return (
    <div style={{ padding: '40px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      <Link to="/pharmacist/dashboard" style={{ textDecoration: 'none', color: '#636e72', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⬅ Quay lại Dashboard
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ color: '#2d3436', margin: 0, fontSize: '2rem' }}>📜 Lịch sử kê đơn thuốc</h2>
          <input 
              type="text" 
              placeholder="🔍 Tìm tên bệnh nhân hoặc mã đơn..." 
              value={searchTerm} 
              onChange={e=>setSearchTerm(e.target.value)}
              style={{ padding: '12px 20px', borderRadius: '50px', border: '1px solid #ddd', width: '350px', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} 
           />
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa', color: '#636e72', borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '18px', textAlign: 'left' }}>Thông tin đơn</th>
              <th style={{ padding: '18px', textAlign: 'left' }}>Bệnh nhân & Chẩn đoán</th>
              <th style={{ padding: '18px', textAlign: 'left' }}>Chi tiết thuốc</th>
              <th style={{ padding: '18px', textAlign: 'right' }}>Tổng cộng</th>
              <th style={{ padding: '18px', textAlign: 'center' }}>Người kê</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                    🔍 Không tìm thấy dữ liệu đơn thuốc nào.
                  </td>
                </tr>
            ) : filteredHistory.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.2s' }}>
                <td style={{ padding: '18px' }}>
                    <div style={{color: '#0984e3', fontWeight: 'bold'}}>#{item.id.slice(-5).toUpperCase()}</div>
                    <small style={{color: '#999'}}>
                      {item.createdAt?.seconds 
                        ? new Date(item.createdAt.seconds * 1000).toLocaleString('vi-VN') 
                        : 'Vừa xong'}
                    </small>
                </td>
                <td style={{ padding: '18px' }}>
                    <strong>{item.patientName || "Khách vãng lai"}</strong>
                    <div style={{fontSize:'0.85rem', color:'#636e72', marginTop: '4px'}}>{item.diagnosis || "Chưa có chẩn đoán"}</div>
                </td>
                <td style={{ padding: '18px', fontSize: '0.9rem' }}>
                    {item.items && item.items.length > 0 ? item.items.map((m,i)=>(
                      <div key={i} style={{marginBottom: '2px'}}>• {m.drugName} <b style={{color: '#2d3436'}}>(x{m.quantity})</b></div>
                    )) : <span style={{color: '#ccc'}}>Trống</span>}
                </td>
                <td style={{ padding: '18px', textAlign: 'right', color: '#d63031', fontWeight: 'bold' }}>
                    {/* Ép kiểu an toàn để tránh lỗi NaN */}
                    {Number(item.totalPrice || 0).toLocaleString()}đ
                </td>
                <td style={{ padding: '18px', textAlign: 'center' }}>
                    <span style={{background:'#e3f2fd', color:'#0984e3', padding:'6px 12px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'bold'}}>
                        ⚕️ {item.pharmacistName || 'Dược sĩ'}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PharmacistPrescriptionHistory;