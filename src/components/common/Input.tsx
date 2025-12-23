import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
}

const Input = ({ label, error, required, className = '', ...props }: InputProps) => {
    return (
        <div className={`${styles.container} ${className}`}>
        <label className={styles.label}>
            {label} {required && <span className={styles.required}>*</span>}
        </label>
        <input 
            className={`${styles.input} ${error ? styles.isError : ''}`} 
            {...props} 
        />
        {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default Input;