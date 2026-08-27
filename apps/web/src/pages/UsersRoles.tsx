import { useState } from 'react';
import { useShell } from '../shell/ShellContext';

/**
 * Users & Roles screen — CHÉP Y HỆT docs/13-mockups/03-users-roles.html:
 * tabs Users/Roles, filter row + bảng users (USERS demo), roles list + perm groups,
 * modal Tạo người dùng + modal Cấp scope. Dữ liệu demo y mockup — sẽ wire /api/users (T035) sau.
 */

const USERS = [
  { n: 'Nguyễn Văn Admin', e: 'admin@edu.vn', role: 'role_oa', badge: 'badge-primary', scope: 'scope_all', on: true, last: 'today_1' },
  { n: 'Trần Thị Lan', e: 'lan.tran@edu.vn', role: 'role_bm', badge: 'badge-success', scope: 'br_hn', on: true, last: 'yesterday' },
  { n: 'Lê Văn Giang', e: 'giang.le@edu.vn', role: 'role_t', badge: 'badge-purple', scope: 'scope_hcm_classes', on: true, last: 'today_2', grant: true },
  { n: 'Phạm Thu Trang', e: 'trang.pham@edu.vn', role: 'role_fo', badge: 'badge-warning', scope: 'br_hn', on: true, last: '2d' },
  { n: 'Hoàng Minh Đức', e: 'duc.hoang@student.edu.vn', role: 'role_s', badge: 'badge-gray', scope: 'scope_hn_classes', on: false, last: '12d' },
];

const LAST_VI: Record<string, string> = { today_1: 'Hôm nay 08:12', today_2: 'Hôm nay 07:55', yesterday: 'Hôm qua 17:40', '2d': '2 ngày trước', '12d': '12 ngày trước' };
const LAST_EN: Record<string, string> = { today_1: 'Today 08:12', today_2: 'Today 07:55', yesterday: 'Yesterday 17:40', '2d': '2 days ago', '12d': '12 days ago' };

const ROLES = [
  { k: 'role_oa', d: 'role_oa_d', s: 'scope_txt' },
  { k: 'role_bm', d: 'role_bm_d', s: 'scope_br' },
  { k: 'role_am', d: 'role_am_d', s: 'scope_acad' },
  { k: 'role_t', d: 'role_t_d', s: 'scope_teach' },
  { k: 'role_fo', d: 'role_fo_d', s: 'scope_fin' },
  { k: 'role_s', d: 'role_s_d', s: 'scope_study' },
  { k: 'role_sa', d: 'role_sa_d', s: 'scope_tech' },
  { k: 'role_ac', d: 'role_ac_d', s: 'scope_txt', addon: true },
];

const PERM_GROUPS = [
  { g: 'grp_org', perms: ['org:read', 'org:update', 'branch:create', 'branch:update', 'branch:read'] },
  { g: 'grp_users', perms: ['user:create', 'user:update', 'user:delete', 'role:manage', 'scope:grant'] },
  { g: 'grp_acad', perms: ['program:create', 'program:update', 'class:create', 'class:update', 'schedule:manage', 'enrollment:create'] },
  { g: 'grp_fin', perms: ['invoice:read', 'invoice:create', 'payment:record', 'refund:create', 'report:export'] },
  { g: 'grp_lic', perms: ['license:activate', 'license:read'] },
];

export function UsersRolesPage() {
  const { t, lang, toast } = useShell();
  const [tab, setTab] = useState<'users' | 'roles'>('users');
  const [currentRole, setCurrentRole] = useState(0);
  const [userModal, setUserModal] = useState(false);
  const [scopeModal, setScopeModal] = useState(false);
  const [offPerms, setOffPerms] = useState<Set<string>>(new Set());
  const [onChips, setOnChips] = useState<Set<string>>(new Set());

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

  const lastMap = lang === 'vi' ? LAST_VI : LAST_EN;
  const r = ROLES[currentRole];

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
            <input className="input-field !w-64" placeholder={t('ph_search')} />
            <select className="input-field !w-44">
              <option>{t('role_all')}</option><option>{t('role_oa')}</option><option>{t('role_bm')}</option>
              <option>{t('role_t')}</option><option>{t('role_s')}</option><option>{t('role_fo')}</option>
            </select>
            <select className="input-field !w-44">
              <option>{t('br_all')}</option><option>{t('br_hn')}</option><option>{t('br_hcm')}</option>
            </select>
            <select className="input-field !w-44">
              <option>{t('st_all')}</option><option>{t('st_active')}</option><option>{t('st_locked')}</option>
            </select>
            <span className="flex-1"></span>
            <button className="btn-primary" onClick={() => setUserModal(true)}>+ <span>{t('btn_new_user')}</span></button>
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
                {USERS.map((u) => (
                  <tr key={u.e} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-3"><input type="checkbox"></input></td>
                    <td className="py-3 px-3"><b>{u.n}</b><br /><span className="text-xs text-faint">{u.e}</span></td>
                    <td className="py-3 px-3"><span className={`badge ${u.badge}`}>{t(u.role)}</span></td>
                    <td className="py-3 px-3">{t(u.scope)}</td>
                    <td className="py-3 px-3">
                      {u.on ? <span className="badge badge-success">{t('st_ok')}</span> : <span className="badge badge-danger">{t('st_off')}</span>}
                    </td>
                    <td className="py-3 px-3">{lastMap[u.last]}</td>
                    <td className="py-3 px-3 text-right space-x-1">
                      {u.grant && (
                        <button className="btn-outline text-xs px-3 py-1" onClick={() => setScopeModal(true)}>{t('btn_scope')}</button>
                      )}
                      <button className="btn-outline text-xs px-3 py-1" onClick={() => toast(t('toast_demo') + t('btn_details'))}>{t('btn_details')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-soft">
            <span id="totalLabel">{t('total_label')}</span><span>‹ 1 2 3 ›</span>
          </div>
          <p className="text-xs mt-4 text-faint">{t('audit_note')}</p>
        </div>

        {/* ===== ROLES (mockup 03 lines 148-171) ===== */}
        <div id="paneRoles" className={`p-6${tab === 'roles' ? '' : ' hidden'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div id="roleList">
              {ROLES.map((rl, i) => (
                <div key={rl.k} className={`role-item${i === currentRole ? ' active' : ''}`} onClick={() => setCurrentRole(i)}>
                  <b className="block text-sm">
                    {t(rl.k)}
                    {rl.addon && <span className="badge badge-purple ml-1">{t('addon_tag')}</span>}
                  </b>
                  <span className="text-xs text-faint">{t(rl.s)}</span>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold mb-1" id="roleTitle">🛡️ {t(r.k)}</h3>
              <p className="text-sm mb-5 text-soft" id="roleDesc">{t(r.d)}</p>
              {PERM_GROUPS.map((g) => (
                <div key={g.g}>
                  <p className="text-xs font-bold uppercase mb-2 text-faint">{t(g.g)}</p>
                  <div className="mb-4">
                    {g.perms.map((p) => (
                      <span key={p} className={`perm ${offPerms.has(p) ? '' : 'on'}`} onClick={() => togglePerm(p)}>{p}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end space-x-3">
                <button className="btn-outline" onClick={() => toast(t('toast_reset'))}>{t('undo')}</button>
                <button className="btn-primary" onClick={() => toast(t('toast_saved'))}>{t('save')}</button>
              </div>
              <p className="text-xs mt-4 text-faint">{t('perm_note')}</p>
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
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_name')}</label><input className="input-field" placeholder={t('ph_name')} /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_email')}</label><input className="input-field" placeholder="a.nguyen@edu.vn" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_pass')}</label><input className="input-field" type="password" value="******" readOnly /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('f_branch')}</label><select className="input-field"><option>{t('br_hn')}</option><option>{t('br_hcm')}</option></select></div>
          </div>
          <label className="block text-sm font-semibold mb-2 mt-4">{t('f_roles')}</label>
          <div className="flex flex-wrap gap-2 mb-1">
            {['role_t', 'role_fo', 'role_am', 'role_bm'].map((rk) => (
              <span key={rk} className={`chip ${onChips.has(rk) ? 'on' : ''}`} onClick={() => toggleChip(rk)}>{t(rk)}</span>
            ))}
          </div>
          <p className="text-xs mb-4 text-faint">{t('hint_multi_role')}</p>
          <label className="block text-sm font-semibold mb-1.5">{t('f_scope')}</label>
          <select className="input-field">
            <option>{t('scope_branch_hn')}</option><option>{t('scope_classes')}</option><option>{t('scope_students')}</option>
          </select>
          <p className="text-xs mt-2 mb-4 text-faint">{t('hint_scope')}</p>
          <div className="flex justify-end space-x-3">
            <button className="btn-outline" onClick={() => setUserModal(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={() => { setUserModal(false); toast(t('toast_created')); }}>{t('create')}</button>
          </div>
        </div>
      </div>

      {/* ===== MODAL: Cấp scope (mockup 03 lines 204-223) ===== */}
      <div id="scopeModal" className={`${scopeModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto`} style={{ background: 'rgba(0,0,0,.45)' }}>
        <div className="card p-8 w-full max-w-lg mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">{t('modal_scope')}</h3>
            <button className="text-xl text-faint" onClick={() => setScopeModal(false)}>✕</button>
          </div>
          <label className="block text-sm font-semibold mb-1.5">{t('scope_type')}</label>
          <select className="input-field mb-4">
            <option>{t('scope_branch')}</option><option>{t('scope_class')}</option><option>{t('scope_student')}</option>
          </select>
          <label className="block text-sm font-semibold mb-1.5">{t('scope_object')}</label>
          <select className="input-field mb-4"><option>{t('br_hcm')}</option><option>{t('br_hn')}</option></select>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1.5">{t('from')}</label><input type="date" defaultValue="2026-09-01" className="input-field" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">{t('to')}</label><input type="date" defaultValue="2027-08-31" className="input-field" /></div>
          </div>
          <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_reason')}</label>
          <input className="input-field mb-5" placeholder={t('ph_reason')} />
          <div className="flex justify-end space-x-3">
            <button className="btn-outline" onClick={() => setScopeModal(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={() => { setScopeModal(false); toast(t('toast_scope_granted')); }}>{t('grant')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
