import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';

const AuthGuard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            /* 현재 로그인 세션 존재 확인 */
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                /* 세션 없으면 로그인 페이지로 이동 */
                /* alert('로그인이 필요합니다'); */ /* 임시 알럿(삭제예정) */
                navigate('/login', { replace: true });
            } else {
                setSession(session);
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate]);

    if (loading) return <div>Loading...</div>; /* 로딩중일때 보일 문구 */
    return session ? <Outlet /> : null;
};

export default AuthGuard;
