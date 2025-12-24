// src/router/Router.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ComponentGuide from '../pages/ComponentGuide';
import CalendarPage from '../pages/CalendarPage';
import MainLayout from '../components/layout/MainLayout';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/guide" element={<ComponentGuide />} />
                <Route element={<MainLayout />}>
                    <Route path="/calendar" element={<CalendarPage />} /> {/* 캘린더 */}
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
