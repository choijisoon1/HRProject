// src/components/common/Input.tsx
import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /* 라벨 혹은 아이콘 */
    label?: string;
    error?: string;
    required?: boolean;
    icon?: React.ReactNode;
}

const Input = ({ label, error, required, icon, className = '', ...props }: InputProps) => {
    return (
        <div className={`${styles.container} ${className}`}>
            {/* 라벨이 있을 때만 */}
            {label && (
                <label className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.inputWrapper}>
                {/* 아이콘이 있을 때 */}
                {icon && <span className={styles.icon}>{icon}</span>}

                <input
                    className={`
                        ${styles.input} 
                        ${error ? styles.isError : ''} 
                        ${icon ? styles.hasIcon : ''}
                    `}
                    {...props}
                />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default Input;
