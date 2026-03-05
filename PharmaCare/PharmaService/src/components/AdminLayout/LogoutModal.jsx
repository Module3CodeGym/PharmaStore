import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="admin-logout-modal-overlay">
            <div className="admin-logout-modal-content">
                <div className="admin-logout-icon-wrapper">
                    <FaSignOutAlt />
                </div>
                <h2>Xác nhận đăng xuất</h2>
                <p>Bạn có chắc chắn muốn rời khỏi hệ thống PharmaCare?</p>
                <div className="admin-logout-actions">
                    <button className="btn btn-secondary" onClick={onCancel}>
                        Hủy bỏ
                    </button>
                    <button className="btn btn-danger btn-logout-confirm" onClick={onConfirm}>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;