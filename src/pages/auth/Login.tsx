import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './Login.module.scss';
import ButtonGroup from '../../components/common/ButtonGroup';

const Login = () => {
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

                    <form className={styles.form}>
                        <Input
                            label="Email Address"
                            required
                            type="email"
                            placeholder="Input your registered email"
                        />
                        <Input
                            label="Password"
                            required
                            type="password"
                            placeholder="Input your password account"
                        />

                        <div className={styles.utils}>
                            <label>
                                <input type="checkbox" /> Remember Me
                            </label>
                            <a href="#">Forgot Password</a>
                        </div>

                        <Button variant="primary" fullWidth>
                            Login
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
                            You're new in here? <a href="#">Create Account</a>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
