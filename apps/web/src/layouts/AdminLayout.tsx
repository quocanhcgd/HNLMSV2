import { ProLayout } from '@ant-design/pro-components';
import {
  BankOutlined,
  BookOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '@lms/shared';

const menuItems = [
  { path: '/dashboard', name: 'Tổng quan', icon: <DashboardOutlined /> },
  { path: '/students', name: 'Học viên', icon: <TeamOutlined /> },
  { path: '/courses', name: 'Khóa học', icon: <BookOutlined /> },
  { path: '/classes', name: 'Lớp học', icon: <UserOutlined /> },
  { path: '/finance', name: 'Tài chính', icon: <BankOutlined /> },
  { path: '/settings', name: 'Cài đặt', icon: <SettingOutlined /> },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ProLayout
      title={APP_NAME}
      logo={<span style={{ fontSize: 20 }}>📘</span>}
      route={{ path: '/', routes: menuItems }}
      location={{ pathname: location.pathname }}
      menuItemRender={(item, dom) => <div onClick={() => item.path && navigate(item.path)}>{dom}</div>}
      layout="mix"
      fixSiderbar
      contentStyle={{ minHeight: '100vh' }}
    >
      <Outlet />
    </ProLayout>
  );
}
