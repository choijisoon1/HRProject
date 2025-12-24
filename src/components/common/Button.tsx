import React from 'react';
import styles from './Button.module.scss';

/* 버튼 옵션 prop */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'social';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) => {
    return (
        <button
            className={`
            ${styles.button} 
            ${styles[variant]} 
            ${styles[size]} 
            ${fullWidth ? styles.full : ''} 
            ${className}
        `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
