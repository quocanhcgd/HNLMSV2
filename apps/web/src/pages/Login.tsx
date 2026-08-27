import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/**
 * Login screen — BẢN SAO BYTE-FAITHFUL của docs/13-mockups/01-login-license.html (lines 63-107).
 * Mọi class, mọi inline style, mọi chuỗi đều chép y hệt mockup:
 *  - Nút toggle 🌙 / 🌐 EN là TEXT CỐ ĐỊNH như mockup (không đổi khi click — mockup line 65-66)
 *  - Gradient nền/cột illustration dùng inline style đúng giá trị mockup
 *  - Error box auto-hide 3.5s như doLogin() của mockup
 * Chỉ khác duy nhất: submit gọi POST /auth/login thật (mockup check cứng chuỗi).
 */

/** i18n — dictionary như mockup (data-i18n + localStorage ec-lang). */
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
  const [email, setEmail] = useState('admin@educenter.vn');
  const [password, setPassword] = useState('admin123');
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const t = (k: string) => I18N[lang]?.[k] ?? k;

  // mockup: applyTheme() + setLang() khi init
  useEffect(() => {
    const theme = localStorage.getItem('ec-theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = lang === 'vi' ? 'vi' : 'en';
  }, [lang]);

  useEffect(() => () => { if (errorTimer.current) clearTimeout(errorTimer.current); }, []);

  // mockup toggleTheme/toggleLang: đổi localStorage + class, KHÔNG đổi text nút trên login screen
  const toggleTheme = () => {
    const next = (localStorage.getItem('ec-theme') || 'light') === 'dark' ? 'light' : 'dark';
    localStorage.setItem('ec-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };
  const toggleLang = () => {
    const next = lang === 'vi' ? 'en' : 'vi';
    setLang(next);
    localStorage.setItem('ec-lang', next);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' }}>
        <span className="spinner" style={{ width: 28, height: 28, borderColor: '#fff', borderTopColor: 'transparent' }} />
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
    errorTimer.current = setTimeout(() => setShowError(false), 3500); // mockup doLogin: auto-hide 3.5s
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
      {/* ===== LANG / THEME (login screen) — y hệt mockup lines 64-67: text nút CỐ ĐỊNH ===== */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button type="button" className="theme-btn" onClick={toggleTheme} title="Dark/Light">🌙</button>
        <button type="button" className="theme-btn !w-auto px-3" onClick={toggleLang} title="Language">🌐 EN</button>
      </div>

      {/* ============ LOGIN ============ */}
      <div id="loginScreen" className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' }}>
        <div className="card overflow-hidden" style={{ width: '900px', maxWidth: '95vw' }}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left — Illustration (y hệt mockup lines 73-89) */}
            <div className="hidden md:flex flex-col justify-center p-12" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,.08) 0%, rgba(16,185,129,.08) 100%)' }}>
              <div className="mb-8">
                <svg width="220" height="180" viewBox="0 0 220 180" fill="none">
                  <rect x="40" y="120" width="70" height="10" rx="2" fill="#0d9488" opacity=".8" />
                  <rect x="36" y="106" width="78" height="10" rx="2" fill="#10b981" opacity=".8" />
                  <rect x="32" y="92" width="86" height="10" rx="2" fill="#14b8a6" opacity=".8" />
                  <circle cx="150" cy="50" r="22" fill="#0d9488" />
                  <path d="M150 72 L150 120 M150 92 L128 108 M150 92 L172 108 M150 120 L128 148 M150 120 L172 148" stroke="#0d9488" strokeWidth="7" strokeLinecap="round" />
                  <path d="M128 42 L150 32 L172 42 L150 52 Z" fill="#f59e0b" />
                  <rect x="148" y="52" width="4" height="12" fill="#f59e0b" />
                  <circle cx="185" cy="28" r="3" fill="#fbbf24" opacity=".7" />
                  <circle cx="198" cy="46" r="2" fill="#fbbf24" opacity=".7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--primary)' }}>EduCenter LMS</h2>
              <p className="text-sm leading-relaxed text-soft">{t('hero_text')}</p>
            </div>

            {/* Right — Login form (y hệt mockup lines 90-104) */}
            <div className="p-10">
              {/* Brand (mobile) */}
              <div className="flex items-center space-x-3 mb-2 md:hidden">
                <div className="w-10 h-10 rounded-xl gradient-teal text-white flex items-center justify-center font-bold">E</div>
                <h2 className="text-xl font-bold">EduCenter LMS</h2>
              </div>

              <h3 className="text-2xl font-bold mb-1">{t('login_title')}</h3>
              <p className="text-sm mb-8 text-soft">{t('login_sub')}</p>

              {/* Error box — như mockup: đỏ tint, auto-hide 3.5s */}
              <div
                id="loginError"
                className={`${showError ? '' : 'hidden '}mb-4 text-sm font-semibold p-3 rounded-xl`}
                style={{ background: 'rgba(239,68,68,.12)', color: '#dc2626' }}
              >
                {errorText}
              </div>

              <form onSubmit={onFinish}>
                <label className="block text-sm font-semibold mb-1.5">{t('login_email')}</label>
                <input id="loginEmail" type="email" className="input-field mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="block text-sm font-semibold mb-1.5">{t('login_pass')}</label>
                <input id="loginPass" type="password" className="input-field mb-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn-primary w-full py-3" type="submit" disabled={submitting}>
                  {submitting ? '…' : t('login_btn')}
                </button>
              </form>

              <p className="text-xs mt-5 text-center text-faint"><b>admin@educenter.vn</b> / <b>admin123</b></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
