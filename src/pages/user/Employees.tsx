import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import PageLayout from '../../components/common/PageLayout'; 
import styles from './Employees.module.scss';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import Table, { type Column } from '@/components/common/Table/Table';

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

    const columns: Column<Employee>[] = [
        {
            header: '이름',
            key: 'username',
            // 커스텀 렌더링: 프로필 사진 + 이름
            render: (emp) => (
                <div className={styles.userInfo}>
                    <div className={styles.avatar} />
                    {emp.username}
                </div>
            )
        },
        { header: '이메일', key: 'email' },
        { header: '전화번호', key: 'phone' },
        {
            header: '권한',
            key: 'role',
            /* 커스텀 렌더링: 뱃지 스타일 */
            render: (emp) => (
                <span className={`${styles.badge} ${styles[emp.role]}`}>
                    {emp.role}
                </span>
            )
        },
        {
            header: '가입일',
            key: 'created_at',
            /* 커스텀 렌더링: 날짜 포맷 */
            render: (emp) => new Date(emp.created_at).toLocaleDateString()
        }
    ];

    return (
        <PageLayout>
            <PageHeader 
                title='Employees'
                description={`총 ${list.length}명의 직원이 있습니다.`}
            />
            {/* 테이블 컴포넌트화 예정 */}
            <Table 
                columns={columns} 
                data={list} 
                loading={loading} 
            />
        </PageLayout>
    );
};

export default Employees;