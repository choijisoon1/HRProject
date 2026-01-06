import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Form/Input';
import Button from '../../components/common/Button/Button';
import styles from './Signup.module.scss';
import { supabase } from '../../api/supabaseClient';

const SignUp = () => {
    const navigate = useNavigate();

    /* 입력받을 데이터 상태 관리 */
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /* 입력된 값에서 "숫자가 아닌 것"은 모두 공백으로 바꿈 (문자 입력 방지용) */
        const rawDigits = e.target.value.replace(/[^0-9]/g, '');

        let formatted = rawDigits;

        /* 숫자가 4개 이상이면 하이픈 넣기 시작 */
        if (rawDigits.length > 3 && rawDigits.length <= 7) {
            // 010-1234
            formatted = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3)}`;
        } else if (rawDigits.length > 7) {
            // 010-1234-5678
            formatted = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7, 11)}`;
        }

        if (rawDigits.length <= 11) {
            setPhone(formatted);
        }
    };

    /* 가입 버튼 클릭 시 */
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        /* Supabase Auth에 회원가입 시도 (이메일, 비번) */
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert('회원가입 에러: ' + error.message);
            return;
        }

        /* 가입 성공 시, profiles 테이블에 이름과 전화번호 저장 */
        if (data.user) {
            const { error: profileError } = await supabase.from('profiles').insert([
                {
                    id: data.user.id,
                    email: email,
                    username: name,
                    phone: phone,
                    role: 'user',
                },
            ]);

            if (profileError) {
                alert('프로필 저장 에러: ' + profileError.message);
            } else {
                await supabase.auth.signOut(); /* 26.01.02 이메일 인증 없을 시 바로 로그인 되는 상황 방지, 실제 개발 완료 후 없앨 예정 */
                alert('회원가입이 완료되었습니다! 로그인 해주세요.');
                navigate('/login');
            }
        }
    };

    return (
        <div className={styles.signupPage}>
            {/* 왼쪽 가입 폼 */}
            <section className={styles.leftSection}>
                <div className={styles.formBox}>
                    <h2 className={styles.formTitle}>Create Account</h2>

                    <form className={styles.form} onSubmit={handleSignUp}>
                        {/* 이름 (Name) */}
                        <Input
                            label="Full Name"
                            required
                            placeholder="홍길동"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />

                        {/* 이메일 (Email) */}
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            placeholder="example@togate.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        {/* 비밀번호 (Password) */}
                        <Input
                            label="Password"
                            type="password"
                            required
                            placeholder="8자리 이상 입력"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        {/* 전화번호 (Phone) */}
                        <Input
                            label="Phone Number"
                            type="tel"
                            required
                            placeholder="- 유무 상관 없이 입력해주세요"
                            value={phone}
                            onChange={handlePhoneChange} 
                            maxLength={13}
                        />

                        {/* 가입 버튼 */}
                        <Button type="submit" variant="primary" fullWidth>
                            Create Account
                        </Button>

                        {/* 로그인으로 돌아가기 링크 */}
                        <div className={styles.signupLink}>
                            Already have an account?
                            <Link to="/login">Login</Link>
                        </div>
                    </form>
                </div>
            </section>
            {/* 오른쪽 배경 (추후 사진으로 변경) */}
            <section className={styles.rightSection}>
                <div className={styles.content}>
                    <div className={styles.logo}>ToGateComzHR</div>
                    <h1 className={styles.mainTitle}>Join Our Team!</h1>
                    <p className={styles.description}>"새로운 시작을 투게이트컴즈와 함께하세요."</p>
                </div>
            </section>
        </div>
    );
};

export default SignUp;
