import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';

/* 메뉴 목록 (임시 메뉴 목록, 나중에 메뉴목록 교체 및 아이콘은 폰트어썸 등 무료 아이콘 패키지로 교체) */
const MENU_ITEMS = [
    { name: '대시보드', path: '/', icon: '⊞' },
    { name: '사원 목록', path: '/employees', icon: '👥' },
    { name: '연차 결재', path: '/calendar', icon: '📅' },
    { name: '나의 일정 체크', path: '/myschedule', icon: '📝' },
    { name: 'New Menu', path: '/NewMenu', icon: '⏰' },
    { name: 'New Menu', path: '/NewMenu', icon: '💵' },
    { name: 'New Menu', path: '/NewMenu', icon: '📈' },
    { name: 'New Menu', path: '/NewMenu', icon: '🔰' },
];

const Sidebar = () => {
    const location = useLocation(); /* 현재 주소를 알아내서 활성화 표시 */

    return (
        <aside className={styles.sidebar}>
            {/* 로고 영역 */}
            <div className={styles.logoArea}>
                <span className={styles.logoIcon}>T</span>
                <h1 className={styles.logoText}>ToGateComzHR</h1>
                
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
                <Link to='/mypage' className={styles.menuItem}>
                    <span className={styles.icon}>⚙️</span>
                    <span className={styles.label}>마이 페이지</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
