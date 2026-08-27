import { useEffect, useMemo, useRef, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import { listBranches, type Branch } from '../services/org';
import {
  assignRoles,
  createUser,
  grantScope,
  listPermissions,
  listRoles,
  listUsers,
  removeScope,
  setRolePermissions,
  type PermissionLite,
  type RoleFull,
  type UserRow,
} from '../services/users';

/**
 * Users & Roles screen — CHÉP Y HỆT docs/13-mockups/03-users-roles.html (cấu trúc + class),
 * DỮ LIỆU THẬT từ API (T035 + T032/T033):
 *  - Users tab: GET /users (q/role/branch_id/status + phân trang), tạo user thật (POST /users
 *    + scope branch qua POST scope-grants), cấp scope thật, chi tiết (roles PUT + scope revoke)
 *  - Roles tab: GET /roles + /roles/permissions, lưu quyền qua PUT /roles/:id/permissions
 */

// ===== mapping helper =====
const ROLE_BADGE: Record<string, string> = {
  org_admin: 'badge-primary',
  system_admin: 'badge-primary',
  branch_manager: 'badge-success',
  academic_manager: 'badge-purple',
  teacher: 'badge-purple',
  finance_officer: 'badge-warning',
  student: 'badge-gray',
  admission_consultant: 'badge-gray',
};
const ROLE_SCOPE: Record<string, string> = {
  org_admin: 'scope_txt',
  system_admin: 'scope_tech',
  branch_manager: 'scope_br',
  academic_manager: 'scope_acad',
  teacher: 'scope_teach',
  finance_officer: 'scope_fin',
  student: 'scope_study',
  admission_consultant: 'scope_txt',
};

/** Nhóm permission theo mockup (PERM_GROUPS cũ) — resource → group key. */
const RESOURCE_GROUP: Record<string, string> = {
  org: 'grp_org',
  branch: 'grp_org',
  user: 'grp_users',
  role: 'grp_users',
  scope: 'grp_users',
  program: 'grp_acad',
  class: 'grp_acad',
  schedule: 'grp_acad',
  enrollment: 'grp_acad',
  invoice: 'grp_fin',
  payment: 'grp_fin',
  refund: 'grp_fin',
  report: 'grp_fin',
  license: 'grp_lic',
  auth: 'grp_sys',
  queue: 'grp_sys',
};
const GROUP_ORDER = ['grp_org', 'grp_users', 'grp_acad', 'grp_fin', 'grp_lic', 'grp_sys'];

const fmtDateTime = (v: string | null): string => {
  if (!v) return '—';
  const d = new Date(v);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export function UsersRolesPage() {
  const { t, lang, toast } = useShell();
  const [tab, setTab] = useState<'users' | 'roles'>('users');

  // ===== shared data =====
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roles, setRoles] = useState<RoleFull[]>([]);
  const [allPerms, setAllPerms] = useState<PermissionLite[]>([]);

  // ===== users tab =====
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const qTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ===== modals =====
  const [userModal, setUserModal] = useState(false);
  const [scopeModal, setScopeModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [targetUser, setTargetUser] = useState<UserRow | null>(null);
  const [onChips, setOnChips] = useState<Set<string>>(new Set());
  const [cName, setCName] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPass, setCPass] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cBranch, setCBranch] = useState('');
  const [cScope, setCScope] = useState('scope_branch');
  const [gType, setGType] = useState('scope_branch');
  const [gObject, setGObject] = useState('');
  const [gFrom, setGFrom] = useState('2026-09-01');
  const [gTo, setGTo] = useState('2027-08-31');
  const [busy, setBusy] = useState(false);

  // ===== roles tab =====
  const [currentRole, setCurrentRole] = useState(0);
  const [offPerms, setOffPerms] = useState<Set<string>>(new Set());

  const branchName = (id: string | null): string => (id ? branches.find((b) => b.id === id)?.name ?? id.slice(0, 8) : '—');

  // ---- load shared data ----
  useEffect(() => {
    void (async () => {
      try {
        const [br, rl] = await Promise.all([listBranches(1, 100), listRoles()]);
        setBranches(br.data);
        setRoles(rl);
      } catch {
        toast(t('toast_failed'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- load users (debounce q) ----
  const loadUsers = async (p: number, qq: string) => {
    setLoading(true);
    try {
      const res = await listUsers({
        page: p,
        pageSize: 10,
        q: qq || undefined,
        role: roleFilter || undefined,
        branchId: branchFilter || undefined,
        status: statusFilter || undefined,
      });
      setUsers(res.data);
      setTotal(res.meta.total);
      setPage(res.meta.page);
    } catch {
      toast(t('toast_failed'));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (qTimer.current) clearTimeout(qTimer.current);
    qTimer.current = setTimeout(() => void loadUsers(1, q), 400);
    return () => {
      if (qTimer.current) clearTimeout(qTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, roleFilter, branchFilter, statusFilter]);

  // ---- perms / roles tab ----
  useEffect(() => {
    void listPermissions()
      .then(setAllPerms)
      .catch(() => toast(t('toast_failed')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const r = roles[currentRole];
  const rolePermKeys = useMemo(() => new Set((r?.permissions ?? []).map((p) => `${p.resource}:${p.action}`)), [r]);

  // reset khi đổi role
  useEffect(() => {
    setOffPerms(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  const togglePerm = (p: string) =>
    setOffPerms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  const toggleChip = (c: string) =>
    setOnChips((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  const groups = useMemo(() => {
    const g: Record<string, PermissionLite[]> = {};
    for (const perm of allPerms) {
      const key = RESOURCE_GROUP[perm.resource] ?? 'grp_org';
      (g[key] ??= []).push(perm);
    }
    return GROUP_ORDER.filter((k) => g[k]).map((k) => ({ key: k, perms: g[k] }));
  }, [allPerms]);

  const totalPages = Math.max(1, Math.ceil(total / 10));
  const pageNumbers = useMemo(() => {
    const out: number[] = [];
    for (let i = 1; i <= totalPages; i++) out.push(i);
    return out.length > 9 ? [...out.slice(0, 4), 0, ...out.slice(-4)] : out;
  }, [totalPages]);

  // ---- actions ----
  const openCreate = () => {
    setCName('');
    setCEmail('');
    setCPass('');
    setCPhone('');
    setCBranch('');
    setCScope('scope_branch');
    setOnChips(new Set());
    setUserModal(true);
  };

  const submitCreate = async () => {
    if (!cName.trim() || !cEmail.trim() || cPass.length < 8) {
      toast(t('toast_failed'));
      return;
    }
    setBusy(true);
    try {
      const created = await createUser({ fullName: cName.trim(), email: cEmail.trim(), password: cPass, phone: cPhone.trim() || undefined, roleCodes: [...onChips] });
      if (cScope === 'scope_branch' && cBranch) {
        await grantScope(created.id, { branchId: cBranch });
      } else if (cScope !== 'scope_branch') {
        toast(t('toast_scope_future'));
      }
      setUserModal(false);
      toast(t('toast_created'));
      void loadUsers(1, q);
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusy(false);
    }
  };

  const openScope = (u: UserRow) => {
    setTargetUser(u);
    setGType('scope_branch');
    setGObject('');
    setGFrom('2026-09-01');
    setGTo('2027-08-31');
    setScopeModal(true);
  };

  const submitGrant = async () => {
    if (!targetUser) return;
    setBusy(true);
    try {
      const payload: { branchId?: string; effectiveFrom?: string; effectiveTo?: string } = {};
      if (gType === 'scope_branch' && gObject) payload.branchId = gObject;
      if (gFrom) payload.effectiveFrom = new Date(gFrom).toISOString();
      if (gTo) payload.effectiveTo = new Date(gTo).toISOString();
      if (!payload.branchId) {
        toast(t('toast_scope_future'));
        setScopeModal(false);
        return;
      }
      await grantScope(targetUser.id, payload);
      setScopeModal(false);
      toast(t('toast_scope_granted'));
      void loadUsers(page, q);
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusy(false);
    }
  };

  const openDetail = (u: UserRow) => {
    setTargetUser(u);
    setOnChips(new Set(u.roles.map((r) => r.code)));
    setDetailModal(true);
  };

  const saveRoles = async () => {
    if (!targetUser) return;
    setBusy(true);
    try {
      const updated = await assignRoles(targetUser.id, [...onChips]);
      setTargetUser(updated);
      toast(t('toast_roles_updated'));
      void loadUsers(page, q);
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusy(false);
    }
  };

  const revokeScope = async (scopeId: string) => {
    if (!targetUser) return;
    setBusy(true);
    try {
      await removeScope(targetUser.id, scopeId);
      const updated = await listUsers({ page: 1, pageSize: 100, q: targetUser.email });
      const fresh = updated.data.find((u) => u.id === targetUser.id);
      setTargetUser(fresh ?? targetUser);
      toast(t('toast_scope_removed'));
      void loadUsers(page, q);
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusy(false);
    }
  };

  const saveRolePerms = async () => {
    if (!r) return;
    setBusy(true);
    try {
      const keys = allPerms.map((p) => `${p.resource}:${p.action}`).filter((k) => !offPerms.has(k));
      const updated = await setRolePermissions(r.id, keys);
      setRoles((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
      setOffPerms(new Set());
      toast(t('toast_role_saved'));
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusy(false);
    }
  };

  const scopeText = (u: UserRow): string => {
    if (u.roles.some((x) => x.code === 'org_admin' || x.code === 'system_admin')) return t('scope_all');
    const names = u.scopes.filter((s) => s.branchId).map((s) => branchName(s.branchId));
    return names.length ? [...new Set(names)].join(', ') : '—';
  };

  return (
    <div className="p-8">
      <div className="card overflow-hidden">
        {/* Tabs (mockup 03 lines 123-126) */}
        <div className="flex border-b px-6 pt-2" style={{ borderColor: 'var(--border)' }}>
          <div className={`tab${tab === 'users' ? ' active' : ''}`} onClick={() => setTab('users')} id="tabUsers">
            <span>{t('tab_users')}</span>
          </div>
          <div className={`tab${tab === 'roles' ? ' active' : ''}`} onClick={() => setTab('roles')} id="tabRoles">
            <span>{t('tab_roles')}</span>
          </div>
        </div>

        {/* ===== USERS (mockup 03 lines 129-145) ===== */}
        <div id="paneUsers" className={`p-6${tab === 'users' ? '' : ' hidden'}`}>
          <div className="flex flex-wrap gap-3 mb-5">
            <input className="input-field !w-64" placeholder={t('ph_search')} value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="input-field !w-44" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">{t('role_all')}</option>
              {roles.map((rl) => (
                <option key={rl.code} value={rl.code}>{rl.name}</option>
              ))}
            </select>
            <select className="input-field !w-44" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
              <option value="">{t('br_all')}</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <select className="input-field !w-44" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">{t('st_all')}</option>
              <option value="active">{t('st_active')}</option>
              <option value="suspended">{t('st_locked')}</option>
            </select>
            <span className="flex-1"></span>
            <button className="btn-primary" onClick={openCreate}>+ <span>{t('btn_new_user')}</span></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" id="usersTable">
              <thead>
                <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="py-2.5 px-3 font-semibold"><input type="checkbox"></input></th>
                  {['col_user', 'col_role', 'col_scope', 'col_status', 'col_last', 'col_actions'].map((k) => (
                    <th key={k} className="py-2.5 px-3 font-semibold">{t(k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr><td colSpan={6} className="py-6 text-center text-soft">{t('loading')}</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-3 px-3"><input type="checkbox"></input></td>
                      <td className="py-3 px-3">
                        <b>{u.fullName}</b><br />
                        <span className="text-xs text-faint">{u.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        {u.roles.length ? (
                          <span className={`badge ${ROLE_BADGE[u.roles[0].code] ?? 'badge-gray'}`}>
                            {u.roles[0].name}
                            {u.roles.length > 1 && ` +${u.roles.length - 1}`}
                          </span>
                        ) : (
                          <span className="badge badge-gray">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3">{scopeText(u)}</td>
                      <td className="py-3 px-3">
                        {u.status === 'Active' ? (
                          <span className="badge badge-success">{t('st_ok')}</span>
                        ) : (
                          <span className="badge badge-danger">{u.status === 'Suspended' ? t('st_off') : 'Inactive'}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">{fmtDateTime(u.lastLoginAt)}</td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button className="btn-outline text-xs px-3 py-1" onClick={() => openScope(u)}>{t('btn_scope')}</button>
                        <button className="btn-outline text-xs px-3 py-1" onClick={() => openDetail(u)}>{t('btn_details')}</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-soft">
            <span id="totalLabel">{t('total_users').replace('{n}', String(total))}</span>
            <span className="space-x-1">
              <button className="btn-outline text-xs px-2 py-0.5" disabled={page <= 1} onClick={() => void loadUsers(page - 1, q)}>‹</button>
              {pageNumbers.map((p, i) =>
                p === 0 ? (
                  <span key={`e${i}`}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`btn-outline text-xs px-2 py-0.5${p === page ? ' !text-primary font-bold' : ''}`}
                    onClick={() => void loadUsers(p, q)}
                  >
                    {p}
                  </button>
                ),
              )}
              <button className="btn-outline text-xs px-2 py-0.5" disabled={page >= totalPages} onClick={() => void loadUsers(page + 1, q)}>›</button>
            </span>
          </div>
          <p className="text-xs mt-4 text-faint">{t('audit_note')}</p>
        </div>

        {/* ===== ROLES (mockup 03 lines 148-171) ===== */}
        <div id="paneRoles" className={`p-6${tab === 'roles' ? '' : ' hidden'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div id="roleList">
              {roles.map((rl, i) => (
                <div key={rl.code} className={`role-item${i === currentRole ? ' active' : ''}`} onClick={() => setCurrentRole(i)}>
                  <b className="block text-sm">
                    {rl.name}
                    {rl.code === 'admission_consultant' && <span className="badge badge-purple ml-1">{t('addon_tag')}</span>}
                  </b>
                  <span className="text-xs text-faint">{t(ROLE_SCOPE[rl.code] ?? 'scope_txt')}</span>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3">
              {r && (
                <>
                  <h3 className="text-lg font-bold mb-1" id="roleTitle">🛡️ {r.name}</h3>
                  <p className="text-sm mb-5 text-soft" id="roleDesc">{r.description ?? ''}</p>
                  {groups.map((g) => (
                    <div key={g.key}>
                      <p className="text-xs font-bold uppercase mb-2 text-faint">{t(g.key)}</p>
                      <div className="mb-4">
                        {g.perms.map((p) => {
                          const key = `${p.resource}:${p.action}`;
                          const isOn = rolePermKeys.has(key) && !offPerms.has(key);
                          return (
                            <span key={key} className={`perm ${isOn ? 'on' : ''}`} onClick={() => togglePerm(key)}>{key}</span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end space-x-3">
                    <button className="btn-outline" onClick={() => setOffPerms(new Set())}>{t('undo')}</button>
                    <button className="btn-primary" onClick={() => void saveRolePerms()} disabled={busy}>
                      {busy ? t('loading') : t('save')}
                    </button>
                  </div>
                  <p className="text-xs mt-4 text-faint">{t('perm_note')}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL: Tạo user (mockup 03 lines 176-202) ===== */}
      <div id="userModal" className={`${userModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto`} style={{ background: 'rgba(0,0,0,.45)' }}>
        <div className="card p-8 w-full max-w-lg mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">{t('modal_new_user')}</h3>
            <button className="text-xl text-faint" onClick={() => setUserModal(false)}>✕</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_name')}</label><input className="input-field" placeholder={t('ph_name')} value={cName} onChange={(e) => setCName(e.target.value)} /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_email')}</label><input className="input-field" placeholder="a.nguyen@edu.vn" value={cEmail} onChange={(e) => setCEmail(e.target.value)} /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_pass')}</label><input className="input-field" type="password" placeholder="••••••••" value={cPass} onChange={(e) => setCPass(e.target.value)} /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_phone')}</label><input className="input-field" placeholder="0912345678" value={cPhone} onChange={(e) => setCPhone(e.target.value)} /></div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1.5">{t('f_branch')}</label>
              <select className="input-field" value={cBranch} onChange={(e) => setCBranch(e.target.value)}>
                <option value="">{t('select_branch')}</option>
                {branches.filter((b) => b.status === 'active').map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="block text-sm font-semibold mb-2 mt-4">{t('f_roles')}</label>
          <div className="flex flex-wrap gap-2 mb-1">
            {roles.map((rl) => (
              <span key={rl.code} className={`chip ${onChips.has(rl.code) ? 'on' : ''}`} onClick={() => toggleChip(rl.code)}>{rl.name}</span>
            ))}
          </div>
          <p className="text-xs mb-4 text-faint">{t('hint_multi_role')}</p>
          <label className="block text-sm font-semibold mb-1.5">{t('f_scope')}</label>
          <select className="input-field" value={cScope} onChange={(e) => setCScope(e.target.value)}>
            <option value="scope_branch">{t('scope_branch_hn')}</option>
            <option value="scope_class">{t('scope_classes')}</option>
            <option value="scope_student">{t('scope_students')}</option>
          </select>
          <p className="text-xs mt-2 mb-4 text-faint">{t('hint_scope')}</p>
          <div className="flex justify-end space-x-3">
            <button className="btn-outline" onClick={() => setUserModal(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={() => void submitCreate()} disabled={busy}>
              {busy ? t('loading') : t('create')}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL: Cấp scope (mockup 03 lines 204-223) ===== */}
      <div id="scopeModal" className={`${scopeModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto`} style={{ background: 'rgba(0,0,0,.45)' }}>
        <div className="card p-8 w-full max-w-lg mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">{t('modal_scope')} — {targetUser?.fullName ?? ''}</h3>
            <button className="text-xl text-faint" onClick={() => setScopeModal(false)}>✕</button>
          </div>
          <label className="block text-sm font-semibold mb-1.5">{t('scope_type')}</label>
          <select className="input-field mb-4" value={gType} onChange={(e) => { setGType(e.target.value); setGObject(''); }}>
            <option value="scope_branch">{t('scope_branch')}</option>
            <option value="scope_class">{t('scope_class')}</option>
            <option value="scope_student">{t('scope_student')}</option>
          </select>
          <label className="block text-sm font-semibold mb-1.5">{t('scope_object')}</label>
          <select className="input-field mb-4" value={gObject} onChange={(e) => setGObject(e.target.value)} disabled={gType !== 'scope_branch'}>
            {gType !== 'scope_branch' ? (
              <option>{t('toast_scope_future')}</option>
            ) : (
              <>
                <option value="">{t('select_branch')}</option>
                {branches.filter((b) => b.status === 'active').map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </>
            )}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1.5">{t('from')}</label><input type="date" value={gFrom} onChange={(e) => setGFrom(e.target.value)} className="input-field" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('to')}</label><input type="date" value={gTo} onChange={(e) => setGTo(e.target.value)} className="input-field" /></div>
          </div>
          <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_reason')}</label>
          <input className="input-field mb-5" placeholder={t('ph_reason')} />
          <div className="flex justify-end space-x-3">
            <button className="btn-outline" onClick={() => setScopeModal(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={() => void submitGrant()} disabled={busy}>
              {busy ? t('loading') : t('grant')}
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL: Chi tiết user (mới — mockup có nút Chi tiết demo) ===== */}
      <div id="detailModal" className={`${detailModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto`} style={{ background: 'rgba(0,0,0,.45)' }}>
        <div className="card p-8 w-full max-w-lg mb-10">
          {targetUser && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">{t('det_title')}</h3>
                <button className="text-xl text-faint" onClick={() => setDetailModal(false)}>✕</button>
              </div>
              <p className="text-sm mb-1"><b>{targetUser.fullName}</b> <span className="text-faint">({targetUser.email})</span></p>
              <p className="text-xs text-faint mb-4">
                {t('det_phone')}: {targetUser.phone || '—'} · {t('det_created')}: {fmtDateTime(targetUser.createdAt)}
              </p>
              <label className="block text-sm font-semibold mb-2">{t('det_roles')}</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {roles.map((rl) => (
                  <span key={rl.code} className={`chip ${onChips.has(rl.code) ? 'on' : ''}`} onClick={() => toggleChip(rl.code)}>{rl.name}</span>
                ))}
              </div>
              <div className="flex justify-end mb-5">
                <button className="btn-primary" onClick={() => void saveRoles()} disabled={busy}>
                  {busy ? t('loading') : t('btn_save_roles')}
                </button>
              </div>
              <label className="block text-sm font-semibold mb-2">{t('det_scopes')}</label>
              {targetUser.scopes.length === 0 ? (
                <p className="text-sm text-soft mb-4">{t('no_scopes')}</p>
              ) : (
                <ul className="mb-4 space-y-2">
                  {targetUser.scopes.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-sm border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                      <span>
                        <b>{branchName(s.branchId)}</b>
                        <span className="text-xs text-faint block">
                          {t('from')} {s.effectiveFrom.slice(0, 10)} — {s.effectiveTo ? s.effectiveTo.slice(0, 10) : '∞'}
                        </span>
                      </span>
                      <button className="btn-outline text-xs px-3 py-1" style={{ color: '#dc2626' }} onClick={() => void revokeScope(s.id)}>
                        {t('btn_revoke')}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
