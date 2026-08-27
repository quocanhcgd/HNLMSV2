import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { StudentPortalLayout } from './layouts/StudentPortalLayout';
import { DashboardPage } from './pages/Dashboard';
import { LoginPage } from './pages/Login';
import { LicensePage } from './pages/License';
import { OrgPage } from './pages/Org';
import { UsersRolesPage } from './pages/UsersRoles';
import { AcademicPage } from './pages/Academic';
import { StudentsPage } from './pages/Students';
import { LearningContents } from './pages/LearningContents';
import { ReportsPage } from './pages/Reports';
import { PlaceholderPage } from './pages/Placeholder';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentClasses } from './pages/student/StudentClasses';
import { StudentClassDetail } from './pages/student/StudentClassDetail';
import { LibraryPage } from './pages/Library';

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

/** T053–T055 — tài khoản chỉ có role student → portal học viên (khác AppShell quản trị). */
function isPortalUser(roles: string[]): boolean {
  return roles.length > 0 && roles.every((r) => r === 'student' || r === 'Student');
}

function AppRoutes() {
  const { roles } = useAuth();
  const portal = isPortalUser(roles);

  if (portal) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<Protected><StudentPortalLayout /></Protected>}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/classes" element={<StudentClasses />} />
          <Route path="student/classes/:classId" element={<StudentClassDetail />} />
          <Route path="learning/library" element={<LibraryPage />} />
          <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<Protected><AdminLayout /></Protected>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="org" element={<OrgPage />} />
        <Route path="license" element={<LicensePage />} />
        <Route path="users" element={<UsersRolesPage />} />
        <Route path="academic" element={<AcademicPage />} />
        <Route path="learning/contents" element={<LearningContents />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="courses" element={<PlaceholderPage title="Quản lý khóa học" />} />
        <Route path="classes" element={<PlaceholderPage title="Quản lý lớp học" />} />
        <Route path="finance" element={<PlaceholderPage title="Tài chính" />} />
        <Route path="settings" element={<PlaceholderPage title="Cài đặt" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
