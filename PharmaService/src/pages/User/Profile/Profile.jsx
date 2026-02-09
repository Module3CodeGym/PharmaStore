import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState({
    name: "Nguyễn Văn A",
    phone: "0909.xxx.xxx",
    address: "Hà Nội",
    email: "user@gmail.com"
  });

  return (
    <div className="tab-container">
      <div className="header-flex">
        <h2>👤 Hồ sơ khách hàng</h2>
        <button
          className="btn-edit"
          onClick={() => setIsEditing(!isEditing)}
        >
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
            onChange={(e) =>
              setInfo({ ...info, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            value={info.phone}
            disabled={!isEditing}
            onChange={(e) =>
              setInfo({ ...info, phone: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ:</label>
          <input
            type="text"
            value={info.address}
            disabled={!isEditing}
            onChange={(e) =>
              setInfo({ ...info, address: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            value={info.email}
            disabled
          />
        </div>

        {isEditing && (
          <button
            className="btn-add"
            onClick={() => setIsEditing(false)}
          >
            💾 Lưu thay đổi
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
