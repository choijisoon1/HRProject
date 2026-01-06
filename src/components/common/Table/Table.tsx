import React from 'react';
import styles from './Table.module.scss';

export interface Column<T> {
    header: string; 
    key: string;    
    width?: string; 
    render?: (item: T) => React.ReactNode; 
}

interface TableProps<T> {
    columns: Column<T>[]; 
    data: T[];            
    loading?: boolean;    
}

const Table = <T extends { id: string | number }>({ columns, data, loading }: TableProps<T>) => {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} style={{ width: col.width }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.empty}>
                                로딩 중...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className={styles.empty}>
                                데이터가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item.id}>
                                {columns.map((col) => (
                                    <td key={`${item.id}-${col.key}`}>
                                        {/* render 함수가 있으면 그걸 쓰고, 없으면 그냥 데이터 출력 */}
                                        {col.render ? col.render(item) : (item as any)[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;