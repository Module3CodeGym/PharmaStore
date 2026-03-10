import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; 
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PharmacistOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const updateStatus = async (id, status) => { 
      try { 
          await updateDoc(doc(db, "orders", id), { status });
          if(status === 'shipping') toast.info("🛵 Đã chuyển trạng thái: Đang giao hàng");
          if(status === 'completed') toast.success("✅ Đơn hàng đã hoàn thành!");
      } catch (e) { 
          console.error(e); 
          toast.error("❌ Lỗi cập nhật trạng thái");
      } 
  };

  const getBadge = (s) => {
    switch(s) {
      case 'pending': return { text: 'Chờ xử lý', bg: '#fff3e0', c: '#e67e22' };
      case 'shipping': return { text: 'Đang giao', bg: '#e3f2fd', c: '#0984e3' };
      case 'completed': return { text: 'Hoàn thành', bg: '#e3f9e5', c: '#00b894' };
      default: return { text: 'Mới', bg: '#f5f6fa', c: '#636e72' };
    }
  };

  return (
    <div style={{ padding: '40px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <ToastContainer autoClose={2000} position="top-right" />

      <Link to="/pharmacist/dashboard" style={{ textDecoration: 'none', color: '#636e72', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⬅ Quay lại Dashboard
      </Link>
      <h2 style={{ color: '#2d3436', marginBottom: '30px', fontSize: '2rem' }}>🚚 Quản lý Đơn Hàng Online</h2>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa', color: '#636e72', borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '18px', textAlign: 'left' }}>Đơn hàng</th>
              <th style={{ padding: '18px', textAlign: 'left' }}>Khách hàng</th>
              <th style={{ padding: '18px', textAlign: 'left' }}>Sản phẩm</th>
              <th style={{ padding: '18px', textAlign: 'right' }}>Tổng tiền</th>
              <th style={{ padding: '18px', textAlign: 'center' }}>Trạng thái</th>
              <th style={{ padding: '18px', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const b = getBadge(order.status);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f1f1f1', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fbfd'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '18px', fontWeight: 'bold', color: '#0984e3' }}>#{order.id.slice(0,6)}<br/><small style={{color:'#999', fontWeight:'normal'}}>{order.createdAt?.seconds ? new Date(order.createdAt.seconds*1000).toLocaleDateString() : ''}</small></td>
                  <td style={{ padding: '18px' }}><strong>{order.customerName}</strong><br/><small style={{color:'#636e72'}}>{order.phone}</small></td>
                  <td style={{ padding: '18px', fontSize: '0.9rem' }}>{order.items?.map((i,k)=><div key={k}>• {i.name} x{i.quantity}</div>)}</td>
                  <td style={{ padding: '18px', textAlign: 'right', fontWeight: 'bold', color: '#d63031' }}>{Number(order.total||0).toLocaleString()}đ</td>
                  <td style={{ padding: '18px', textAlign: 'center' }}>
                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: b.bg, color: b.c }}>{b.text}</span>
                  </td>
                  <td style={{ padding: '18px', textAlign: 'center' }}>
                    {order.status === 'pending' && <button onClick={()=>updateStatus(order.id, 'shipping')} style={{padding:'8px 12px', borderRadius:'8px', border:'none', background:'#0984e3', color:'white', cursor:'pointer', fontWeight:'bold'}}>Giao hàng ➡️</button>}
                    {order.status === 'shipping' && <button onClick={()=>updateStatus(order.id, 'completed')} style={{padding:'8px 12px', borderRadius:'8px', border:'none', background:'#00b894', color:'white', cursor:'pointer', fontWeight:'bold'}}>Hoàn tất ✅</button>}
                    {order.status === 'completed' && <span style={{color:'#00b894', fontWeight:'bold'}}>✔ Xong</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PharmacistOrders;