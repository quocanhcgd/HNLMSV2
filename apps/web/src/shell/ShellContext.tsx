import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { I18N } from './i18n';

type Lang = 'vi' | 'en';
type Theme = 'light' | 'dark';

export interface ShellState {
  lang: Lang;
  theme: Theme;
  /** dịch key — dict mockup 02 (data-i18n) */
  t: (k: keyof typeof I18N.vi | string) => string;
  toggleTheme: () => void;
  toggleLang: () => void;
  branch: string;
  switchBranch: (b: string) => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
}

const Ctx = createContext<ShellState | null>(null);

/**
 * AppShell state — đúng hành vi mockup 02:
 *  - ec-lang / ec-theme trong localStorage, html.dark + document.documentElement.lang
 *  - themeBtn/langBtn label ĐỘNG (☀️/🌙, 🌐 EN/VI) — khác login screen (cố định), đúng từng mockup
 *  - toast tự ẩn sau 2.6s, switchBranch đổi scope dữ liệu + toast
 */
export function ShellProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('ec-lang') === 'en' ? 'en' : 'vi'));
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('ec-theme') === 'dark' ? 'dark' : 'light'));
  const [branch, setBranch] = useState('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((k: string) => {
    const v = (I18N[lang] as unknown as Record<string, string | string[]>)[k];
    return typeof v === 'string' ? v : k;
  }, [lang]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2600);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((p) => {
      const n: Theme = p === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ec-theme', n);
      return n;
    });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((p) => {
      const n: Lang = p === 'vi' ? 'en' : 'vi';
      localStorage.setItem('ec-lang', n);
      return n;
    });
  }, []);

  const switchBranch = useCallback(
    (b: string) => {
      setBranch(b);
      toast(t('toast_switch') + t(b === 'all' ? 'all_branches' : b === 'hn' ? 'br_hn' : 'br_hcm'));
    },
    [t, toast],
  );

  return (
    <Ctx.Provider value={{ lang, theme, t, toggleTheme, toggleLang, branch, switchBranch, toast, toastMsg }}>
      {children}
    </Ctx.Provider>
  );
}

export function useShell(): ShellState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useShell phải dùng trong ShellProvider');
  return v;
}
