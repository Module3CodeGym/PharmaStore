import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState({
      name: "Nguyễn Thái Sơn",
      specialty: "Nội tổng quát", 
      phone: "0988.xxx.xxx",
      email: "thaison@pharmastore.vn"
  });

  return (
    <div className="tab-container">
      <div className="header-flex">
         <h2>👤 Hồ sơ cá nhân</h2>
         <button className="btn-edit" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Hủy bỏ" : "✏️ Chỉnh sửa"}
         </button>
      </div>

      <div className="form-box">
        <div className="form-group">
            <label>Họ và tên:</label>
            <input 
                type="text" 
                value={info.name} 
                disabled={!isEditing}
                onChange={(e) => setInfo({...info, name: e.target.value})} 
            />
        </div>
        <div className="form-group">
            <label>Chuyên khoa:</label>
            <input 
                type="text" 
                value={info.specialty} 
                disabled={!isEditing}
                onChange={(e) => setInfo({...info, specialty: e.target.value})} 
            />
        </div>
        <div className="form-group">
            <label>Số điện thoại:</label>
            <input 
                type="text" 
                value={info.phone} 
                disabled={!isEditing}
                onChange={(e) => setInfo({...info, phone: e.target.value})} 
            />
        </div>
        <div className="form-group">
            <label>Email:</label>
            <input 
                type="text" 
                value={info.email} 
                disabled={!isEditing}
                onChange={(e) => setInfo({...info, email: e.target.value})} 
            />
        </div>
        {isEditing && <button className="btn-add" onClick={() => setIsEditing(false)}>💾 Lưu thay đổi</button>}
      </div>
    </div>
  );
};

export default Profile;