// src/components/auth/LogoutTimer.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../api/supabaseClient';
import styles from './LogoutTimer.module.scss';
import Button from '../../../components/common/Button/Button';
import ButtonGroup from '../../../components/common/Button/ButtonGroup';

const LogoutTimer = () => {
    const navigate = useNavigate();
    
    const EXTEND_TIME = 30 * 60; 
    const STORAGE_KEY = 'session_expire_time';
    const isLogoutProcessStarted = useRef(false);

    const calculateTimeLeft = () => {
        /* 로그아웃이 진행중이면 타이머 계산 X */
        if (isLogoutProcessStarted.current) return 0;

        const expireTime = localStorage.getItem(STORAGE_KEY);
        
        if (!expireTime) {
            const newExpire = Date.now() + EXTEND_TIME * 1000;
            localStorage.setItem(STORAGE_KEY, newExpire.toString());
            return EXTEND_TIME;
        }

        const expireDate = parseInt(expireTime);
        if (isNaN(expireDate)) {
            const newExpire = Date.now() + EXTEND_TIME * 1000;
            localStorage.setItem(STORAGE_KEY, newExpire.toString());
            return EXTEND_TIME;
        }

        const diff = Math.floor((expireDate - Date.now()) / 1000);
        return diff > 0 ? diff : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    

    /* 로그인 시점 체크 */
    useEffect(() => {
        const checkSessionStatus = () => {
            const currentLeft = calculateTimeLeft();
            const isFreshLogin = sessionStorage.getItem('is_fresh_login');

            if (isFreshLogin) {
                /* 방금 로그인함 -> 시간 리셋 */
                const newExpire = Date.now() + EXTEND_TIME * 1000;
                localStorage.setItem(STORAGE_KEY, newExpire.toString());
                setTimeLeft(EXTEND_TIME);
                sessionStorage.removeItem('is_fresh_login'); 
            } 
            else if (currentLeft <= 0) {
                /* 시간 만료된 상태로 접속함 (다음날 출근) -> 강제 로그아웃 */
                localStorage.removeItem(STORAGE_KEY);
                supabase.auth.signOut();
                navigate('/login', { replace: true });
            }
        };

        checkSessionStatus();
    }, []); 

    /* 타이머 */
    useEffect(() => {
        const timer = setInterval(() => {
            const currentLeft = calculateTimeLeft();
            setTimeLeft(currentLeft);

            if (currentLeft <= 0) {
                if (isLogoutProcessStarted.current) return;
                
                clearInterval(timer);
                handleLogout(true); 
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = async (isAuto = false) => {
        if (!isAuto && !window.confirm("로그아웃 하시겠습니까?")) return;

        isLogoutProcessStarted.current = true;
        
        if (isAuto) {
            alert("세션이 만료되어 자동 로그아웃 되었습니다.");
        }
        
        localStorage.removeItem(STORAGE_KEY);
        
        await supabase.auth.signOut();
        
        navigate('/login', { replace: true });
    };

    const handleExtend = () => {
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
                <Button size='sm' variant='social' onClick={() => handleLogout(false)}>
                    로그아웃
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default LogoutTimer;