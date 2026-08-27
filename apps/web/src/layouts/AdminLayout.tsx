import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ShellProvider, useShell } from '../shell/ShellContext';

/**
 * AppShell — CHÉP Y HỆT docs/13-mockups/02-admin-dashboard.html (lines 57-114 + 216):
 * sidebar w-64 trắng + header sticky (title, branch select, 🔔, 🌙/🌐, user chip + dropdown) + toast.
 * Chỉ khác: dữ liệu user thật (useAuth), navigate route thật, logout thật.
 */

interface NavItem {
  key: string;
  i18n: string;
  svg: string;
  locked?: boolean;
  lockedBadge?: boolean;
}

const NAV_ADMIN: NavItem[] = [
  {
    key: 'org',
    i18n: 'nav_org',
    svg: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    key: 'license',
    i18n: 'nav_license',
    svg: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    key: 'users',
    i18n: 'nav_users',
    svg: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
];

const NAV_BIZ: NavItem[] = [
  {
    key: 'academic',
    i18n: 'nav_academic',
    svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    key: 'enroll',
    i18n: 'nav_enroll',
    svg: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
  {
    key: 'finance',
    i18n: 'nav_finance',
    svg: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    key: 'reports',
    i18n: 'nav_reports',
    svg: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

const NAV_ADDON: NavItem[] = [
  {
    key: 'crm',
    i18n: 'nav_crm',
    locked: true,
    lockedBadge: true,
    svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    key: 'hrm',
    i18n: 'nav_hrm',
    locked: true,
    lockedBadge: true,
    svg: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

const HEADER_META: Record<string, { title: string[]; sub: string }> = {
  '/dashboard': { title: ['page_dash'], sub: 'page_sub' },
  '/org': { title: ['nav_org'], sub: 'page_sub_org' },
  '/license': { title: ['crumb_settings', 'page_license'], sub: 'page_sub_lic' },
  '/users': { title: ['page_users'], sub: 'page_sub_users' },
  '/reports': { title: ['page_reports'], sub: 'page_sub_reports' },
  '/students': { title: ['nav_enroll'], sub: '' },
  '/finance': { title: ['nav_finance'], sub: '' },
  '/courses': { title: ['nav_academic'], sub: '' },
  '/classes': { title: ['nav_academic'], sub: '' },
  '/settings': { title: ['nav_users'], sub: '' },
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, theme, lang, toggleTheme, toggleLang, branch, switchBranch, toast, toastMsg } = useShell();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeKey =
    location.pathname === '/license'
      ? 'license'
      : location.pathname === '/users'
        ? 'users'
        : location.pathname === '/org'
          ? 'org'
          : location.pathname === '/reports'
            ? 'reports'
            : location.pathname === '/dashboard'
              ? 'dashboard'
              : null;

  const go = (key: string) => {
    if (key === 'dashboard') {
      navigate('/dashboard');
      return;
    }
    if (key === 'org') {
      navigate('/org');
      return;
    }
    if (key === 'license') {
      navigate('/license');
      return;
    }
    if (key === 'users') {
      navigate('/users');
      return;
    }
    if (key === 'reports') {
      navigate('/reports');
      return;
    }
    // mockup go(p): toast demo — chưa có màn hình thật
    toast(t('toast_demo') + t(`nav_${key}` as never) + ' — dashboard');
  };

  // mockup: click ngoài dropdown → đóng
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const meta = HEADER_META[location.pathname] ?? HEADER_META['/dashboard'];
  const fullName = user?.fullName || user?.email || t('user_name');
  const roleLabel = user?.role ?? t('user_role');
  const initials = initialsOf(fullName);

  const renderNav = (items: NavItem[]) =>
    items.map((it) => (
      <div
        key={it.key}
        className={`nav-item ${it.locked ? 'nav-locked' : ''} ${it.key === activeKey ? 'active' : ''}`}
        onClick={() => !it.locked && go(it.key)}
      >
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={it.svg} />
        </svg>
        <span>{t(it.i18n)}</span>
        {it.lockedBadge && <span className="ml-auto badge badge-warning">{t('not_activated')}</span>}
      </div>
    ));

  return (
    <>
      {/* ===== SIDEBAR (mockup 02 lines 57-77) ===== */}
      <aside className="sidebar fixed top-0 left-0 w-64 h-screen z-20 overflow-y-auto">
        <div className="flex items-center space-x-3 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-xl gradient-teal text-white flex items-center justify-center font-bold">E</div>
          <div>
            <p className="font-bold text-sm">EduCenter LMS</p>
            <p className="text-xs text-faint">{t('org_name')}</p>
          </div>
        </div>
        <nav className="p-2 pt-3">
          <div className={`nav-item ${activeKey === 'dashboard' ? 'active' : ''}`} onClick={() => go('dashboard')}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{t('nav_dashboard')}</span>
          </div>
          <p className="px-3 pt-2 pb-1 text-xs font-bold uppercase text-faint">{t('grp_admin')}</p>
          {renderNav(NAV_ADMIN)}
          <p className="px-3 pt-3 pb-1 text-xs font-bold uppercase text-faint">{t('grp_biz')}</p>
          {renderNav(NAV_BIZ)}
          <p className="px-3 pt-3 pb-1 text-xs font-bold uppercase text-faint">{t('grp_addon')}</p>
          {renderNav(NAV_ADDON)}
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="ml-64 min-h-screen">
        <div className="surface border-b sticky top-0 z-10" style={{ borderColor: 'var(--border)' }}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{meta.title.map((k) => t(k)).join(' / ')}</h2>
              <p className="text-sm text-soft">{t(meta.sub)}</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                id="branchSel"
                className="text-sm px-3 py-2 rounded-lg border surface"
                style={{ borderColor: 'var(--border)' }}
                value={branch}
                onChange={(e) => switchBranch(e.target.value)}
              >
                <option value="all">{t('all_branches')}</option>
                <option value="hn">{t('br_hn')}</option>
                <option value="hcm">{t('br_hcm')}</option>
              </select>
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
              <div className="relative" id="userMenu" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((o) => !o);
                  }}
                  className="flex items-center gap-2.5 rounded-xl border px-2.5 py-1.5 transition hover:border-teal-600"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-1)' }}
                >
                  <div className="w-8 h-8 rounded-lg gradient-teal text-white flex items-center justify-center text-xs font-bold flex-none">
                    {initials}
                  </div>
                  <div className="text-left leading-tight hidden sm:block">
                    <p className="text-xs font-bold">{fullName}</p>
                    <p className="text-[10px] text-faint">{roleLabel}</p>
                  </div>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-[52px] card shadow-xl w-56 p-2 z-30">
                    <div className="px-3 py-2.5 mb-1 border-b" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-sm font-bold">{fullName}</p>
                      <p className="text-xs text-faint">{roleLabel}</p>
                    </div>
                    <button className="menu-pop" onClick={() => { setMenuOpen(false); toast(t('user_profile')); }}>
                      <span>👤</span><span>{t('user_profile')}</span>
                    </button>
                    <button className="menu-pop" onClick={() => { setMenuOpen(false); toast(t('user_settings')); }}>
                      <span>⚙️</span><span>{t('user_settings')}</span>
                    </button>
                    <button className="menu-pop" onClick={() => { setMenuOpen(false); toast(t('user_password')); }}>
                      <span>🔑</span><span>{t('user_password')}</span>
                    </button>
                    <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />
                    <button className="menu-pop" style={{ color: '#dc2626' }} onClick={() => void handleLogout()}>
                      <span>🚪</span><span>{t('user_logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </div>

      {/* ===== TOAST (mockup 02 line 216) ===== */}
      <div
        id="toast"
        className={`${toastMsg ? '' : 'hidden '}fixed top-20 right-8 z-50 card px-5 py-3.5 text-sm font-semibold shadow-xl`}
        style={{ borderLeft: '4px solid var(--primary)' }}
      >
        {toastMsg}
      </div>
    </>
  );
}

export function AdminLayout() {
  return (
    <ShellProvider>
      <Shell />
    </ShellProvider>
  );
}
