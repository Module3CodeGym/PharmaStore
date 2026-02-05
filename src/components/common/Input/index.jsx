import React, { useState, useId } from 'react';
import './Input.css';

/**
 * Reusable Input Component
 * 
 * Types: text, email, password, number, date, select, textarea
 * States: error, success, disabled
 * Features: label, helper text, required indicator, icon
 */

const Input = ({
    type = 'text',
    label,
    name,
    value,
    onChange,
    placeholder,
    helperText,
    error,
    success,
    required = false,
    disabled = false,
    icon = null,
    options = [], // For select type
    rows = 3, // For textarea
    className = '',
    ...props
}) => {
    const id = useId();
    const inputId = name || id;

    const [showPassword, setShowPassword] = useState(false);

    const containerClasses = [
        'input-wrapper',
        error && 'input-error',
        success && 'input-success',
        disabled && 'input-disabled',
        className
    ].filter(Boolean).join(' ');

    const renderInput = () => {
        const inputClasses = [
            'input',
            icon && 'input-with-icon'
        ].filter(Boolean).join(' ');

        const commonProps = {
            id: inputId,
            name,
            value,
            onChange,
            placeholder,
            disabled,
            required,
            className: inputClasses,
            'aria-invalid': error ? 'true' : 'false',
            'aria-describedby': helperText ? `${inputId}-helper` : undefined,
            ...props
        };

        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        rows={rows}
                    />
                );

            case 'select':
                return (
                    <select {...commonProps}>
                        <option value="">{placeholder || 'Chọn...'}</option>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'password':
                return (
                    <div className="password-input-wrapper">
                        <input
                            {...commonProps}
                            type={showPassword ? 'text' : 'password'}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                );

            default:
                return <input {...commonProps} type={type} />;
        }
    };

    return (
        <div className={containerClasses}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}
                {renderInput()}
            </div>

            {helperText && (
                <p id={`${inputId}-helper`} className="input-helper-text">
                    {helperText}
                </p>
            )}

            {error && (
                <p className="input-error-text">{error}</p>
            )}
        </div>
    );
};

export default Input;
