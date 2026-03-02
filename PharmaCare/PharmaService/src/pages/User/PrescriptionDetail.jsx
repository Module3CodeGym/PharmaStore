import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { db, auth } from '../../firebaseConfig'; 
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!id) {
        setErrorStatus("Không tìm thấy mã đơn thuốc trên đường dẫn.");
        setLoading(false);
        return;
      }

      if (!auth.currentUser) {
        setErrorStatus("Vui lòng đăng nhập để xem thông tin.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let prescriptionData = null;
        let actualPrescriptionId = id;

        // CÁCH 1: Tìm thử trực tiếp theo ID Document
        const docRef = doc(db, "prescriptions", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          prescriptionData = docSnap.data();
        } else {
          // CÁCH 2: Tìm theo 'recordId' với điều kiện bảo mật
          const q = query(
            collection(db, "prescriptions"), 
            where("recordId", "==", id),
            where("patientId", "==", auth.currentUser.uid) 
          );
          
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            prescriptionData = querySnapshot.docs[0].data();
            actualPrescriptionId = querySnapshot.docs[0].id;
          }
        }

        if (prescriptionData) {
          const isAuthorized = 
            prescriptionData.patientId === auth.currentUser?.uid || 
            ['doctor', 'pharmacist', 'admin'].includes(auth.currentUser?.role);

          if (!isAuthorized) {
            setErrorStatus("Bạn không có quyền xem đơn thuốc này.");
          } else {
            setPrescription({ id: actualPrescriptionId, ...prescriptionData });
          }
        } else {
          setErrorStatus("Bác sĩ/Dược sĩ chưa cập nhật đơn thuốc cho hồ sơ này!");
        }
      } catch (error) {
        console.error("Lỗi Firestore:", error);
        setErrorStatus("Lỗi phân quyền hoặc mất kết nối mạng. Mã lỗi: " + error.code);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  // SỬA LẠI: Lấy danh sách thuốc từ 'items' thay vì 'medicines'
  const medicinesList = prescription?.items || prescription?.medicines || [];

  const handleBuyAll = () => {
    if (medicinesList.length === 0) {
      toast.warning("Đơn thuốc không có danh mục thuốc.");
      return;
    }

    medicinesList.forEach(med => {
      addToCart({
        id: med.drugId || med.id || Math.random().toString(),
        // Đọc tên thuốc từ 'drugName'
        name: med.drugName || med.name, 
        price: Number(med.price) || 0,
        quantity: Number(med.quantity) || 1,
        image: med.image || "https://via.placeholder.com/150"
      });
    });

    toast.success("🛒 Đã thêm đơn thuốc vào giỏ hàng!");
    navigate('/cart');
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: '#00b894' }}></i>
      <p style={{ marginTop: '20px', color: '#636e72' }}>Đang tải đơn thuốc điện tử...</p>
    </div>
  );

  if (errorStatus) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: '4rem', color: '#ff4757', marginBottom: '20px' }}></i>
      <h2 style={{ color: '#2d3436' }}>Không tìm thấy dữ liệu</h2>
      <p style={{ color: '#636e72', marginBottom: '30px' }}>{errorStatus}</p>
      <button onClick={() => navigate(-1)} style={secondaryBtnStyle}>Quay lại trang trước</button>
    </div>
  );

  const total = medicinesList.reduce((sum, m) => sum + (Number(m.price) * Number(m.quantity)), 0) || 0;

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px' }}>
      <ToastContainer position="top-center" autoClose={1500} theme="colored" />
      
      <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#00b894', margin: 0 }}>ĐƠN THUỐC ĐIỆN TỬ</h2>
          <p style={{ color: '#b2bec3' }}>Mã đơn: {prescription.id}</p>
        </div>

        <div style={infoBoxStyle}>
          <p><strong>Người cấp thuốc:</strong> {prescription.pharmacistId || "Dược sĩ hệ thống"}</p>
          <p><strong>Trạng thái:</strong> <span style={{ color: prescription.status === 'unpaid' ? '#ff9f43' : '#1dd1a1', fontWeight: 'bold', textTransform: 'uppercase' }}>{prescription.status === 'unpaid' ? 'Chưa thanh toán' : 'Đã thanh toán'}</span></p>
          <p><strong>Ngày cấp:</strong> {prescription.createdAt?.toDate ? prescription.createdAt.toDate().toLocaleDateString('vi-VN') : "Vừa xong"}</p>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ borderBottom: '2px solid #f1f2f6', paddingBottom: '10px', color: '#2d3436' }}>Danh mục thuốc</h4>
          {medicinesList.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>Chưa có thuốc nào được kê.</p>
          ) : (
            medicinesList.map((med, index) => (
              <div key={index} style={medItemStyle}>
                <div style={{ flex: 1 }}>
                  {/* Sửa lại hiển thị từ drugName và dosage */}
                  <div style={{ fontWeight: 'bold', color: '#2d3436' }}>{med.drugName || med.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#0984e3', marginTop: '4px' }}>HDSD: {med.dosage || med.usage}</div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontWeight: 'bold' }}>x{med.quantity}</div>
                  <div style={{ color: '#ff4757', fontWeight: 'bold' }}>{(Number(med.price) * Number(med.quantity)).toLocaleString()}đ</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={totalBoxStyle}>
          <span>Tổng tiền thanh toán:</span>
          <span style={{ fontSize: '1.4rem', color: '#ff4757' }}>{total.toLocaleString()}đ</span>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={secondaryBtnStyle}>Trở về</button>
          <button onClick={handleBuyAll} style={primaryBtnStyle}>MUA ĐƠN THUỐC NÀY</button>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const infoBoxStyle = { background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '25px', lineHeight: '1.8', border: '1px solid #eee' };
const medItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #f1f2f6' };
const totalBoxStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '20px', background: '#fff9db', borderRadius: '10px', fontWeight: 'bold' };
const primaryBtnStyle = { flex: 2, padding: '16px', background: '#00b894', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const secondaryBtnStyle = { flex: 1, padding: '16px', background: 'white', color: '#636e72', border: '1px solid #dfe6e9', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };

export default PrescriptionDetail;