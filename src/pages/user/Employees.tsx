import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import PageLayout from '../../components/common/PageLayout'; 
import styles from './Employees.module.scss';

/* 데이터 타입 정의  */
interface Employee {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    created_at: string; /* created_at 가져와서 가입일 체크 */
}

const Employees = () => {
    const [list, setList] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    /* DB에서 데이터 가져오기 */
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false }); /* 최신순 정렬 */

            if (error) {
                console.error('에러 발생:', error);
            } else {
                setList(data || []);
            }
            setLoading(false);
        };

        fetchEmployees();
    }, []);

    return (
        <PageLayout>
            <div className={styles.header}>
                <h2>Employees</h2>
                <p>총 {list.length}명의 직원이 있습니다.</p>
            </div>

            {/* 테이블 컴포넌트화 예정 */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>권한</th>
                            <th>가입일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className={styles.empty}>로딩 중...</td></tr>
                        ) : list.length === 0 ? (
                            <tr><td colSpan={5} className={styles.empty}>데이터가 없습니다.</td></tr>
                        ) : (
                            list.map((emp) => (
                                <tr key={emp.id}>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar} /> {/* 임시 프사 */}
                                            {emp.username}
                                        </div>
                                    </td>
                                    <td>{emp.email}</td>
                                    <td>{emp.phone}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[emp.role]}`}>
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td>{new Date(emp.created_at || Date.now()).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    );
};

export default Employees;