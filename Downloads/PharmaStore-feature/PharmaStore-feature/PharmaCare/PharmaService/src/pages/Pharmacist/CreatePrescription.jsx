import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebaseConfig'; 
import { doc, getDoc, collection, updateDoc, serverTimestamp, getDocs, writeBatch, increment } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatePrescription = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [products, setProducts] = useState([]);
  const [medications, setMedications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDrug, setCurrentDrug] = useState({ drugId: '', drugName: '', quantity: 1, dosage: '', price: 0, unit: '', stock: 0 });

  useEffect(() => {
    getDoc(doc(db, "medical_records", recordId)).then(s => s.exists() && setRecord({id:s.id, ...s.data()}));
    getDocs(collection(db, "products")).then(s => setProducts(s.docs.map(d => ({id:d.id, ...d.data()}))));
  }, [recordId]);

  const handleSelectDrug = (e) => {
    const p = products.find(i => i.id === e.target.value);
    setCurrentDrug(p ? { ...currentDrug, drugId: p.id, drugName: p.name, price: Number(p.price)||0, unit: p.unit, stock: Number(p.stock)||0 } : { ...currentDrug, drugId: '' });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!currentDrug.drugId || currentDrug.quantity <= 0) return toast.warning("Chọn thuốc và số lượng hợp lệ!");
    if (currentDrug.quantity > currentDrug.stock) return toast.error(`Chỉ còn ${currentDrug.stock} ${currentDrug.unit}!`);
    setMedications([...medications, { ...currentDrug, total: currentDrug.price * currentDrug.quantity }]);
    setCurrentDrug(prev => ({ ...prev, drugId: '', drugName: '', quantity: 1, price: 0, stock: 0 }));
  };

  const handleSubmit = async () => {
    if (medications.length === 0) return toast.error("Đơn thuốc trống!");
    setIsSubmitting(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "prescriptions")), {
        recordId, patientName: record.patientName, diagnosis: record.diagnosis,
        pharmacistId: auth.currentUser?.uid, pharmacistName: auth.currentUser?.displayName || "Dược sĩ",
        items: medications, totalPrice: medications.reduce((s,i)=>s+i.total,0),
        status: "unpaid", createdAt: serverTimestamp()
      });
      batch.update(doc(db, "medical_records", recordId), { status: "done", processedAt: serverTimestamp() });
      medications.forEach(m => batch.update(doc(db, "products", m.drugId), { stock: increment(-m.quantity) }));
      await batch.commit();
      toast.success("Thành công!");
      setTimeout(() => navigate('/pharmacist/dashboard'), 1500);
    } catch (e) { console.error(e); setIsSubmitting(false); }
  };

  if (!record) return <div style={{padding:'50px', textAlign:'center'}}>⏳ Đang tải...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f6fa', fontFamily: "'Segoe UI', sans-serif" }}>
      <ToastContainer autoClose={2000} />
      
      {/* LEFT: INFO CARD */}
      <div style={{ width: '350px', padding: '30px', background: 'white', borderRight: '1px solid #e1e4e8', display: 'flex', flexDirection: 'column', boxShadow: '5px 0 15px rgba(0,0,0,0.02)', zIndex: 10 }}>
        <button onClick={() => navigate('/pharmacist/dashboard')} style={{ background: 'none', border: 'none', color: '#636e72', cursor: 'pointer', marginBottom: '30px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>⬅ Quay lại</button>
        <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#0984e3' }}>{record.patientName}</h3>
            <p style={{ margin: 0, color: '#636e72', fontSize: '0.9rem' }}>Chẩn đoán: <strong>{record.diagnosis}</strong></p>
        </div>
        <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#b2bec3', textTransform: 'uppercase' }}>Triệu chứng</label>
            <p style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', marginTop: '5px', color: '#2d3436' }}>{record.symptoms}</p>
            {record.doctorNotes && (
                <>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ff7675', textTransform: 'uppercase', display:'block', marginTop:'20px' }}>Lưu ý Bác sĩ</label>
                <p style={{ background: '#fff0f0', padding: '15px', borderRadius: '10px', marginTop: '5px', color: '#d63031' }}>{record.doctorNotes}</p>
                </>
            )}
        </div>
      </div>

      {/* RIGHT: FORM */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ color: '#2d3436', marginBottom: '30px' }}>💊 Kê đơn thuốc</h2>

            {/* Input Form */}
            <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 5px 20px rgba(0,0,0,0.03)', marginBottom: '30px' }}>
                <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr auto', gap: '15px', alignItems: 'end' }}>
                    <div>
                        <label style={{fontWeight:'600', fontSize:'0.85rem', color:'#636e72'}}>Chọn thuốc</label>
                        <select style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #dfe6e9', marginTop:'5px'}} value={currentDrug.drugId} onChange={handleSelectDrug}>
                            <option value="">-- Chọn --</option>
                            {products.map(p => <option key={p.id} value={p.id} disabled={p.stock<=0}>{p.name} (Còn {p.stock}) - {Number(p.price).toLocaleString()}đ</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{fontWeight:'600', fontSize:'0.85rem', color:'#636e72'}}>SL ({currentDrug.unit})</label>
                        <input type="number" min="1" style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #dfe6e9', marginTop:'5px'}} value={currentDrug.quantity} onChange={e=>setCurrentDrug({...currentDrug, quantity: e.target.value})} />
                    </div>
                    <div>
                        <label style={{fontWeight:'600', fontSize:'0.85rem', color:'#636e72'}}>Đơn giá</label>
                        <input disabled style={{width:'100%', padding:'12px', borderRadius:'8px', border:'none', background:'#f1f2f6', marginTop:'5px', fontWeight:'bold'}} value={Number(currentDrug.price).toLocaleString()} />
                    </div>
                    <div>
                        <label style={{fontWeight:'600', fontSize:'0.85rem', color:'#636e72'}}>Cách dùng</label>
                        <input placeholder="VD: Sáng 1 viên..." style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #dfe6e9', marginTop:'5px'}} value={currentDrug.dosage} onChange={e=>setCurrentDrug({...currentDrug, dosage: e.target.value})} />
                    </div>
                    <button type="submit" style={{padding:'12px 20px', background:'#00b894', color:'white', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer', boxShadow:'0 4px 10px rgba(0,184,148,0.3)'}}>Thêm +</button>
                </form>
            </div>

            {/* List Table */}
            <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.03)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#636e72', color: 'white' }}>
                        <tr>
                            {['Tên thuốc', 'SL', 'Đơn giá', 'Cách dùng', 'Thành tiền', ''].map((h,i)=><th key={i} style={{padding:'15px', textAlign:i>3?'right':'left'}}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {medications.map((m, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{m.drugName}</td>
                                <td style={{ padding: '15px' }}>{m.quantity} {m.unit}</td>
                                <td style={{ padding: '15px' }}>{Number(m.price).toLocaleString()}</td>
                                <td style={{ padding: '15px', color: '#666' }}>{m.dosage}</td>
                                <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#0984e3' }}>{m.total.toLocaleString()}đ</td>
                                <td style={{ padding: '15px', textAlign: 'right' }}><button onClick={()=>{const n=[...medications]; n.splice(i,1); setMedications(n)}} style={{color:'#d63031', background:'none', border:'none', cursor:'pointer'}}>×</button></td>
                            </tr>
                        ))}
                        {medications.length===0 && <tr><td colSpan="6" style={{padding:'40px', textAlign:'center', color:'#b2bec3'}}>Chưa có thuốc nào</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Footer Total */}
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '30px' }}>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#636e72' }}>Tổng cộng</span>
                    <h1 style={{ margin: '5px 0', color: '#d63031' }}>{medications.reduce((s,i)=>s+i.total,0).toLocaleString()}đ</h1>
                </div>
                <button onClick={handleSubmit} disabled={isSubmitting || medications.length===0} 
                    style={{ padding: '15px 40px', background: isSubmitting?'#b2bec3':'#0984e3', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(9,132,227,0.3)', transition:'0.3s' }}
                    onMouseEnter={e=>!isSubmitting && (e.target.style.transform='translateY(-3px)')}
                    onMouseLeave={e=>!isSubmitting && (e.target.style.transform='translateY(0)')}
                >
                    {isSubmitting ? 'Đang xử lý...' : '✅ Phát hành Đơn thuốc'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePrescription;