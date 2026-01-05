// src/router/Router.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ComponentGuide from '../pages/ComponentGuide';
import CalendarPage from '../pages/CalendarPage';
import MainLayout from '../components/layout/MainLayout';
import SignUp from '../pages/auth/Signup';
import AuthGuard from './AuthGuard';
import Employees from '../pages/user/Employees';
import MyPage from '../pages/user/MyPage';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/guide" element={<ComponentGuide />} />
                {/* 로그인 세션 확인용 컴포넌트 (AuthGuard) */}
                <Route element={<AuthGuard />}>
                    <Route element={<MainLayout />}>
                        {/* 컨텐츠가 아직 일정관리 페이지 뿐이라 임시로, 추후 대시보드 추가하면 변경 */}
                        <Route path="/" element={<Employees />} />{' '}
                        <Route path="/employees" element={<Employees />} /> 
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/mypage" element={<MyPage />} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
