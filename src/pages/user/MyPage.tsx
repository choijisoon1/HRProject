import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabaseClient';
import PageLayout from '../../components/common/PageLayout';
import Input from '../../components/common/Form/Input';
import Button from '../../components/common/Button/Button';
import styles from './MyPage.module.scss';
import PageHeader from '@/components/common/PageHeader/PageHeader';
import FormRow from '@/components/common/Form/FormRow';

const MyPage = () => {
    const [loading, setLoading] = useState(false);
    
    /* 내 정보 상태 */
    const [email, setEmail] = useState(''); /* 이메일은 수정 불가 (읽기 전용으로 처리) */
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    
    /* 비밀번호 변경용 상태 */
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /* 처음 접속 시 본인 정보 불러오기 (Read) */
    useEffect(() => {
        const fetchMyInfo = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                /* 이메일은 Auth에서 */
                setEmail(user.email || '');

                /* 나머지 정보는 profiles 테이블에서 가져옴 */
                const { data, /* error */ } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setName(data.username);
                    setPhone(data.phone || '');
                }
            }
        };
        fetchMyInfo();
    }, []);

    /* 저장 버튼 클릭 (Update) */
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            /* 프로필 정보(이름, 전화번호) 업데이트 -> profiles 테이블 업데이트 */
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    username: name,
                    phone: phone,
                })
                .eq('id', user.id);

            if (profileError) throw profileError;

            /* 비밀번호 변경 (입력했을 경우에만) -> Auth 업데이트 */
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    alert('비밀번호가 일치하지 않습니다.');
                    setLoading(false);
                    return;
                }
                if (newPassword.length < 6) {
                    alert('비밀번호는 6자리 이상이어야 합니다.');
                    setLoading(false);
                    return;
                }

                const { error: passwordError } = await supabase.auth.updateUser({
                    password: newPassword
                });

                if (passwordError) throw passwordError;
                
                alert('정보 수정 및 비밀번호가 변경되었습니다!');
                setNewPassword(''); /* 비번창 초기화 */
                setConfirmPassword('');
            } else {
                alert('정보가 수정되었습니다.');
            }

        } catch (error: any) {
            alert('업데이트 실패: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <PageHeader title="My Page" />

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2>Personal Info</h2>
                    <p>기본 정보 및 비밀번호를 수정할 수 있습니다.</p>
                </div>

                <form onSubmit={handleUpdate} className={styles.formContainer}>
                    <FormRow>
                        <Input 
                            label="Full Name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                        <Input 
                            label="Email Address" 
                            value={email} 
                            disabled 
                            style={{ opacity: 0.7 }}
                        />
                    </FormRow>

                    <FormRow>
                        <Input 
                            label="Phone Number" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                        />
                        
                    </FormRow>

                    <div className={styles.divider}></div>

                    <FormRow>
                        <Input 
                            label="New Password" 
                            type="password"
                            placeholder="변경할 경우에만 입력"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                        <Input 
                            label="Confirm Password" 
                            type="password"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </FormRow>

                    <div className={styles.actionArea}>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </PageLayout>
    );
};

export default MyPage;