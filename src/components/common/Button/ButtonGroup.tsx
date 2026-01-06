import React from 'react';
import styles from './ButtonGroup.module.scss';

interface ButtonGroupProps {
    children: React.ReactNode;
    direction?: 'row' | 'column';
    gap?: number;
    align?: 'start' | 'center' | 'end' | 'stretch';
    fullWidth?: boolean;
    className?: string;
}

const ButtonGroup = ({
    children,
    direction = 'row',
    gap = 12,
    align = 'stretch',
    fullWidth = true, /* 기본값 true */
    className = '',
}: ButtonGroupProps) => {
    return (
        <div
            className={`${styles.group} ${styles[direction]} ${styles[align]} ${fullWidth ? styles.full : styles.auto} ${className}`}
            style={{ gap: `${gap}px` }} /* 간격은 동적으로 조절 가능 */
        >
            {children}
        </div>
    );
};

export default ButtonGroup;
