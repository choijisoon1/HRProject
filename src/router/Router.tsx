import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ComponentGuide from '../pages/ComponentGuide';
import CalendarPage from '../pages/CalendarPage';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/guide" element={<ComponentGuide />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
