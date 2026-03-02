import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebaseConfig';
// SỬA TẠI ĐÂY: Import thêm doc, getDoc, writeBatch
import { collection, query, where, onSnapshot, orderBy, serverTimestamp, doc, getDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyHealth = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  // 1. Theo dõi trạng thái đăng nhập và lấy dữ liệu thật từ Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "medical_records"),
          where("patientId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecords(data);
          setLoading(false);
        }, (error) => {
          console.error("Lỗi lấy hồ sơ:", error);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
        navigate('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // 2. SỬA LẠI: Hàm gửi đánh giá sử dụng Transaction/Batch
  const handleSubmitReview = async () => {
    if (!selectedDoctor || !selectedDoctor.doctorId) return;
    
    try {
      const doctorId = selectedDoctor.doctorId;
      const doctorRef = doc(db, "users", doctorId);
      
      // Khởi tạo Batch để chạy 2 lệnh cùng lúc
      const batch = writeBatch(db);

      // Lệnh 1: Tạo document review mới
      const newReviewRef = doc(collection(db, "reviews"));
      batch.set(newReviewRef, {
        doctorId: doctorId,
        doctorName: selectedDoctor.doctorName,
        patientId: auth.currentUser.uid,
        patientName: auth.currentUser.displayName || "Bệnh nhân",
        rating: Number(rating), // Đảm bảo lưu đúng kiểu số
        comment: comment,
        createdAt: serverTimestamp()
      });

      // Lấy điểm hiện tại của bác sĩ
      const doctorSnap = await getDoc(doctorRef);
      if (doctorSnap.exists()) {
        const doctorData = doctorSnap.data();
        const currentRating = Number(doctorData.rating) || 0;
        const currentCount = Number(doctorData.reviewCount) || 0;

        // Công thức tính điểm trung bình mới
        const newCount = currentCount + 1;
        const newAverage = ((currentRating * currentCount) + Number(rating)) / newCount;

        // Lệnh 2: Cập nhật lại điểm số cho bác sĩ
        batch.update(doctorRef, {
          rating: Number(newAverage.toFixed(1)),
          reviewCount: newCount
        });
      }

      // Thực thi đồng thời cả 2 lệnh
      await batch.commit();

      toast.success("Cảm ơn bạn đã đánh giá bác sĩ!");
      setShowRatingModal(false);
      setComment("");
      setRating(5); // Reset lại số sao
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      toast.error("Không thể gửi đánh giá do lỗi phân quyền hoặc kết nối.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Đang tải hồ sơ sức khỏe...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <h2 style={{ color: '#2d3436', marginBottom: '30px', textAlign: 'center', fontWeight: '700' }}>
        📂 Hồ sơ sức khỏe của tôi
      </h2>

      {records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p style={{ color: '#b2bec3' }}>Bạn chưa có lịch sử khám bệnh nào trên hệ thống.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {records.map(record => (
            <div key={record.id} style={cardStyle}>
              {/* Header Card */}
              <div style={cardHeaderStyle}>
                <div style={{ fontSize: '0.85rem', color: '#636e72' }}>
                  📅 {record.createdAt?.seconds ? new Date(record.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Mới'}
                </div>
                <span style={{ 
                  ...statusBadgeStyle, 
                  background: record.status === 'done' ? '#e3f9e5' : '#fff3cd',
                  color: record.status === 'done' ? '#1f9d55' : '#856404'
                }}>
                  {record.status === 'done' ? '✅ HOÀN THÀNH' : '⏳ ĐANG XỬ LÝ'}
                </span>
              </div>
              
              {/* Body Content */}
              <div style={{ padding: '20px' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: '700' }}>👨‍⚕️ {record.doctorName}</p>
                <p style={{ fontSize: '0.9rem', color: '#636e72' }}><b>Chẩn đoán:</b> {record.diagnosis}</p>
                
                {/* Khu vực chứa thân thẻ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    {record.status === 'done' && (
                    <button 
                        onClick={() => { setSelectedDoctor(record); setShowRatingModal(true); setRating(5); }}
                        style={ratingBtnStyle}
                    >
                        ⭐ Đánh giá bác sĩ
                    </button>
                    )}
                </div>
              </div>

              {/* Footer Button */}
              <div style={{ padding: '15px 20px', borderTop: '1px solid #f1f2f6' }}>
                <button 
                  onClick={() => navigate(`/user/prescription/${record.id}`)}
                  disabled={record.status !== 'done'}
                  style={{ 
                    ...buyBtnStyle,
                    background: record.status === 'done' ? '#00b894' : '#dfe6e9',
                    cursor: record.status === 'done' ? 'pointer' : 'not-allowed'
                  }}
                >
                  {record.status === 'done' ? 'Xem đơn thuốc & Mua ngay 💊' : 'Đang chờ dược sĩ...'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL ĐÁNH GIÁ */}
      {showRatingModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Đánh giá bác sĩ</h3>
            <p>Bác sĩ: <b>{selectedDoctor?.doctorName}</b></p>
            <div style={{ fontSize: '2rem', margin: '15px 0' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setRating(star)} style={{ cursor: 'pointer', color: star <= rating ? '#ffc107' : '#e4e5e9' }}>★</span>
              ))}
            </div>
            <textarea 
              placeholder="Nhận xét của bạn về chất lượng khám..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={textareaStyle}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowRatingModal(false)} style={cancelBtnStyle}>Hủy</button>
              <button onClick={handleSubmitReview} style={confirmBtnStyle}>Gửi đánh giá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const cardStyle = { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f2f6' };
const cardHeaderStyle = { padding: '15px 20px', background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f2f6' };
const statusBadgeStyle = { fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' };
const ratingBtnStyle = { background: 'none', border: '1px solid #fdcb6e', color: '#e1b12c', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', width: 'fit-content' };
const buyBtnStyle = { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { background: 'white', padding: '30px', borderRadius: '20px', width: '400px', textAlign: 'center' };
const textareaStyle = { width: '100%', height: '80px', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', resize: 'none' };
const cancelBtnStyle = { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' };
const confirmBtnStyle = { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#00b894', color: 'white', fontWeight: 'bold', cursor: 'pointer' };

export default MyHealth;