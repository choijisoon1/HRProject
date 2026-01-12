import React from 'react';
import styles from './FormRow.module.scss';

interface FormRowProps {
    children: React.ReactNode;
    /**
     * 그리드 비율 설정 (예: "1fr 1fr", "2fr 1fr", "1fr 150px")
     * @default "1fr 1fr" (반반)
     */
    ratio?: string; 
    /**
     * 모바일에서 세로로 쌓일지 여부
     * @default true
     */
    responsive?: boolean;
}

const FormRow = ({ children, ratio = "1fr 1fr", responsive = true }: FormRowProps) => {
    return (
        <div 
            className={`${styles.row} ${responsive ? styles.responsive : ''}`}
            /* 동적 스타일로 그리드 비율을 직접 */
            style={{ gridTemplateColumns: ratio } as React.CSSProperties}
        >
            {children}
        </div>
    );
};

export default FormRow;