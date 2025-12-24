import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ComponentGuide = () => {
    return (
        <div style={{ padding: '40px', backgroundColor: '#1A202C', minHeight: '100vh', color: 'white' }}>
        <h1>Component Guide</h1>
        
        <section style={{ marginBottom: '40px' }}>
            <h2>1. Buttons</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="primary" fullWidth>fullWidth 사용법</Button> {/* 기본값 width 100% */}
            <Button variant="primary" fullWidth style={{maxWidth : '400px'}}>fullWidth 사용법</Button> {/* 스타일을 직접줘서 maxWidth 바꿀 수도 있음, 레이아웃 맞추기 여의치 않을 때 사용 */}
            <Button variant="secondary">Secondary</Button>
            <Button variant="social">Google Login</Button>
            <Button disabled>Disabled</Button>
            </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
            <h2>2. Inputs</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input label="Email Address" placeholder="이메일을 입력하세요" required />
            <Input label="Password" type="password" error="비밀번호가 일치하지 않습니다" />
            <Input label="ReadOnly" value="수정 불가 데이터" readOnly />
            </div>
        </section>
        </div>
    );
};

export default ComponentGuide;