import { ProLayout } from '@ant-design/pro-components';
import {
  BankOutlined,
  BookOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '@lms/shared';
import { useAuth } from '../auth/AuthContext';

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
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

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
      avatarProps={{
        size: 'small',
        icon: <UserOutlined />,
        title: user?.fullName ?? user?.email ?? '—',
        render: (_props, dom) => (
          <Dropdown
            menu={{
              items: [{ key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' }],
              onClick: ({ key }) => key === 'logout' && void handleLogout(),
            }}
          >
            {dom}
          </Dropdown>
        ),
      }}
      actionsRender={() => [
        <Avatar key="role" size="small" style={{ background: '#0d9488', cursor: 'default' }}>
          {(user?.role ?? '?').slice(0, 1).toUpperCase()}
        </Avatar>,
      ]}
    >
      <Outlet />
    </ProLayout>
  );
}
