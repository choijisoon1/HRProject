import PageLayout from '../../components/common/PageLayout';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import styles from './DashBoard.module.scss';

const Dashboard = () => {
    return (
        <PageLayout>
            <PageHeader 
                title="대시보드" 
                description="현재 개발 진행 상황 및 안내 사항입니다. (추후 위젯으로)" 
            />

            <div className={styles.container}>
                {/* 완료된 기능 카드 */}
                <div className={styles.card}>
                    <h3>✅ 개발 완료된 기능</h3>
                    <ul className={styles.list}>
                        <li>
                            <span className={styles.tag}>Auth</span> 
                            로그인 / 회원가입 (Supabase 연동)
                        </li>
                        <li>
                            <span className={styles.tag}>Auth</span> 
                            자동 로그아웃 타이머 / 세션 관리
                        </li>
                        <li>
                            <span className={styles.tag}>Layout</span> 
                            메인 레이아웃 (사이드바, 헤더)
                        </li>
                        <li>
                            <span className={styles.tag}>User</span> 
                            사원 목록 조회 (Employees)
                        </li>
                        <li>
                            <span className={styles.tag}>User</span> 
                            마이페이지 (내 정보 수정, 비밀번호 변경)
                        </li>
                        <li>
                            <span className={styles.tag}>Feature</span> 
                            연차/반차 신청 및 캘린더 조회
                        </li>
                        <li>
                            <span className={styles.tag}>Feature</span> 
                            연차/반차 신청, 승인완료 시 알림기능
                        </li>
                        <li>
                            <span className={styles.tag}>Feature</span> 
                            스케줄 관리 (체크리스트) 페이지 초안, 체크리스트에서 변경 고려중
                        </li>
                    </ul>
                </div>

                {/* 예정된 기능 카드 */}
                <div className={styles.card}>
                    <h3>🚧 개발 예정 기능</h3>
                    <ul className={styles.list}>
                        <li className={styles.todo}>대시보드 위젯 (차트, 요약 정보) 구현</li>
                        <li className={styles.todo}>반응형 적용</li>
                        <li className={styles.todo}>관리자(Admin) 전용 기능 추가</li>
                        <li className={styles.todo}>간편 스케줄 관리 시스템 추가 구현</li>
                        <li className={styles.todo}>form 컴포넌트 필요</li>
                    </ul>
                </div>
            </div>
        </PageLayout>
    );
};

export default Dashboard;