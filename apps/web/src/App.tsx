import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { DashboardPage } from './pages/Dashboard';
import { PlaceholderPage } from './pages/Placeholder';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PlaceholderPage title="Đăng nhập" />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<PlaceholderPage title="Quản lý học viên" />} />
        <Route path="/courses" element={<PlaceholderPage title="Quản lý khóa học" />} />
        <Route path="/classes" element={<PlaceholderPage title="Quản lý lớp học" />} />
        <Route path="/finance" element={<PlaceholderPage title="Tài chính" />} />
        <Route path="/settings" element={<PlaceholderPage title="Cài đặt" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
