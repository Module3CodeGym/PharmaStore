  import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { auth,db } from '../../firebaseConfig'; // Đảm bảo đường dẫn này đúng với dự án của bạn
  import { doc, getDoc, addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore';
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css'; // Import CSS cho toast

  const CreatePrescription = () => {
    const { recordId } = useParams();
    const navigate = useNavigate();
    const [record, setRecord] = useState(null);
    
    // State quản lý danh sách thuốc đang kê  (Mảng items)
    const [medications, setMedications] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State form thêm thuốc
    const [currentDrug, setCurrentDrug] = useState({
      drugName: '',
      quantity: 1,
      dosage: '',
      price: 0
    });

    // 1. Lấy thông tin bệnh án
    useEffect(() => {
      const fetchRecord = async () => {
        try {
          const docRef = doc(db, "medical_records", recordId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setRecord({ id: docSnap.id, ...docSnap.data() });
          } else {
            toast.error("Không tìm thấy bệnh án!");
          }
        } catch (error) {
          console.error("Lỗi lấy bệnh án:", error);
        }
      };
      fetchRecord();
    }, [recordId]);

    // 2. Thêm thuốc vào danh sách tạm
    const handleAddDrug = (e) => {
      e.preventDefault();
      if (!currentDrug.drugName || !currentDrug.dosage) {
        return toast.warning("Vui lòng nhập tên thuốc và liều dùng!");
      }

      const newDrug = {
        drugId: `drug_${Date.now()}`,
        drugName: currentDrug.drugName,
        quantity: parseInt(currentDrug.quantity) || 1,
        dosage: currentDrug.dosage,
        price: parseInt(currentDrug.price) || 0
      };

      setMedications([...medications, newDrug]); 
      setCurrentDrug({ drugName: '', quantity: 1, dosage: '', price: 0 }); // Reset form
    };

    // 3. Xóa thuốc khỏi danh sách
    const removeDrug = (index) => {
      const newList = [...medications];
      newList.splice(index, 1);
      setMedications(newList);
    };

    // 4. Lưu đơn thuốc lên Firebase
  // Tìm đến hàm handleSubmit và cập nhật nội dung bên trong try-catch
  const handleSubmit = async () => {
  if (medications.length === 0) return toast.error("Chưa kê thuốc nào!");
  if (isSubmitting) return;

  setIsSubmitting(true);
  const totalPrice = medications.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  try {
    // A. Tạo đơn thuốc (prescriptions)
    await addDoc(collection(db, "prescriptions"), {
      recordId: recordId,
      patientId: record.patientId,
      
      // QUAN TRỌNG: Thêm 2 dòng này để trang Lịch sử có dữ liệu hiển thị
      patientName: record.patientName, 
      diagnosis: record.diagnosis,     
      
      // Lấy tên dược sĩ thực tế từ auth thay vì dùng mã Demo
      pharmacistName: auth.currentUser?.displayName || "Dược sĩ trực", 
      pharmacistId: auth.currentUser?.uid || "PHARMACIST_ID_DEMO",
      
      items: medications.map(med => ({
        drugId: med.drugId,
        drugName: med.drugName,
        quantity: Number(med.quantity),
        dosage: med.dosage,
        price: Number(med.price)
      })),
      
      totalPrice: Number(totalPrice), // Lưu dạng số để định dạng tiền tệ không lỗi
      status: "Chờ xác nhận", // Đồng bộ trạng thái Tiếng Việt
      createdAt: serverTimestamp()
    });

    // B. Cập nhật trạng thái bệnh án gốc thành "đã xong"
    await updateDoc(doc(db, "medical_records", recordId), {
      status: "done"
    });

    toast.success("🎉 Đã phát hành đơn thuốc thành công!");
    setTimeout(() => navigate('/pharmacist/dashboard'), 1500);

  } catch (error) {
    console.error("Lỗi khi lưu đơn thuốc:", error);
    toast.error("Lỗi khi lưu đơn thuốc. Vui lòng kiểm tra quyền truy cập!");
    setIsSubmitting(false);
  }
};
    if (!record) return <div style={{padding: '50px', textAlign: 'center'}}>Đang tải thông tin bệnh án...</div>;

    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f5f6fa' }}>
        <ToastContainer />
        
        {/* --- CỘT TRÁI: THÔNG TIN BỆNH ÁN (CỐ ĐỊNH WIDTH 350px) --- */}
        <div style={{ 
          width: '350px',            
          minWidth: '350px',         
          borderRight: '1px solid #e1e4e8', 
          background: '#fff',
          overflowY: 'auto',         
          padding: '25px',
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {/* Nút quay lại */}
          <button 
            onClick={() => navigate('/pharmacist/dashboard')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#636e72', 
              cursor: 'pointer', 
              textAlign: 'left', 
              padding: '0', 
              marginBottom: '20px',
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontWeight: '600'
            }}
          >
            <i className="fas fa-arrow-left"></i> Quay lại Dashboard
          </button>

          <h3 style={{ color: '#0984e3', marginBottom: '20px', borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', marginTop: 0 }}>
            📋 Hồ sơ bệnh án
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#b2bec3', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Bệnh nhân</label>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2d3436' }}>{record.patientName}</div>
              </div>

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#b2bec3', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Chẩn đoán</label>
                  <div style={{ fontSize: '1rem', color: '#2d3436' }}>{record.diagnosis}</div>
              </div>

              <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#b2bec3', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Triệu chứng</label>
                  <div style={{ background: '#fff', border: '1px dashed #dfe6e9', padding: '10px', borderRadius: '6px', color: '#636e72', fontSize: '0.95rem' }}>
                      {record.symptoms}
                  </div>
              </div>

              {record.doctorNotes && (
                  <div style={{ background: '#fff5f5', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #ff4757' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ff4757', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>⚠️ Lưu ý từ Bác sĩ</label>
                      <p style={{ margin: 0, color: '#2d3436', fontWeight: '500' }}>{record.doctorNotes}</p>
                  </div>
              )}
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM KÊ ĐƠN (FLEX GROW) --- */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '30px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
              <h2 style={{ color: '#2d3436', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                💊 Kê đơn thuốc
              </h2>
              
              {/* Form thêm thuốc */}
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '30px' }}>
                  <form onSubmit={handleAddDrug} style={{ display: 'grid', gridTemplateColumns: '2fr 0.7fr 1fr 2fr auto', gap: '15px', alignItems: 'end' }}>
                      <div>
                          <label style={{fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px', display: 'block'}}>Tên thuốc</label>
                          <input className="form-control" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9'}} placeholder="Nhập tên..." value={currentDrug.drugName} onChange={e => setCurrentDrug({...currentDrug, drugName: e.target.value})} />
                      </div>
                      <div>
                          <label style={{fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px', display: 'block'}}>SL</label>
                          <input type="number" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9'}} value={currentDrug.quantity} onChange={e => setCurrentDrug({...currentDrug, quantity: e.target.value})} />
                      </div>
                      <div>
                          <label style={{fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px', display: 'block'}}>Đơn giá (VNĐ)</label>
                          <input type="number" style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9'}} placeholder="0" value={currentDrug.price} onChange={e => setCurrentDrug({...currentDrug, price: e.target.value})} />
                      </div>
                      <div>
                          <label style={{fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px', display: 'block'}}>Liều dùng / Cách dùng</label>
                          <input style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9'}} placeholder="Sáng 1, Chiều 1..." value={currentDrug.dosage} onChange={e => setCurrentDrug({...currentDrug, dosage: e.target.value})} />
                      </div>
                      <button type="submit" style={{ height: '42px', padding: '0 25px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
                        + Thêm
                      </button>
                  </form>
              </div>

              {/* Bảng danh sách thuốc */}
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#2d3436', color: 'white' }}>
                          <tr>
                              <th style={{ padding: '15px', textAlign: 'left' }}>Tên thuốc</th>
                              <th style={{ padding: '15px', textAlign: 'center' }}>SL</th>
                              <th style={{ padding: '15px', textAlign: 'right' }}>Đơn giá</th>
                              <th style={{ padding: '15px', textAlign: 'left' }}>Hướng dẫn sử dụng</th>
                              <th style={{ padding: '15px', textAlign: 'right' }}>Thành tiền</th>
                              <th style={{ padding: '15px', textAlign: 'center' }}>Xóa</th>
                          </tr>
                      </thead>
                      <tbody>
                          {medications.length === 0 ? (
                              <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '40px', color: '#b2bec3'}}>
                                  <i className="fas fa-pills" style={{fontSize: '2rem', marginBottom: '10px', display: 'block'}}></i>
                                  Chưa có thuốc nào trong đơn
                                </td>
                              </tr>
                          ) : (
                              medications.map((med, index) => (
                              <tr key={index} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                  <td style={{ padding: '15px', fontWeight: '600', color: '#2d3436' }}>{med.drugName}</td>
                                  <td style={{ padding: '15px', textAlign: 'center' }}>{med.quantity}</td>
                                  <td style={{ padding: '15px', textAlign: 'right' }}>{med.price.toLocaleString()}</td>
                                  <td style={{ padding: '15px', color: '#636e72' }}>{med.dosage}</td>
                                  <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: '#2d3436' }}>{(med.price * med.quantity).toLocaleString()}</td>
                                  <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => removeDrug(index)} style={{ color: '#ff4757', border: 'none', background: '#ffeaa7', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                      &times;
                                    </button>
                                  </td>
                              </tr>
                              ))
                          )}
                      </tbody>
                  </table>
              </div>

              {/* Footer Tổng tiền & Nút Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#636e72', fontSize: '0.9rem', display: 'block' }}>Tổng thanh toán</span>
                      <h2 style={{ margin: 0, color: '#0984e3', fontSize: '1.8rem' }}>
                        {medications.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} VNĐ
                      </h2>
                  </div>
                  <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting || medications.length === 0}
                      style={{ 
                          padding: '15px 40px', 
                          background: (isSubmitting || medications.length === 0) ? '#b2bec3' : '#0984e3', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '8px', 
                          fontSize: '1.1rem', 
                          fontWeight: 'bold', 
                          cursor: (isSubmitting || medications.length === 0) ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          boxShadow: '0 4px 12px rgba(9, 132, 227, 0.3)'
                      }}
                  >
                      {isSubmitting ? 'Đang xử lý...' : <><i className="fas fa-paper-plane"></i> Phát hành đơn</>}
                  </button>
              </div>
          </div>
        </div>
      </div>
    );
  };

  export default CreatePrescription;