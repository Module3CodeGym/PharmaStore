import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // State lưu thông tin form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: ''
  });

  // State lưu dữ liệu gốc để backup khi hủy bỏ
  const [originalData, setOriginalData] = useState({});

  // 1. Lấy thông tin user khi vào trang
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        setLoading(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Hàm lấy dữ liệu từ Firestore
  const fetchUserData = async (currentUser) => {
    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      let data = {
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: '',
        address: ''
      };

      if (docSnap.exists()) {
        // Nếu đã có dữ liệu trong Firestore thì lấy ra
        const firestoreData = docSnap.data();
        data = { ...data, ...firestoreData };
      }

      setFormData(data);
      setOriginalData(data); // Lưu bản backup
    } catch (error) {
      console.error("Lỗi lấy hồ sơ:", error);
      toast.error("Không thể tải thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Xử lý khi nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Lưu thay đổi lên Firebase
  const handleSave = async () => {
    if (!user) return;

    // Validate cơ bản
    if (!formData.name || !formData.phone || !formData.address) {
      toast.warning("Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ!");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      
      // Dùng setDoc với merge: true để nếu chưa có doc thì tạo mới, có rồi thì update
      await setDoc(docRef, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email, // Email thường giữ nguyên để đối chiếu
        updatedAt: new Date()
      }, { merge: true });

      setOriginalData(formData); // Cập nhật lại bản backup
      setIsEditing(false);
      toast.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật hồ sơ!");
    }
  };

  // 4. Hủy bỏ chỉnh sửa
  const handleCancel = () => {
    setFormData(originalData); // Reset về dữ liệu gốc
    setIsEditing(false);
  };

  if (loading) return <div className="text-center mt-5">Đang tải hồ sơ...</div>;

  if (!user) {
    return <div className="text-center mt-5">Vui lòng đăng nhập để xem hồ sơ.</div>;
  }

  return (
    <div className="container mt-4 mb-5" style={{ minHeight: '60vh' }}>
      <ToastContainer />
      <div className="card shadow-sm" style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '15px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: '2px solid #f0f2f5' }}>
          <h4 className="mb-0" style={{ color: '#00b894' }}>
            <i className="fas fa-user-circle me-2"></i> Hồ sơ cá nhân
          </h4>
          <div>
            {!isEditing ? (
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIsEditing(true)}
                style={{ borderRadius: '20px', padding: '5px 15px' }}
              >
                <i className="fas fa-pencil-alt me-1"></i> Chỉnh sửa
              </button>
            ) : (
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancel}
                style={{ borderRadius: '20px', padding: '5px 15px' }}
              >
                <i className="fas fa-times me-1"></i> Hủy bỏ
              </button>
            )}
          </div>
        </div>

        {/* Body Form */}
        <div className="card-body p-4">
          <div className="row g-3">
            
            {/* Họ và tên */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Họ và tên <span className="text-danger">*</span></label>
              <input
                type="text"
                className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Nhập họ và tên"
                style={{ padding: '10px' }}
              />
            </div>

            {/* Email (Luôn disable) */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control bg-light border-0"
                value={formData.email}
                disabled
                style={{ padding: '10px' }}
              />
            </div>

            {/* Số điện thoại */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Số điện thoại <span className="text-danger">*</span></label>
              <input
                type="text"
                className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Nhập số điện thoại"
                style={{ padding: '10px' }}
              />
            </div>

            {/* Địa chỉ */}
            <div className="col-12">
              <label className="form-label fw-bold">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
              <textarea
                className={`form-control ${!isEditing ? 'bg-light border-0' : ''}`}
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã...)"
                style={{ padding: '10px' }}
              ></textarea>
            </div>

            {/* Nút lưu (Chỉ hiện khi Edit) */}
            {isEditing && (
              <div className="col-12 mt-4 text-end">
                <button 
                  className="btn btn-secondary me-2"
                  onClick={handleCancel}
                  style={{ borderRadius: '8px', padding: '10px 20px' }}
                >
                  Hủy bỏ
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={{ borderRadius: '8px', padding: '10px 20px', background: '#00b894', border: 'none' }}
                >
                  <i className="fas fa-save me-1"></i> Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;