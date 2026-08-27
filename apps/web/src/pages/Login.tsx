import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Spin, Typography } from 'antd';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '@lms/shared';
import { useAuth } from '../auth/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (status === 'authed') {
    return <Navigate to="/" replace />;
  }

  const onFinish = async (values: LoginForm) => {
    setSubmitting(true);
    setError(null);
    try {
      await login(values.email.trim(), values.password);
      navigate(from, { replace: true });
    } catch (e) {
      const code = (e as { response?: { status?: number } }).response?.status;
      setError(code === 401 ? 'Email hoặc mật khẩu không đúng' : 'Không kết nối được máy chủ. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d9488 0%, #134e4a 100%)',
        padding: 16,
      }}
    >
      <Card style={{ width: 400, boxShadow: '0 8px 24px rgba(0,0,0,.2)' }} styles={{ body: { padding: 32 } }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40 }}>📘</div>
          <Typography.Title level={3} style={{ marginTop: 8, marginBottom: 0 }}>
            {APP_NAME}
          </Typography.Title>
          <Typography.Text type="secondary">Hệ thống quản lý học tập đa chi nhánh</Typography.Text>
        </div>

        {error && (
          <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
        )}

        <Form<LoginForm> onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" autoComplete="current-password" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={submitting}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0, marginTop: 16 }}>
          Tài khoản demo: <b>admin@educenter.vn</b> / <b>admin123</b>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
