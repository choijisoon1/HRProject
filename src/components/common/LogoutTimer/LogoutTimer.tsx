// src/components/auth/LogoutTimer.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../api/supabaseClient';
import styles from './LogoutTimer.module.scss';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

const LogoutTimer = () => {
    const navigate = useNavigate();
    
    const EXTEND_TIME = 30 * 60; 
    const STORAGE_KEY = 'session_expire_time';

    /* 남은 시간 계산 함수 */
    const calculateTimeLeft = () => {
        const expireTime = localStorage.getItem(STORAGE_KEY);
        
        if (!expireTime) {
            /* 저장된 시간이 없으면? (최초 로그인) -> 지금부터 30분 뒤로 설정 */
            const newExpire = Date.now() + EXTEND_TIME * 1000;
            localStorage.setItem(STORAGE_KEY, newExpire.toString());
            return EXTEND_TIME;
        }

        /* 저장된 시간 - 현재 시간 = 남은 초 */
        const diff = Math.floor((parseInt(expireTime) - Date.now()) / 1000);
        return diff > 0 ? diff : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const isLogoutProcessStarted = useRef(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentLeft = calculateTimeLeft();
            setTimeLeft(currentLeft);

            /* 시간이 다 됐으면 로그아웃 */
            if (currentLeft <= 0 && !isLogoutProcessStarted.current) {
                clearInterval(timer);
                handleLogout(true);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    /* 로그아웃 함수 (자동/수동 공용) */
    const handleLogout = async (isAuto = false) => {
        /* 수동 클릭일 때는 확인 받기 */
        if (!isAuto && !window.confirm("로그아웃 하시겠습니까?")) return;

        isLogoutProcessStarted.current = true;
        
        /* 스토리지의 시간 기록 삭제 */
        localStorage.removeItem(STORAGE_KEY);
        
        await supabase.auth.signOut();
        
        if (isAuto) alert("세션이 만료되어 자동 로그아웃 되었습니다.");
        
        navigate('/login', { replace: true });
    };

    /* 연장하기 */
    const handleExtend = () => {
        /* 남은 시간을 다시 30분으로 갱신 */
        const newExpire = Date.now() + EXTEND_TIME * 1000;
        localStorage.setItem(STORAGE_KEY, newExpire.toString());
        
        setTimeLeft(EXTEND_TIME);
        console.log("로그인 연장됨!");
    };

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    return (
        <div className={styles.timerWrapper}>
            <span className={styles.timeText}>
                남은 시간: <strong>{formatTime(timeLeft)}</strong>
            </span>
            <ButtonGroup gap={6} align='end' fullWidth={false}>
                <Button size='sm' variant='primary' onClick={handleExtend}>
                    연장
                </Button>
                <Button size='sm' variant='secondary' onClick={() => handleLogout(false)}>
                    로그아웃
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default LogoutTimer;