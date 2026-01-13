import React from 'react';
import styles from './Textarea.module.scss';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    required?: boolean;
}

const Textarea = ({ label, error, required, className = '', ...props }: TextareaProps) => {
    return (
        <div className={`${styles.container} ${className}`}>
            {label && (
                <label className={styles.label}>
                    {label} {required && <span className={styles.required}>*</span>}
                </label>
            )}
            
            <textarea
                className={`${styles.textarea} ${error ? styles.isError : ''}`}
                {...props}
            />
            
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default Textarea;