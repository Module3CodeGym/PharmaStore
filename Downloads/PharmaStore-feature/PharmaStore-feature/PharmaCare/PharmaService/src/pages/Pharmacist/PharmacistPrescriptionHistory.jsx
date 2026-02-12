import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const PharmacistPrescriptionHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Lấy dữ liệu từ bảng prescriptions (Đơn thuốc đã kê)
    const q = query(collection(db, "prescriptions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredHistory = history.filter(item => 
    item.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      <Link to="/pharmacist/dashboard" style={{ textDecoration: 'none', color: '#636e72', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⬅ Quay lại Dashboard
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ color: '#2d3436', margin: 0, fontSize: '2rem' }}>📜 Lịch sử kê đơn</h2>
          <input 
              type="text" 
              placeholder="🔍 Tìm bệnh nhân..." 
              value={searchTerm} 
              onChange={e=>setSearchTerm(e.target.value)}
              style={{ padding: '12px 20px', borderRadius: '50px', border: 'none', width: '300px', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} 
           />
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa', color: '#636e72', borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '18px', textAlign: 'left' }}>Mã đơn</th>
              <th style={{ padding: '18px', textAlign: 'left' }}>Bệnh nhân</th>
              <th style={{ padding: '18px', textAlign: 'left' }}>Chi tiết thuốc</th>
              <th style={{ padding: '18px', textAlign: 'right' }}>Tổng tiền</th>
              <th style={{ padding: '18px', textAlign: 'center' }}>Người kê</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>Chưa có dữ liệu</td></tr>
            ) : filteredHistory.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fbfd'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <td style={{ padding: '18px', color: '#0984e3', fontWeight: 'bold' }}>
                    #{item.id.slice(0,5)}
                    <br/><span style={{fontSize:'0.8rem', color:'#999', fontWeight:'normal'}}>{item.createdAt?.seconds ? new Date(item.createdAt.seconds*1000).toLocaleString('vi-VN') : ''}</span>
                </td>
                <td style={{ padding: '18px' }}>
                    <strong>{item.patientName}</strong>
                    <br/><span style={{fontSize:'0.9rem', color:'#636e72'}}>{item.diagnosis}</span>
                </td>
                <td style={{ padding: '18px', fontSize: '0.9rem' }}>
                    {item.items?.map((m,i)=><div key={i}>• {m.drugName} <b>(x{m.quantity})</b></div>)}
                </td>
                <td style={{ padding: '18px', textAlign: 'right', color: '#d63031', fontWeight: 'bold' }}>
                    {Number(item.totalPrice).toLocaleString()}đ
                </td>
                <td style={{ padding: '18px', textAlign: 'center' }}>
                    <span style={{background:'#e3f2fd', color:'#0984e3', padding:'4px 8px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:'bold'}}>
                        {item.pharmacistName||'DS'}
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