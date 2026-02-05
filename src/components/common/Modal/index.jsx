import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Reusable Modal Component
 * 
 * Features:
 * - Backdrop click to close
 * - ESC key to close
 * - Custom header, body, footer
 * - Different sizes (small, medium, large, full)
 * - Animations
 */

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium',
    closeOnBackdrop = true,
    closeOnEsc = true,
    showCloseButton = true,
    className = '',
}) => {
    // Handle ESC key
    useEffect(() => {
        if (!isOpen || !closeOnEsc) return;

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, closeOnEsc, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className={`modal modal-${size} ${className}`}>
                {/* Modal Header */}
                <div className="modal-header">
                    {title && <h3 className="modal-title">{title}</h3>}
                    {showCloseButton && (
                        <button
                            className="modal-close-btn"
                            onClick={onClose}
                            aria-label="Đóng"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {children}
                </div>

                {/* Modal Footer */}
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
