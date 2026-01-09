import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../api/supabaseClient';
import styles from './NotificationBell.module.scss';

interface Notification {
    id: string;
    message: string;
    is_read: boolean;
    created_at: string;
    link?: string;
}

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    /* 내 알림 가져오기 */
    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }); 

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length); /* 안 읽은 개수 세기 */
        }
    };

    useEffect(() => {
        fetchNotifications();
        /* 완전 실시간 알림 기능은 나중에 추가 */
    }, [isOpen]); 

    /* 알림 읽음 처리 */
    const handleClickNotification = async (note: Notification) => {
        /* DB에 '읽음'으로 업데이트 */
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', note.id);
        
        /* 목록 갱신 & 팝업 닫기 */
        fetchNotifications();
        setIsOpen(false); 

        /* 링크가 있으면 해당 페이지로 이동 */
        if (note.link) {
            navigate(note.link);
        }
    };

    return (
        <div className={styles.container}>
            {/* 종 아이콘 버튼 */}
            <button className={styles.bellBtn} onClick={() => setIsOpen(!isOpen)}>
                🔔
                {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>

            {/* 드롭다운 목록 */}
            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>알림</div>
                    <ul className={styles.list}>
                        {notifications.length === 0 ? (
                            <li className={styles.empty}>새로운 알림이 없습니다.</li>
                        ) : (
                            notifications.map(note => (
                                <li 
                                    key={note.id} 
                                    className={`${styles.item} ${note.is_read ? styles.read : ''}`}
                                    onClick={() => handleClickNotification(note)}
                                >
                                    <p>{note.message}</p>
                                    <span className={styles.date}>
                                        {new Date(note.created_at).toLocaleDateString()}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;