import { useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import Input from '../common/Form/Input';
import Button from '../common/Button/Button'; 
import styles from './AddSchedulePopup.module.scss';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; /* 작업 성공 시 캘린더 새로고침 */
    mode: 'add' | 'view';  /* 추가 모드 vs 보기 모드 */
    date: Date;
    selectedData?: any;    /* 보기 모드일 때 보여줄 데이터 */
    currentUserId?: string;
    currentUserRole?: string;
}

const AddSchedulePopup = ({ isOpen, onClose, onSuccess, mode, date, selectedData, currentUserId, currentUserRole }: Props) => {
    /* 입력폼 상태 */
    const [leaveType, setLeaveType] = useState('annual');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    /* 날짜 포맷 (YYYY-MM-DD) */
    const dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString().split('T')[0];

    /* 휴가 신청 */
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        /* 현재 로그인한 유저(신청자) 정보 */
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        /* 신청자 이름 가져오기 (알림 메시지용) */
        const { data: userData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
        
        /* 휴가 신청 insert */
        const { error } = await supabase.from('leave_requests').insert([
            {
                user_id: user.id,
                date: dateStr,
                type: leaveType,
                reason: reason,
                status: 'pending'
            }
        ]);

        if (error) alert('신청 실패: ' + error.message);
        else {
            const { data: admins } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'admin');

            if (admins && admins.length > 0) {
                /* 관리자들에게 알림 보내기 */
                const notifications = admins.map(admin => ({
                    user_id: admin.id, /* 관리자 ID */
                    message: `📢 ${userData?.username}님이 휴가를 신청했습니다.`,
                    is_read: false,
                    link: '/calendar' /* 클릭하면 캘린더로 이동 */
                }));

                await supabase.from('notifications').insert(notifications);
            }

            alert('결재 요청이 완료되었습니다.');
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    // [로직 2] 신청 철회 (Delete)
    const handleDelete = async () => {
        if (!confirm('정말 신청을 철회하시겠습니까?')) return;
        setLoading(true);

        const { error } = await supabase
            .from('leave_requests')
            .delete()
            .eq('id', selectedData.id);

        if (error) alert('철회 실패: ' + error.message);
        else {
            alert('철회되었습니다.');
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    const handleApprove = async (status: 'approved' | 'rejected') => {
        if (!confirm(`${status === 'approved' ? '승인' : '반려'} 하시겠습니까?`)) return;
        setLoading(true);

        const { error } = await supabase
            .from('leave_requests')
            .update({ status: status }) /* 상태 변경 */
            .eq('id', selectedData.id);

        if (error) alert('처리 실패: ' + error.message);
        else {
            const message = status === 'approved'
            ? `🎉 ${selectedData.date} 휴가가 승인되었습니다.` : `😥 ${selectedData.date} 휴가가 반려되었습니다.`

            await supabase.from('notifications').insert([
                {
                    user_id: selectedData.user_id, /* 받는 사람 (결재 요청자) */
                    message: message,
                    is_read: false,
                    link: '/calendar'
                }
            ]);
            alert('처리되었습니다.');
            onSuccess();
            onClose();
        }
        setLoading(false);
    };

    /* 내가 쓴 글인지 확인 */
    const isMyPost = currentUserId === selectedData?.user_id;
    const isAdmin = currentUserRole === 'admin';
    const showReason = isMyPost || isAdmin; /* 본인이거나 관리자일 때만 사유 보임 */

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h3>{mode === 'add' ? '휴가 신청' : '상세 정보'}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.body}>
                    {/* --- 모드에 따라 다른 화면 보여주기 --- */}
                    {mode === 'add' ? (
                        <form onSubmit={handleAdd} className={styles.form}>
                            <div className={styles.infoRow}>
                                <span className={styles.label}>날짜</span>
                                <span>{dateStr}</span>
                            </div>
                            
                            {/* 라디오 버튼 (공통 컴포넌트로 빼야할듯)*/}
                            <div className={styles.radioGroup}>
                                <label>
                                    <input type="radio" name="type" value="annual" 
                                        checked={leaveType === 'annual'} 
                                        onChange={() => setLeaveType('annual')} /> 연차
                                </label>
                                <label>
                                    <input type="radio" name="type" value="half" 
                                        checked={leaveType === 'half'} 
                                        onChange={() => setLeaveType('half')} /> 반차
                                </label>
                            </div>

                            <Input 
                                label="사유" 
                                placeholder="예: 개인 사정"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />

                            <div className={styles.actions}>
                                <Button type="button" variant="secondary" onClick={onClose}>취소</Button>
                                <Button type="submit" variant="primary" disabled={loading}>결재 올리기</Button>
                            </div>
                        </form>
                    ) : (
                        <div className={styles.viewMode}>
                            <p><strong>이름:</strong> {selectedData?.profiles?.username}</p>
                            <p><strong>날짜:</strong> {selectedData?.date}</p>
                            <p><strong>종류:</strong> {selectedData?.type === 'annual' ? '연차' : '반차'}</p>
                            
                            {/* 사유: 권한 있는 사람만 보임 */}
                            {showReason && (
                                <p><strong>사유:</strong> {selectedData?.reason}</p>
                            )}
                            
                            <p><strong>상태:</strong> 
                                <span className={`${styles.status} ${styles[selectedData?.status]}`}>
                                    {selectedData?.status}
                                </span>
                            </p>

                            <div className={styles.actions}>
                                {/* 관리자용 버튼 (대기중일 때만 승인/반려 가능) */}
                                {isAdmin && selectedData?.status === 'pending' && (
                                    <>
                                        <Button type="button" variant="primary" onClick={() => handleApprove('approved')} disabled={loading}>
                                            승인
                                        </Button>
                                        <Button type="button" variant="secondary" onClick={() => handleApprove('rejected')} disabled={loading}>
                                            반려
                                        </Button>
                                    </>
                                )}

                                {/* 본인용 버튼 (대기중일 때만 철회 가능) */}
                                {isMyPost && !isAdmin && selectedData?.status === 'pending' && (
                                    <Button type="button" variant="primary" onClick={handleDelete} disabled={loading}>
                                        신청 철회
                                    </Button>
                                )}
                                
                                <Button type="button" variant="secondary" onClick={onClose}>닫기</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddSchedulePopup;