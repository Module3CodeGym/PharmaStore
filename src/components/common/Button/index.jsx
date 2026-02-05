import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * 
 * Variants: primary, secondary, danger, success, outline
 * Sizes: small, medium, large
 * States: loading, disabled
 */

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon = null,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const buttonClasses = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full-width',
        loading && 'btn-loading',
        disabled && 'btn-disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="spinner" />}
            {icon && !loading && <span className="btn-icon">{icon}</span>}
            <span className="btn-text">{children}</span>
        </button>
    );
};

export default Button;
