// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.scss';
import Sidebar from './Sidebar';
import Header from './Header';
import PageLayout from '../common/PageLayout';

const MainLayout = () => {
    return (
        <div className={styles.container}>
            {/* 왼쪽 영역 (사이드바) */}
            <div className={styles.sidebarArea}>
                <Sidebar />
            </div>

            {/* 오른쪽 영역 (헤더 + 컨텐츠 */}
            <div className={styles.contentWrapper}>
                <div className={styles.headerArea}>
                    <Header />
                </div>

                <main className={styles.pageContent}>
                    <PageLayout>
                        <Outlet />
                    </PageLayout>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
