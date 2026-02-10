import React from 'react';
import { FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay logout-modal-overlay">
            <div className="modal-content logout-modal-content">
                <div className="logout-icon-wrapper">
                    <FaSignOutAlt className="logout-warning-icon" />
                </div>
                <h2>Xác nhận đăng xuất</h2>
                <p>Bạn có chắc chắn muốn rời khỏi hệ thống PharmaCare?</p>
                <div className="modal-actions logout-actions">
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
