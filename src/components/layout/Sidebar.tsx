import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

/* 메뉴 목록 (임시 메뉴 목록, 나중에 메뉴목록 교체 및 아이콘은 폰트어썸 등 무료 아이콘 패키지로 교체) */
const MENU_ITEMS = [
    { name: 'Dashboard', path: '/', icon: '⊞' },
    { name: 'Employees', path: '/employees', icon: '👥' },
    { name: 'Checklist', path: '/checklist', icon: '☑️' },
    { name: 'Time Off', path: '/timeoff', icon: '⏰' },
    { name: 'Attendance', path: '/attendance', icon: '📅' },
    { name: 'Payroll', path: '/payroll', icon: '💵' },
    { name: 'Performance', path: '/performance', icon: '📈' },
    { name: 'Recruitment', path: '/recruitment', icon: '🔰' },
];

const Sidebar = () => {
    const location = useLocation(); /* 현재 주소를 알아내서 활성화 표시 */

    return (
        <aside className={styles.sidebar}>
            {/* 로고 영역 */}
            <div className={styles.logoArea}>
                <span className={styles.logoIcon}>T</span>
                <h1 className={styles.logoText}>ToGateComzHR</h1>
                <button className={styles.collapseBtn}>{'<<'}</button>
            </div>

            {/* 네비게이션 메뉴 */}
            <nav className={styles.navMenu}>
                {MENU_ITEMS.map(item => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.name}</span>

                            {!isActive && <span className={styles.arrow}>{'>'}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* 하단 설정 영역 */}
            <div className={styles.bottomMenu}>
                <div className={styles.menuItem}>
                    <span className={styles.icon}>❓</span>
                    <span className={styles.label}>Help Center</span>
                    <span className={styles.badge}>8</span>{' '}
                    {/* 뱃지는 공통컴포넌트로 변경 생각중 , 알림쪽에서도 쓸 가능성 */}
                </div>
                <Link to='/mypage' className={styles.menuItem}>
                    <span className={styles.icon}>⚙️</span>
                    <span className={styles.label}>My Page</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
