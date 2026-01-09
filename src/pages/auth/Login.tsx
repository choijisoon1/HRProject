import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../api/supabaseClient';
import Input from '../../components/common/Form/Input';
import Button from '../../components/common/Button/Button';
import styles from './Login.module.scss';
import ButtonGroup from '../../components/common/Button/ButtonGroup';
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            /* 현재 로그인된 세션이 있는지 확인 */
            const {
                data: { session },
            } = await supabase.auth.getSession();

            /* 로그인된 사람이면? 바로 메인으로 */
            if (session) {
                console.log('이미 로그인된 사용자입니다.');
                navigate('/', { replace: true });
            }
        };

        checkUser();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        /* 로그인 요청하기 */
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('로그인 실패 : ' + error.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                /* .from('profiles') */
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) {
                console.error('프로필 정보를 가져오지 못했습니다.');
            } else {
                console.log('환영합니다, ' + profile.username + '님!');
            }

            /* 새로 로그인 했을 때를 체크 */
            sessionStorage.setItem('is_fresh_login', 'true');
            navigate('/', { replace: true });
        }
        setLoading(false);
    };

    return (
        <div className={styles.loginPage}>
            {/* 왼쪽: 이미지 영역 (색상으로 영역만 잡음) */}
            <section className={styles.leftSection}>
                <div className={styles.content}>
                    <div className={styles.logo}>투게이트컴즈 인사관리</div>
                    <h1 className={styles.mainTitle}>함께 소통하며,디지털 혁신을 설계하다</h1>
                    <p className={styles.description}>"함께 성장하고 함께 꿈꾸는 투게이트컴즈"</p>
                </div>
            </section>

            {/* 오른쪽: 로그인 폼 영역 */}
            <section className={styles.rightSection}>
                <div className={styles.formBox}>
                    <h2 className={styles.formTitle}>로그인</h2>

                    <form className={styles.form} onSubmit={handleLogin}>
                        <Input
                            label="Email Address"
                            required
                            type="email"
                            placeholder="Input your registered email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Input
                            label="Password"
                            required
                            type="password"
                            placeholder="Input your password account"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <div className={styles.utils}>
                            <label>
                                <input type="checkbox" /> Remember Me
                            </label>
                            <a href="#">Forgot Password</a>
                        </div>

                        <Button variant="primary" fullWidth type="submit" disabled={loading}>
                            {/* 로딩 중이면 글씨,스타일 변경 */}
                            {loading ? '로그인 중...' : 'Login'}
                        </Button>

                        <div className={styles.divider}>Or login with</div>

                        <ButtonGroup direction="row">
                            <Button variant="social" fullWidth>
                                Google
                            </Button>
                            <Button variant="social" fullWidth>
                                Apple
                            </Button>
                        </ButtonGroup>
                        <p className={styles.signupLink}>
                            You're new in here? <Link to="/signup">Create Account</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
