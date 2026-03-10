import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { db } from '../../../firebaseConfig'; 
// import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- DỮ LIỆU ẢO (MOCK DATA) ---
  const MOCK_PATIENT = {
    id: patientId || "patient_001",
    displayName: "Nguyễn Thị Thu Hà",
    phone: "0905123456",
    email: "thuha@gmail.com",
    address: "123 Nguyễn Văn Linh, Đà Nẵng",
    gender: "Nữ",
    age: 28
  };

  const MOCK_HISTORY = [
    {
      id: "rec_001",
      createdAt: { seconds: 1709280000 }, // Ví dụ timestamp
      doctorName: "Trần Văn A",
      diagnosis: "Viêm họng cấp",
      symptoms: "Ho khan, đau rát họng, sốt nhẹ về chiều.",
      doctorNotes: "Hạn chế uống nước đá, kiêng đồ cay nóng.",
      status: "done"
    },
    {
      id: "rec_002",
      createdAt: { seconds: 1706688000 },
      doctorName: "Lê Thị B",
      diagnosis: "Rối loạn tiêu hóa",
      symptoms: "Đau bụng âm ỉ, buồn nôn sau khi ăn.",
      doctorNotes: "Ăn chín uống sôi, chia nhỏ bữa ăn.",
      status: "done"
    },
    {
      id: "rec_003",
      createdAt: { seconds: 1704096000 }, // Cũ hơn
      doctorName: "Trần Văn A",
      diagnosis: "Cảm cúm mùa",
      symptoms: "Hắt hơi, sổ mũi, mệt mỏi toàn thân.",
      doctorNotes: "",
      status: "done"
    }
  ];

  useEffect(() => {
    // Giả lập delay load dữ liệu
    const fetchData = () => {
      setTimeout(() => {
        setPatient(MOCK_PATIENT);
        setHistory(MOCK_HISTORY);
        setLoading(false);
      }, 500);
    };
    
    fetchData();

    /* --- CODE FIREBASE CŨ (GIỮ LẠI) ---
    const fetchDataFirebase = async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", patientId));
        if (userSnap.exists()) {
          setPatient({ id: userSnap.id, ...userSnap.data() });
        }
        const q = query(
          collection(db, "medical_records"),
          where("patientId", "==", patientId),
          orderBy("createdAt", "desc")
        );
        const historySnap = await getDocs(q);
        const historyData = historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(historyData);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    // fetchDataFirebase();
    */
  }, [patientId]);

  if (loading) return <div style={{padding: 30}}>Đang tải hồ sơ...</div>;
  if (!patient) return <div style={{padding: 30}}>Không tìm thấy bệnh nhân.</div>;

  return (
    <div style={{ padding: '30px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Nút quay lại */}
      <button onClick={() => navigate('/doctor/patients')} style={{ marginBottom: '20px', border: 'none', background: 'none', color: '#636e72', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <i className="fas fa-arrow-left"></i> Quay lại danh sách
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* --- CỘT TRÁI: THÔNG TIN CÁ NHÂN --- */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '100px', height: '100px', background: '#e3f2fd', borderRadius: '50%', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#0984e3', fontWeight: 'bold' }}>
              {patient.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2 style={{ margin: '0', color: '#2d3436' }}>{patient.displayName}</h2>
            <p style={{ color: '#0984e3', fontWeight: '600', marginTop: '5px' }}>BN-{patient.id.split('_')[1] || "XXX"}</p>
          </div>

          <hr style={{ borderTop: '1px solid #f1f1f1', margin: '20px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <small style={{ color: '#b2bec3', fontWeight: 'bold', textTransform: 'uppercase' }}>Số điện thoại</small>
              <div style={{ color: '#2d3436', fontWeight: '500' }}>{patient.phone || "Chưa cập nhật"}</div>
            </div>
            <div>
              <small style={{ color: '#b2bec3', fontWeight: 'bold', textTransform: 'uppercase' }}>Email</small>
              <div style={{ color: '#2d3436', fontWeight: '500' }}>{patient.email}</div>
            </div>
            <div>
              <small style={{ color: '#b2bec3', fontWeight: 'bold', textTransform: 'uppercase' }}>Địa chỉ</small>
              <div style={{ color: '#2d3436', fontWeight: '500' }}>{patient.address || "Chưa cập nhật"}</div>
            </div>
            {/* Hiển thị thêm thông tin Mock */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <small style={{ color: '#b2bec3', fontWeight: 'bold', textTransform: 'uppercase' }}>Tuổi</small>
                    <div style={{ color: '#2d3436', fontWeight: '500' }}>{patient.age}</div>
                </div>
                <div>
                    <small style={{ color: '#b2bec3', fontWeight: 'bold', textTransform: 'uppercase' }}>Giới tính</small>
                    <div style={{ color: '#2d3436', fontWeight: '500' }}>{patient.gender}</div>
                </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', background: '#e3f9e5', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: '800', color: '#00b894' }}>{history.length}</span>
            <span style={{ color: '#00b894', fontWeight: '600' }}>Lần khám bệnh</span>
          </div>
        </div>

        {/* --- CỘT PHẢI: LỊCH SỬ KHÁM BỆNH --- */}
        <div>
          <h3 style={{ color: '#2d3436', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-history" style={{color: '#0984e3'}}></i> Lịch sử khám bệnh
          </h3>

          {history.length === 0 ? (
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', color: '#b2bec3' }}>
              Chưa có lịch sử khám bệnh nào.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {history.map((record) => (
                <div key={record.id} style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderLeft: '5px solid #0984e3', position: 'relative' }}>
                  
                  {/* Header Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px dashed #eee', paddingBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', color: '#2d3436', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="far fa-calendar-alt text-primary"></i> 
                      {record.createdAt?.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '...'}
                    </div>
                    <div style={{ color: '#636e72', fontSize: '0.9rem', background: '#f1f2f6', padding: '4px 10px', borderRadius: '15px' }}>
                      BS. {record.doctorName || "Không rõ"}
                    </div>
                  </div>

                  {/* Nội dung khám */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <small style={{ color: '#b2bec3', fontWeight: 'bold', fontSize: '0.8rem' }}>CHẨN ĐOÁN:</small>
                      <p style={{ margin: '5px 0', fontWeight: '700', color: '#2d3436', fontSize: '1.1rem' }}>{record.diagnosis}</p>
                    </div>
                    <div>
                      <small style={{ color: '#b2bec3', fontWeight: 'bold', fontSize: '0.8rem' }}>TRIỆU CHỨNG:</small>
                      <p style={{ margin: '5px 0', color: '#636e72' }}>{record.symptoms}</p>
                    </div>
                  </div>

                  {/* Ghi chú & Đơn thuốc */}
                  <div style={{ marginTop: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    {record.doctorNotes && (
                      <div style={{ marginBottom: '10px', color: '#d63031', fontSize: '0.95rem' }}>
                        <strong><i className="fas fa-exclamation-circle"></i> Lưu ý:</strong> {record.doctorNotes}
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#636e72' }}>Trạng thái: 
                        <span style={{ 
                          marginLeft: '8px', fontWeight: 'bold', 
                          color: record.status === 'done' ? '#00b894' : '#f39c12',
                          background: record.status === 'done' ? '#e3f9e5' : '#fff3cd',
                          padding: '2px 8px', borderRadius: '4px'
                        }}>
                          {record.status === 'done' ? 'Đã có đơn thuốc' : 'Đang chờ xử lý'}
                        </span>
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PatientDetail;