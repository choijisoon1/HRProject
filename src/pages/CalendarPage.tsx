import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { supabase } from '../api/supabaseClient';
import PageLayout from '../components/common/PageLayout';
import PageHeader from '../components/common/PageHeader/PageHeader';
import AddSchedulePopup from '../components/calendar/AddSchedulePopup';
import styles from './CalendarPage.module.scss';

/* 타입 에러 해결용 */
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface LeaveRequest {
    id: string;
    user_id: string;
    date: string;
    type: 'annual' | 'half';
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
    profiles: { username: string }; /* 누가 썼는지 이름 */
}

const CalendarPage = () => {
    const [date, setDate] = useState<Date>(new Date());
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [currentUserId, setCurrentUserId] = useState('');

    /* 팝업 상태 관리 (하나로 통합) */
    const [popupState, setPopupState] = useState<{
        isOpen: boolean;
        mode: 'add' | 'view';
        data?: any; 
    }>({ isOpen: false, mode: 'add', data: null });

    const [currentUserRole, setCurrentUserRole] = useState('');

    /* 내 ID 가져오기 & 데이터 조회 */
    const fetchLeaves = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setCurrentUserId(user.id);

        /* 권한 확인 */
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        
        let role = '';
        if (profile) {
            role = profile.role;
            setCurrentUserRole(role);
        }

        /* 쿼리 작성 */
        let query = supabase
            .from('leave_requests')
            .select(`*, profiles(username)`);

        /* 관리자 아닐 때 */
        if (role !== 'admin') {
            /* 일반유저 입장에서는 캘린더에 본인이 연차신청한, 혹은 관리자의 승인이 완료된 연차만 보이게 */
            query = query.or(`user_id.eq.${user.id},status.eq.approved`);
        }

        /* 쿼리 실행 */
        const { data, error } = await query;

        if (data) setLeaves(data);
        if (error) console.error(error);
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    /* 날짜 클릭 핸들러 (빈칸 클릭 -> 추가 팝업) */
    const handleDateClick = (value: Date) => {
        setDate(value);
        setPopupState({ isOpen: true, mode: 'add', data: null });
    };

    /* 배지 클릭 핸들러 (배지 클릭 -> 상세 팝업) */
    const handleBadgeClick = (e: React.MouseEvent, leave: LeaveRequest) => {
        e.stopPropagation();
        setPopupState({ isOpen: true, mode: 'view', data: leave });
    };

    const handleDateChange = (nextValue: Value) => {
        if (nextValue instanceof Date) setDate(nextValue);
    };

    /* 캘린더 타일 내용 */
    const tileContent = ({ date, view }: any) => {
        if (view === 'month') {
            const dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
                .toISOString().split('T')[0];
            
            const dayLeaves = leaves.filter(l => 
                l.date === dateStr && l.status !== 'rejected'
            );

            return (
                <div className={styles.badgeContainer}>
                    {dayLeaves.map(leave => (
                        <div 
                            key={leave.id} 
                            className={`${styles.leaveBadge} ${styles[leave.type]} ${styles[leave.status]}`}
                            onClick={(e) => handleBadgeClick(e, leave)} 
                        >
                            {`${leave.profiles?.username} (${leave.type === 'annual' ? '연차' : '반차'})`}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <PageLayout>
            <PageHeader 
                title="Calendar" 
                description="팀원들의 휴가 일정을 확인하고 신청할 수 있습니다." 
            />

            <div className={styles.calendarContainer}>
                <Calendar
                    onChange={handleDateChange}
                    value={date}
                    formatDay={(locale, date) => date.getDate().toString()} 
                    tileContent={tileContent}
                    onClickDay={handleDateClick} // 날짜 클릭 시 추가 팝업
                />
            </div>

            {/* 통합 팝업 하나만 렌더링 */}
            {popupState.isOpen && (
                <AddSchedulePopup 
                    isOpen={popupState.isOpen}
                    mode={popupState.mode}
                    date={date} 
                    selectedData={popupState.data} 
                    currentUserId={currentUserId} 
                    onClose={() => setPopupState({ ...popupState, isOpen: false })}
                    onSuccess={fetchLeaves}
                    currentUserRole={currentUserRole}
                />
            )}
        </PageLayout>
    );
};

export default CalendarPage;