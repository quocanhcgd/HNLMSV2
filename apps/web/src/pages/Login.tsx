import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/**
 * Login screen — CHÉP Y HỆT docs/13-mockups/01-login-license.html (login screen, lines 63-107):
 * cùng markup, cùng class Tailwind, cùng hành vi (error box auto-hide 3.5s, toggle 🌙/🌐, ec-lang/ec-theme).
 * Chỉ khác: onSubmit gọi API thật (POST /auth/login) thay vì kiểm tra cứng trong mockup.
 */

/** i18n — dictionary giống hệt mockup (data-i18n + localStorage ec-lang). */
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

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState<string>(() => localStorage.getItem('ec-lang') || 'vi');
  const [theme, setTheme] = useState<string>(() => localStorage.getItem('ec-theme') || 'light');
  const [email, setEmail] = useState('admin@educenter.vn');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const t = (k: string) => I18N[lang]?.[k] ?? k;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
  }, [lang, theme]);

  useEffect(() => () => { if (errorTimer.current) clearTimeout(errorTimer.current); }, []);

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
      <div className="login-bg min-h-screen flex items-center justify-center">
        <span className="spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }
  if (status === 'authed') {
    return <Navigate to="/" replace />;
  }

  const flashError = (text: string) => {
    setErrorText(text);
    setShowError(true);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setShowError(false), 3500); // mockup: auto-hide 3.5s
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setShowError(false);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const code = (err as { response?: { status?: number } }).response?.status;
      flashError(code === 401 || code === 400 ? t('login_error') : t('conn_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ===== LANG / THEME (login screen) — khớp mockup ===== */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button type="button" className="theme-btn" onClick={toggleTheme} title="Dark/Light">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button type="button" className="theme-btn !w-auto px-3" onClick={toggleLang} title="Language">
          🌐 {lang === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>

      {/* ===== LOGIN ===== */}
      <div className="login-bg min-h-screen flex items-center justify-center">
        <div className="card overflow-hidden" style={{ width: 900, maxWidth: '95vw' }}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left — Illustration */}
            <div className="hidden md:flex flex-col justify-center p-12 illustration-bg">
              <div className="mb-8">
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
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--primary)' }}>
                EduCenter LMS
              </h2>
              <p className="text-sm leading-relaxed text-soft">{t('hero_text')}</p>
            </div>

            {/* Right — Login form */}
            <div className="p-10">
              {/* Brand (mobile) */}
              <div className="flex items-center space-x-3 mb-2 md:hidden">
                <div className="w-10 h-10 rounded-xl gradient-teal text-white flex items-center justify-center font-bold">
                  E
                </div>
                <h2 className="text-xl font-bold">EduCenter LMS</h2>
              </div>

              <h3 className="text-2xl font-bold mb-1">{t('login_title')}</h3>
              <p className="text-sm mb-8 text-soft">{t('login_sub')}</p>

              <div
                id="loginError"
                className={`${showError ? '' : 'hidden '}mb-4 text-sm font-semibold p-3 rounded-xl`}
                style={{ background: 'rgba(239,68,68,.12)', color: '#dc2626' }}
              >
                {errorText}
              </div>

              <form onSubmit={onFinish}>
                <label className="block text-sm font-semibold mb-1.5">{t('login_email')}</label>
                <input
                  id="loginEmail"
                  type="email"
                  className="input-field mb-4"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="block text-sm font-semibold mb-1.5">{t('login_pass')}</label>
                <input
                  id="loginPass"
                  type="password"
                  className="input-field mb-6"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn-primary w-full py-3" type="submit" disabled={submitting}>
                  {submitting ? '…' : t('login_btn')}
                </button>
              </form>

              <p className="text-xs mt-5 text-center text-faint">
                <b>admin@educenter.vn</b> / <b>admin123</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
