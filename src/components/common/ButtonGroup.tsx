import React from 'react';
import styles from './ButtonGroup.module.scss';

interface ButtonGroupProps {
    children: React.ReactNode;
    direction?: 'row' | 'column';
    gap?: number;
    align?: 'start' | 'center' | 'end' | 'stretch';
    className?: string;
}

const ButtonGroup = ({
    children,
    direction = 'row',
    gap = 12,
    align = 'stretch',
    className = '',
}: ButtonGroupProps) => {
    return (
        <div
            className={`${styles.group} ${styles[direction]} ${styles[align]} ${className}`}
            style={{ gap: `${gap}px` }} //간격은 동적으로 조절 가능하게
        >
            {children}
        </div>
    );
};

export default ButtonGroup;
