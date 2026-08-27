import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ShellProvider, useShell } from '../shell/ShellContext';

/**
 * Portal học viên (T053–T055) — layout riêng cho tài khoản student:
 * sidebar gọn (Tổng quan / Lớp của tôi / Thư viện) + header (title + 🌙/🌐 + user chip).
 * DEVIATION: mockup 02 chỉ có AppShell quản trị — portal theo design system (sidebar w-64 trắng,
 * cùng css var) nhưng nav tối giản cho học viên.
 */

const NAV_PORTAL = [
  { key: 'dash', i18n: 'nav_portal_dash', svg: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'classes', i18n: 'nav_portal_classes', svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'library', i18n: 'nav_portal_library', svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
];

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function PortalShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, theme, lang, toggleTheme, toggleLang, toast } = useShell();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const activeKey = location.pathname.startsWith('/student/classes') || location.pathname === '/student/classes'
    ? 'classes'
    : location.pathname.startsWith('/learning/library')
      ? 'library'
      : location.pathname.startsWith('/student')
        ? 'dash'
        : null;

  const go = (key: string) => {
    if (key === 'dash') navigate('/student/dashboard');
    else if (key === 'classes') navigate('/student/classes');
    else if (key === 'library') navigate('/learning/library');
  };

  const meta: { title: string; sub: string } = {
    dash: { title: t('nav_portal_dash'), sub: t('page_sub_portal') },
    classes: { title: t('nav_portal_classes'), sub: t('page_sub_portal') },
    library: { title: t('nav_portal_library'), sub: t('page_sub_library') },
  }[activeKey ?? 'dash'];

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <aside className="sidebar fixed top-0 left-0 w-64 h-screen z-20 overflow-y-auto">
        <div className="flex items-center space-x-3 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-xl gradient-teal text-white flex items-center justify-center font-bold">E</div>
          <div>
            <p className="font-bold text-sm">EduCenter LMS</p>
            <p className="text-xs text-faint">{t('nav_portal')}</p>
          </div>
        </div>
        <nav className="p-2 pt-3">
          <p className="px-3 pt-2 pb-1 text-xs font-bold uppercase text-faint">{t('grp_student')}</p>
          {NAV_PORTAL.map((it) => (
            <div
              key={it.key}
              className={`nav-item ${it.key === activeKey ? 'active' : ''}`}
              onClick={() => go(it.key)}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={it.svg} />
              </svg>
              <span>{t(it.i18n)}</span>
            </div>
          ))}
        </nav>
      </aside>

      <div className="ml-64 min-h-screen">
        <div className="surface border-b sticky top-0 z-10" style={{ borderColor: 'var(--border)' }}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{meta.title}</h2>
              <p className="text-sm text-soft">{meta.sub}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative text-xl" onClick={() => toast(t('toast_notif'))}>
                🔔
                <span className="absolute -top-1.5 -right-2 text-[10px] font-bold text-white rounded-full px-1.5" style={{ background: '#ef4444' }}>
                  3
                </span>
              </button>
              <button id="themeBtn" className="theme-btn" onClick={toggleTheme} title="Dark/Light">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button id="langBtn" className="theme-btn !w-auto px-3" onClick={toggleLang} title="Language">
                🌐 {lang === 'vi' ? 'EN' : 'VI'}
              </button>
              <div className="relative" ref={menuRef}>
                <button
                  id="userChip"
                  className="flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 transition hover:border-teal-600"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-1)' }}
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <span className="w-8 h-8 rounded-lg gradient-teal text-white flex items-center justify-center text-xs font-bold flex-none">
                    {initialsOf(user?.fullName ?? '')}
                  </span>
                  <span className="text-left leading-tight hidden sm:block">
                    <span className="block text-xs font-bold">{user?.fullName || user?.email}</span>
                    <span className="block text-[10px] text-faint">{t('role_student')}</span>
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 surface border rounded-xl shadow-lg p-1" style={{ borderColor: 'var(--border)' }}>
                    <div className="px-3 py-2 border-b text-sm" style={{ borderColor: 'var(--border)' }}>
                      <p className="font-semibold truncate">{user?.fullName}</p>
                      <p className="text-xs text-faint truncate">{user?.email}</p>
                    </div>
                    <button className="w-full text-left px-3 py-2 text-sm hover:bg-soft" onClick={() => void handleLogout()}>
                      {t('user_logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export function StudentPortalLayout() {
  return (
    <ShellProvider>
      <PortalShell />
    </ShellProvider>
  );
}
