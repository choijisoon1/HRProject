import styles from './Header.module.scss';
import Input from '../common/Input';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={styles.header}>
            {/* 검색창, 여기도 공통컴포넌트로 빼야할 듯? */}
            <div className={styles.searchBar}>
                <Input placeholder="Search anything..." icon="🔍" style={{ marginBottom: '0' }} />
            </div>

            {/* 우측 메뉴 */}
            <div className={styles.rightMenu}>
                {/* 임시링크라 경로는 교체 예정 */}
                <Link to="/documents" className={styles.link}>
                    Documents
                </Link>
                <Link to="/news" className={styles.link}>
                    News
                </Link>
                <Link to="/payslip" className={styles.link}>
                    Payslip
                </Link>
                <Link to="/report" className={styles.link}>
                    Report
                </Link>

                {/* 프로필 이미지 (임시 원형 배경색만) */}
                <div className={styles.profile}>
                    <div className={styles.avatar} />
                </div>
            </div>
        </header>
    );
};

export default Header;
