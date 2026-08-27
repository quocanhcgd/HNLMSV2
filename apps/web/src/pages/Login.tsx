import { Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/** i18n cho màn hình login — đúng tinh thần docs/13-mockups (dictionary + localStorage ec-lang). */
const I18N: Record<string, Record<string, string>> = {
  vi: {
    hero_text:
      'Hệ thống quản lý đào tạo đa chi nhánh — cài đặt on-premise, kích hoạt license offline, dữ liệu nằm hoàn toàn tại server của bạn.',
    login_title: 'Chào mừng trở lại!',
    login_sub: 'Đăng nhập để tiếp tục hành trình học tập',
    login_email: 'Email',
    login_pass: 'Mật khẩu',
    login_btn: 'Đăng nhập',
    login_error: 'Email hoặc mật khẩu không đúng',
    conn_error: 'Không kết nối được máy chủ. Vui lòng thử lại.',
  },
  en: {
    hero_text:
      'Multi-branch training management — on-premise, offline license activation, data stays entirely on your own server.',
    login_title: 'Welcome Back!',
    login_sub: 'Sign in to continue your learning journey',
    login_email: 'Email Address',
    login_pass: 'Password',
    login_btn: 'Sign In',
    login_error: 'Invalid email or password',
    conn_error: 'Cannot reach the server. Please try again.',
  },
};

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<string>(() => localStorage.getItem('ec-lang') || 'vi');
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('ec-theme') || 'light');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const t = (k: string) => I18N[lang]?.[k] ?? k;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
  }, [lang, theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('ec-theme', next);
  };
  const toggleLang = () => {
    const next = lang === 'vi' ? 'en' : 'vi';
    setLang(next);
    localStorage.setItem('ec-lang', next);
  };

  if (status === 'loading') {
    return (
      <div className="login-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
      setError(code === 401 ? t('login_error') : t('conn_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* LANG / THEME (login screen) — khớp mockup 01 */}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 40, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" className="theme-btn" onClick={toggleTheme} title="Dark/Light">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          type="button"
          className="theme-btn"
          style={{ width: 'auto', padding: '0 0.75rem' }}
          onClick={toggleLang}
          title="Language"
        >
          🌐 {lang === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>

      <div className="card" style={{ width: 900, maxWidth: '95vw', overflow: 'hidden' }}>
        <div className="login-grid">
          {/* Left — Illustration (ẩn trên mobile, khớp mockup) */}
          <div className="login-illustration illustration-bg">
            <div style={{ marginBottom: 32 }}>
              <svg width="220" height="180" viewBox="0 0 220 180" fill="none">
                <rect x="40" y="120" width="70" height="10" rx="2" fill="#0d9488" opacity=".8" />
                <rect x="36" y="106" width="78" height="10" rx="2" fill="#10b981" opacity=".8" />
                <rect x="32" y="92" width="86" height="10" rx="2" fill="#14b8a6" opacity=".8" />
                <circle cx="150" cy="50" r="22" fill="#0d9488" />
                <path
                  d="M150 72 L150 120 M150 92 L128 108 M150 92 L172 108 M150 120 L128 148 M150 120 L172 148"
                  stroke="#0d9488"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path d="M128 42 L150 32 L172 42 L150 52 Z" fill="#f59e0b" />
                <rect x="148" y="52" width="4" height="12" fill="#f59e0b" />
                <circle cx="185" cy="28" r="3" fill="#fbbf24" opacity=".7" />
                <circle cx="198" cy="46" r="2" fill="#fbbf24" opacity=".7" />
              </svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: 'var(--primary)' }}>EduCenter LMS</h2>
            <p className="text-soft" style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {t('hero_text')}
            </p>
          </div>

          {/* Right — Login form */}
          <div style={{ padding: 40 }}>
            {/* Brand (mobile) */}
            <div className="md-hidden-brand" style={{ alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div
                className="gradient-teal text-white"
                style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >
                E
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>EduCenter LMS</h2>
            </div>

            <h3 style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 4px' }}>{t('login_title')}</h3>
            <p className="text-soft" style={{ fontSize: 14, margin: '0 0 32px' }}>
              {t('login_sub')}
            </p>

            {error && (
              <div
                style={{
                  marginBottom: 16,
                  fontSize: 14,
                  fontWeight: 600,
                  padding: 12,
                  borderRadius: 12,
                  background: 'rgba(239,68,68,.12)',
                  color: '#dc2626',
                }}
              >
                {error}
              </div>
            )}

            <Form<LoginForm> onFinish={onFinish} layout="vertical" initialValues={{ email: 'admin@educenter.vn', password: 'admin123' }}>
              <Form.Item
                name="email"
                label={<span style={{ fontSize: 14, fontWeight: 600 }}>{t('login_email')}</span>}
                rules={[
                  { required: true, message: ' ' },
                  { type: 'email', message: ' ' },
                ]}
              >
                <Input className="input-field" type="email" autoComplete="username" placeholder="admin@educenter.vn" />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span style={{ fontSize: 14, fontWeight: 600 }}>{t('login_pass')}</span>}
                rules={[{ required: true, message: ' ' }]}
              >
                <Input.Password className="input-field" autoComplete="current-password" placeholder="••••••••" />
              </Form.Item>
              <button className="btn-primary" type="submit" disabled={submitting} style={{ width: '100%', padding: '0.85rem 1rem', marginTop: 4 }}>
                {submitting ? '…' : t('login_btn')}
              </button>
            </Form>

            <p className="text-faint" style={{ fontSize: 12, marginTop: 20, textAlign: 'center' }}>
              <b>admin@educenter.vn</b> / <b>admin123</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
