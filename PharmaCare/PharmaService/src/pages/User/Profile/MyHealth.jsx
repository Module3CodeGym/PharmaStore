import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './MyHealth.css'; // Sẽ tạo file CSS ở bước 2

// const MyHealth = () => {
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         await fetchRecords(user.uid);
//       } else {
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const fetchRecords = async (userId) => {
//     try {
//       // Lấy danh sách phiếu khám của User hiện tại, sắp xếp mới nhất lên đầu
//       const q = query(
//         collection(db, "medical_records"),
//         where("patientId", "==", userId),
//         orderBy("createdAt", "desc")
//       );
      
//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setRecords(data);
//     } catch (error) {
//       console.error("Lỗi lấy hồ sơ:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="loading-msg">Đang tải hồ sơ sức khỏe...</div>;

//   return (
//     <div className="health-container">
//       <h2 className="page-title">📂 Hồ sơ sức khỏe điện tử</h2>

//       {records.length === 0 ? (
//         <div className="empty-state">
//           <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="Empty" width="100" />
//           <p>Bạn chưa có lịch sử khám bệnh nào.</p>
//         </div>
//       ) : (
//         <div className="records-grid">
//           {records.map(record => (
//             <div key={record.id} className="record-card">
              
//               {/* Header Card: Ngày & Trạng thái */}
//               <div className="card-header-custom">
//                 <div className="date-badge">
//                   <i className="far fa-calendar-alt"></i>
//                   {record.createdAt?.seconds 
//                     ? new Date(record.createdAt.seconds * 1000).toLocaleDateString('vi-VN') 
//                     : '...'}
//                 </div>
//                 <span className={`status-badge ${record.status}`}>
//                   {record.status === 'done' ? '✅ Đã có thuốc' : '⏳ Chờ dược sĩ'}
//                 </span>
//               </div>
              
//               {/* Nội dung chính */}
//               <div className="card-body-custom">
//                 <p><strong>👨‍⚕️ Bác sĩ:</strong> {record.doctorName}</p>
//                 <div className="diagnosis-box">
//                   <label>Chẩn đoán:</label>
//                   <p>{record.diagnosis}</p>
//                 </div>
//                 <div className="symptoms-box">
//                   <label>Triệu chứng:</label>
//                   <p>{record.symptoms}</p>
//                 </div>
//               </div>

//               {/* Footer: Nút bấm */}
//               <div className="card-footer-custom">
//                 {record.status === 'done' ? (
//                   <button 
//                     className="view-pres-btn"
//                     onClick={() => navigate(`/user/prescription/${record.id}`)}
//                   >
//                     Xem đơn thuốc & Mua ngay 💊
//                   </button>
//                 ) : (
//                   <button className="waiting-btn" disabled>
//                     Đang chờ kê đơn...
//                   </button>
//                 )}
//               </div>

//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };
const MyHealth = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập gọi API lấy dữ liệu sau 1 giây
    const timer = setTimeout(() => {
      const mockData = [
        {
          id: "REC001",
          doctorName: "BS. Nguyễn Văn A",
          diagnosis: "Viêm họng cấp tính",
          symptoms: "Ho kéo dài, đau họng, sốt nhẹ về chiều",
          status: "done", // Đã có thuốc
          createdAt: { seconds: 1707738000 } // 12/02/2024
        },
        {
          id: "REC002",
          doctorName: "BS. Trần Thị B",
          diagnosis: "Rối loạn tiêu hóa",
          symptoms: "Đau bụng âm ỉ, buồn nôn",
          status: "pending_pharmacist", // Đang chờ dược sĩ
          createdAt: { seconds: 1707824400 } // 13/02/2024
        },
        {
          id: "REC003",
          doctorName: "BS. Lê Minh C",
          diagnosis: "Dị ứng thời tiết",
          symptoms: "Mẩn ngứa cánh tay, hắt hơi liên tục",
          status: "done",
          createdAt: { seconds: 1707651600 } // 11/02/2024
        }
      ];
      setRecords(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: '#636e72' }}>
        ⏳ Đang tải hồ sơ sức khỏe điện tử...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ color: '#2d3436', marginBottom: '30px', textAlign: 'center', fontWeight: '700' }}>
        📂 Hồ sơ sức khỏe điện tử
      </h2>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="Empty" width="120" style={{ opacity: 0.5 }} />
          <p style={{ color: '#b2bec3', marginTop: '20px', fontSize: '1.1rem' }}>Bạn chưa có lịch sử khám bệnh nào.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {records.map(record => (
            <div key={record.id} style={{ 
              background: 'white', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
              border: '1px solid #f1f2f6',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              
              {/* Header Card */}
              <div style={{ 
                padding: '15px 20px', 
                background: '#f8f9fa', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #f1f2f6'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#636e72', fontWeight: '600' }}>
                  📅 {new Date(record.createdAt.seconds * 1000).toLocaleDateString('vi-VN')}
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontWeight: '700',
                  background: record.status === 'done' ? '#e3f9e5' : '#fff3cd',
                  color: record.status === 'done' ? '#1f9d55' : '#856404'
                }}>
                  {record.status === 'done' ? '✅ ĐÃ CÓ THUỐC' : '⏳ CHỜ KÊ ĐƠN'}
                </span>
              </div>
              
              {/* Body Content */}
              <div style={{ padding: '20px' }}>
                <p style={{ margin: '0 0 15px 0', fontSize: '1.05rem', fontWeight: '700', color: '#2d3436' }}>
                  👨‍⚕️ {record.doctorName}
                </p>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#b2bec3', textTransform: 'uppercase', fontWeight: '700' }}>Chẩn đoán:</label>
                  <p style={{ margin: '5px 0 0', color: '#2d3436', fontSize: '0.95rem', lineHeight: '1.5' }}>{record.diagnosis}</p>
                </div>

                <div style={{ marginBottom: '5px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#b2bec3', textTransform: 'uppercase', fontWeight: '700' }}>Triệu chứng:</label>
                  <p style={{ margin: '5px 0 0', color: '#636e72', fontSize: '0.9rem', fontStyle: 'italic' }}>{record.symptoms}</p>
                </div>
              </div>

              {/* Footer Button */}
              <div style={{ padding: '15px 20px', background: 'white' }}>
                {record.status === 'done' ? (
                  <button 
                    onClick={() => navigate(`/user/prescription/${record.id}`)}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      background: '#00b894', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 184, 148, 0.2)'
                    }}
                  >
                    Xem đơn thuốc & Mua ngay 💊
                  </button>
                ) : (
                  <button 
                    disabled 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      background: '#dfe6e9', 
                      color: '#b2bec3', 
                      border: 'none', 
                      borderRadius: '10px', 
                      fontWeight: 'bold', 
                      cursor: 'not-allowed'
                    }}
                  >
                    Đang chờ dược sĩ xử lý...
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyHealth;