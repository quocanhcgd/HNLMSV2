import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { DashboardPage } from './pages/Dashboard';
import { LoginPage } from './pages/Login';
import { LicensePage } from './pages/License';
import { OrgPage } from './pages/Org';
import { UsersRolesPage } from './pages/UsersRoles';
import { AcademicPage } from './pages/Academic';
import { StudentsPage } from './pages/Students';
import { ReportsPage } from './pages/Reports';
import { PlaceholderPage } from './pages/Placeholder';

/** T019: chặn route chưa đăng nhập (access token / refresh cookie). */
function Protected({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }
  if (status === 'anonymous') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <Protected>
              <AdminLayout />
            </Protected>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/org" element={<OrgPage />} />
          <Route path="/license" element={<LicensePage />} />
          <Route path="/users" element={<UsersRolesPage />} />
          <Route path="/academic" element={<AcademicPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/courses" element={<PlaceholderPage title="Quản lý khóa học" />} />
          <Route path="/classes" element={<PlaceholderPage title="Quản lý lớp học" />} />
          <Route path="/finance" element={<PlaceholderPage title="Tài chính" />} />
          <Route path="/settings" element={<PlaceholderPage title="Cài đặt" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
