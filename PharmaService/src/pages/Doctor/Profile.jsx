import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig'; 
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'; // Sửa: Thêm các hàm truy vấn
import { updateProfile } from 'firebase/auth';

// --- 1. IMPORT TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Profile.css';

const DoctorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]); // MỚI: State lưu lịch sử đánh giá
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    phone: '',
    specialty: 'Khoa Nội tổng quát',
    experience: '',
    bio: '',
    photoURL: '',
    rating: 0, // MỚI: Thêm trường điểm đánh giá
    reviewCount: 0 // MỚI: Thêm trường số lượt đánh giá
  });

  // Lấy dữ liệu user và lịch sử đánh giá khi vào trang
  useEffect(() => {
    let unsubscribeReviews = () => {};

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        // 1. Lấy thông tin Profile của Bác sĩ
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            displayName: data.displayName || user.displayName || '',
            email: user.email || '',
            phone: data.phone || '',
            specialty: data.specialty || 'Khoa Nội tổng quát',
            experience: data.experience || '',
            bio: data.bio || '',
            photoURL: data.photoURL || user.photoURL || '',
            rating: data.rating || 0,
            reviewCount: data.reviewCount || 0
          });
        }

        // 2. MỚI: Lấy danh sách đánh giá từ bệnh nhân
        const q = query(
            collection(db, "reviews"),
            where("doctorId", "==", user.uid),
            orderBy("createdAt", "desc")
        );
        
        unsubscribeReviews = onSnapshot(q, (snapshot) => {
            const reviewData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewData);
        });
      }
    };

    fetchUserData();

    // Cleanup function để tránh memory leak
    return () => unsubscribeReviews();
  }, []);

  // Xử lý khi nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý Lưu thay đổi
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Hiện thông báo đang xử lý
    const toastId = toast.loading("Đang cập nhật hồ sơ...");

    try {
      const user = auth.currentUser;
      const userRef = doc(db, "users", user.uid);

      // Cập nhật Firestore (Dữ liệu chi tiết)
      await updateDoc(userRef, {
        displayName: userData.displayName,
        phone: userData.phone,
        specialty: userData.specialty,
        experience: userData.experience,
        bio: userData.bio,
        photoURL: userData.photoURL
      });

      // Cập nhật Auth (Tên hiển thị & Avatar trên Header)
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL
      });

      // 2. Cập nhật thông báo THÀNH CÔNG
      toast.update(toastId, { 
        render: "Cập nhật hồ sơ thành công! 🎉", 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });

    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      // 3. Cập nhật thông báo LỖI
      toast.update(toastId, { 
        render: "Lỗi: " + error.message, 
        type: "error", 
        isLoading: false,
        autoClose: 3000 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      
      {/* Container chứa Toast */}
      <ToastContainer position="top-right" theme="light" />

      <h2 className="page-title">Hồ sơ cá nhân</h2>

      <div className="profile-grid">
        
        {/* --- CỘT TRÁI: AVATAR & INFO --- */}
        <div className="profile-card left-card">
          <div className="avatar-wrapper">
            <img 
              src={userData.photoURL || "https://via.placeholder.com/150"} 
              alt="Avatar" 
              className="profile-avatar"
              onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
            />
            {/* Nút đổi ảnh nhanh bằng link */}
            <button 
              className="change-avatar-btn"
              type="button"
              onClick={() => {
                const url = prompt("Dán đường link ảnh mới của bạn vào đây:", userData.photoURL);
                if (url) setUserData(prev => ({...prev, photoURL: url}));
              }}
              title="Đổi ảnh đại diện"
            >
              <i className="fas fa-camera"></i>
            </button>
          </div>
          
          <h3 className="profile-name">{userData.displayName || "Chưa đặt tên"}</h3>
          <p className="profile-role">{userData.specialty}</p>
          
          {/* MỚI: Sửa lại thống kê để lấy dữ liệu thực từ Firestore */}
          <div className="profile-stats">
            <div className="stat-item">
              <strong>{userData.reviewCount || 0}</strong>
              <span>Lượt đánh giá</span>
            </div>
            <div className="stat-item">
              <strong>{Number(userData.rating || 0).toFixed(1)} ⭐</strong>
              <span>Điểm TB</span>
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: FORM NHẬP LIỆU --- */}
        <div className="profile-card right-card">
          <form onSubmit={handleSave}>
            <h4 className="form-header">Thông tin chi tiết</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên</label>
                <input 
                  type="text" 
                  name="displayName" 
                  value={userData.displayName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Nhập họ tên bác sĩ"
                />
              </div>
              <div className="form-group">
                <label>Email (Không thể sửa)</label>
                <input 
                  type="email" 
                  value={userData.email} 
                  disabled 
                  className="disabled-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={userData.phone} 
                  onChange={handleChange} 
                  placeholder="VD: 0912..."
                />
              </div>
              <div className="form-group">
                <label>Chuyên khoa</label>
                <select name="specialty" value={userData.specialty} onChange={handleChange}>
                  <option value="Khoa Nội tổng quát">Khoa Nội tổng quát</option>
                  <option value="Khoa Nhi">Khoa Nhi</option>
                  <option value="Khoa Da liễu">Khoa Da liễu</option>
                  <option value="Khoa Tim mạch">Khoa Tim mạch</option>
                  <option value="Khoa Tai Mũi Họng">Khoa Tai Mũi Họng</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Kinh nghiệm làm việc</label>
              <input 
                type="text" 
                name="experience" 
                value={userData.experience} 
                onChange={handleChange} 
                placeholder="VD: 5 năm tại BV Chợ Rẫy..."
              />
            </div>

            <div className="form-group">
              <label>Giới thiệu bản thân (Bio)</label>
              <textarea 
                name="bio" 
                rows="4" 
                value={userData.bio} 
                onChange={handleChange}
                placeholder="Viết đôi dòng về kinh nghiệm và phương châm khám chữa bệnh..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Đang lưu..." : <><i className="fas fa-save"></i> Lưu thay đổi</>}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* --- MỚI: KHU VỰC LỊCH SỬ ĐÁNH GIÁ CỦA BỆNH NHÂN --- */}
      <div className="profile-card" style={{ marginTop: '30px' }}>
        <h4 className="form-header" style={{ marginBottom: '20px' }}>📜 Nhận xét từ bệnh nhân</h4>
        
        {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#b2bec3' }}>
                Chưa có bệnh nhân nào để lại đánh giá cho bạn.
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {reviews.map(review => (
                    <div key={review.id} style={{ padding: '20px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <strong style={{ color: '#0984e3', fontSize: '1.1rem' }}>{review.patientName}</strong>
                            <span style={{ fontSize: '1.2rem', color: '#ffc107', letterSpacing: '2px' }}>
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>
                        </div>
                        <p style={{ margin: '0 0 15px 0', color: '#2d3436', fontSize: '0.95rem', fontStyle: 'italic' }}>
                            "{review.comment || "Không có nhận xét chi tiết"}"
                        </p>
                        <div style={{ fontSize: '0.8rem', color: '#b2bec3', textAlign: 'right' }}>
                            {review.createdAt?.seconds ? new Date(review.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : 'Mới đây'}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

    </div>
  );
};

export default DoctorProfile;