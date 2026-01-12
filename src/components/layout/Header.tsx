import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import Input from '../common/Form/Input';
import { supabase } from '../../api/supabaseClient'; 
import LogoutTimer from '../common/LogoutTimer/LogoutTimer';
import NotificationBell from '../common/NotificationBell/NotificationBell';

const Header = () => {
    const [userName, setUserName] = useState('User'); 

    useEffect(() => {
        const fetchUserName = async () => {
            /* 로그인한 유저 ID 가져오기 */
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                /* 테이블에서 그 ID에 해당하는 (username) 찾기 */
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                if (!error && data) {
                    setUserName(data.username);
                }
            }
        };

        fetchUserName();
    }, []);

    return (
        <header className={styles.header}>
            {/* 검색창 */}
            <div className={styles.searchBar}>
                <Input placeholder="검색어를 입력하세요." icon="🔍" style={{ marginBottom: '0' }} />
            </div>

            {/* 우측 영역 환영 메시지로 변경 */}
            <div className={styles.rightMenu}>
                <NotificationBell />
                <LogoutTimer />
                <div className={styles.welcomeMsg}>
                    반갑습니다, <strong>{userName}</strong>님!
                </div>

                {/* 프로필 이미지 */}
                <div className={styles.profile}>
                    <div className={styles.avatar} />
                </div>
            </div>
        </header>
    );
};

export default Header;