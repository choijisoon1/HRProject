import React from 'react';
import styles from './Form.module.scss';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode;
}

const Form = ({ children, className = '', ...props }: FormProps) => {
    return (
        <form className={`${styles.form} ${className}`} {...props}>
            {children}
        </form>
    );
};

export default Form;