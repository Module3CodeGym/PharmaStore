import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import './MyHealth.css'; // Sẽ tạo file CSS ở bước 2

const MyHealth = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchRecords(user.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchRecords = async (userId) => {
    try {
      // Lấy danh sách phiếu khám của User hiện tại, sắp xếp mới nhất lên đầu
      const q = query(
        collection(db, "medical_records"),
        where("patientId", "==", userId),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    } catch (error) {
      console.error("Lỗi lấy hồ sơ:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-msg">Đang tải hồ sơ sức khỏe...</div>;

  return (
    <div className="health-container">
      <h2 className="page-title">📂 Hồ sơ sức khỏe điện tử</h2>

      {records.length === 0 ? (
        <div className="empty-state">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="Empty" width="100" />
          <p>Bạn chưa có lịch sử khám bệnh nào.</p>
        </div>
      ) : (
        <div className="records-grid">
          {records.map(record => (
            <div key={record.id} className="record-card">
              
              {/* Header Card: Ngày & Trạng thái */}
              <div className="card-header-custom">
                <div className="date-badge">
                  <i className="far fa-calendar-alt"></i>
                  {record.createdAt?.seconds 
                    ? new Date(record.createdAt.seconds * 1000).toLocaleDateString('vi-VN') 
                    : '...'}
                </div>
                <span className={`status-badge ${record.status}`}>
                  {record.status === 'done' ? '✅ Đã có thuốc' : '⏳ Chờ dược sĩ'}
                </span>
              </div>
              
              {/* Nội dung chính */}
              <div className="card-body-custom">
                <p><strong>👨‍⚕️ Bác sĩ:</strong> {record.doctorName}</p>
                <div className="diagnosis-box">
                  <label>Chẩn đoán:</label>
                  <p>{record.diagnosis}</p>
                </div>
                <div className="symptoms-box">
                  <label>Triệu chứng:</label>
                  <p>{record.symptoms}</p>
                </div>
              </div>

              {/* Footer: Nút bấm */}
              <div className="card-footer-custom">
                {record.status === 'done' ? (
                  <button 
                    className="view-pres-btn"
                    onClick={() => navigate(`/user/prescription/${record.id}`)}
                  >
                    Xem đơn thuốc & Mua ngay 💊
                  </button>
                ) : (
                  <button className="waiting-btn" disabled>
                    Đang chờ kê đơn...
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