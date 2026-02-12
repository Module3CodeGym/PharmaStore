import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConfig'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

// --- 1. IMPORT TOASTIFY ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Profile.css';

const DoctorProfile = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    phone: '',
    specialty: 'Khoa Nội tổng quát',
    experience: '',
    bio: '',
    photoURL: ''
  });

  // Lấy dữ liệu user khi vào trang
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
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
            photoURL: data.photoURL || user.photoURL || ''
          });
        }
      }
    };
    fetchUserData();
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
      
      {/* Container chứa Toast (Bắt buộc phải có để hiện thông báo) */}
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
          
          <div className="profile-stats">
            <div className="stat-item">
              <strong>120+</strong>
              <span>Bệnh nhân</span>
            </div>
            <div className="stat-item">
              <strong>4.8 ⭐</strong>
              <span>Đánh giá</span>
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
    </div>
  );
};

export default DoctorProfile;