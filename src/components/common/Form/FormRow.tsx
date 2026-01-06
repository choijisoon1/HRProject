import React from 'react';
import styles from './FormRow.module.scss';

interface FormRowProps {
    children: React.ReactNode;
}

const FormRow = ({ children }: FormRowProps) => {
    return <div className={styles.row}>{children}</div>;
};

export default FormRow;