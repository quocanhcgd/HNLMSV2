import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  fetchMeContext,
  login as apiLogin,
  logout as apiLogout,
  type AuthUser,
  type ModuleState,
} from '../services/auth';
import { tokenStore } from '../services/token';

export type AuthStatus = 'loading' | 'authed' | 'anonymous';

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
  modules: ModuleState[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [modules, setModules] = useState<ModuleState[]>([]);

  const applyMe = (me: { user: AuthUser; roles: string[]; permissions: string[]; modules: ModuleState[] }) => {
    setUser(me.user);
    setRoles(me.roles);
    setPermissions(me.permissions);
    setModules(me.modules);
    setStatus('authed');
  };

  useEffect(() => {
    let cancelled = false;

    // Interceptor báo hết phiên (refresh thất bại) → về anonymous
    tokenStore.setAuthFailureHandler(() => {
      if (!cancelled) {
        setUser(null);
        setRoles([]);
        setPermissions([]);
        setModules([]);
        setStatus('anonymous');
      }
    });

    (async () => {
      try {
        // Nếu đã có token trong memory thì đi thẳng; nếu không, 401 → interceptor tự refresh (cookie)
        const me = await fetchMeContext();
        if (!cancelled) applyMe(me);
      } catch {
        if (!cancelled) setStatus('anonymous');
      }
    })();

    return () => {
      cancelled = true;
      tokenStore.setAuthFailureHandler(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    await apiLogin(email, password);
    const me = await fetchMeContext();
    applyMe(me);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setRoles([]);
    setPermissions([]);
    setModules([]);
    setStatus('anonymous');
  };

  return (
    <AuthContext.Provider value={{ status, user, roles, permissions, modules, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
  return ctx;
}
