import { useEffect, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import {
  createBranch,
  getOrganization,
  listBranches,
  updateBranch,
  updateOrganization,
  type Branch,
  type Organization,
} from '../services/org';
import { listUsers, type UserRow } from '../services/users';

/**
 * T030 + T031 — Organization & Branches screen (route /org = nav mockup 02 nav_org).
 * Mockup 02 KHÔNG có screen org/branches → thiết kế theo design system mockup 02/03
 * (card, tab, filter row, table, modal — chép y cấu trúc mockup 03).
 * T030: form Tổ chức (name/timezone/academicPeriod) → PUT /organization, lưu hiển thị.
 * T031: bảng chi nhánh + thêm/sửa/đóng cửa (status inactive) → /organization/branches CRUD.
 */

export function OrgPage() {
  const { t, toast } = useShell();
  const [tab, setTab] = useState<'org' | 'branches'>('org');

  // ---- Organization form ----
  const [org, setOrg] = useState<Organization | null>(null);
  const [fName, setFName] = useState('');
  const [fTz, setFTz] = useState('');
  const [fPeriod, setFPeriod] = useState('');
  const [saving, setSaving] = useState(false);

  // ---- Branches ----
  const [branches, setBranches] = useState<Branch[]>([]);
  const [managers, setManagers] = useState<UserRow[]>([]);
  const [q, setQ] = useState('');
  const [branchModal, setBranchModal] = useState(false);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [bCode, setBCode] = useState('');
  const [bName, setBName] = useState('');
  const [bAddr, setBAddr] = useState('');
  const [bManager, setBManager] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const [o, b, m] = await Promise.all([getOrganization(), listBranches(), listUsers({ page: 1, pageSize: 100 })]);
        setOrg(o);
        setFName(o.name);
        setFTz(o.timezone);
        setFPeriod(o.academicPeriod ?? '');
        setBranches(b.data);
        setManagers(m.data);
      } catch {
        toast(t('toast_failed'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveOrg = async () => {
    setSaving(true);
    try {
      const o = await updateOrganization({ name: fName, timezone: fTz, academicPeriod: fPeriod });
      setOrg(o);
      toast(t('toast_org_saved'));
    } catch {
      toast(t('toast_failed'));
    } finally {
      setSaving(false);
    }
  };

  const filtered = branches.filter((b) => `${b.code} ${b.name}`.toLowerCase().includes(q.trim().toLowerCase()));

  const openAdd = () => {
    setEditing(null);
    setBCode('');
    setBName('');
    setBAddr('');
    setBManager('');
    setBranchModal(true);
  };

  const openEdit = (b: Branch) => {
    setEditing(b);
    setBCode(b.code);
    setBName(b.name);
    setBAddr(b.address ?? '');
    setBManager(b.managerUserId ?? '');
    setBranchModal(true);
  };

  const submitBranch = async () => {
    setBusy(true);
    try {
      if (editing) {
        await updateBranch(editing.id, { name: bName, address: bAddr, managerUserId: bManager || null });
        toast(t('toast_branch_updated'));
      } else {
        await createBranch({ code: bCode, name: bName, address: bAddr, managerUserId: bManager || null });
        toast(t('toast_branch_created'));
      }
      // reload để lấy relation manager (create/update trả entity không kèm relation)
      const res = await listBranches(1, 100);
      setBranches(res.data);
      setBranchModal(false);
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusy(false);
    }
  };

  const archiveBranch = async (b: Branch) => {
    if (!window.confirm(t('confirm_archive'))) return;
    setBusy(true);
    try {
      await updateBranch(b.id, { status: 'inactive' });
      const res = await listBranches(1, 100);
      setBranches(res.data);
      toast(t('toast_branch_archived'));
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-8">
      <div className="card overflow-hidden">
        {/* Tabs — mockup 03 lines 123-126 */}
        <div className="flex border-b px-6 pt-2" style={{ borderColor: 'var(--border)' }}>
          <div className={`tab${tab === 'org' ? ' active' : ''}`} onClick={() => setTab('org')} id="tabOrg">
            <span>{t('tab_org')}</span>
          </div>
          <div className={`tab${tab === 'branches' ? ' active' : ''}`} onClick={() => setTab('branches')} id="tabBranches">
            <span>{t('tab_branches')}</span>
          </div>
        </div>

        {/* ===== ORGANIZATION (T030) ===== */}
        <div id="paneOrg" className={`p-6${tab === 'org' ? '' : ' hidden'}`}>
          {!org ? (
            <p className="text-sm text-soft">{t('loading')}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">{t('f_org_name')}</label>
                  <input className="input-field" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="EduCenter LMS" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_timezone')}</label>
                  <input className="input-field" value={fTz} onChange={(e) => setFTz(e.target.value)} placeholder="Asia/Ho_Chi_Minh" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_academic_period')}</label>
                  <input className="input-field" value={fPeriod} onChange={(e) => setFPeriod(e.target.value)} placeholder="2026-2027" />
                </div>
              </div>
              <p className="text-xs mt-4 mb-5 text-faint">
                {t('org_slug')}: <b>{org.slug}</b> · {t('org_currency')}: <b>{org.currency}</b>
              </p>
              <div className="flex justify-end max-w-2xl">
                <button className="btn-primary" onClick={() => void saveOrg()} disabled={saving}>
                  {saving ? t('loading') : t('save')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* ===== BRANCHES (T031) ===== */}
        <div id="paneBranches" className={`p-6${tab === 'branches' ? '' : ' hidden'}`}>
          <div className="flex flex-wrap gap-3 mb-5">
            <input className="input-field !w-64" placeholder={t('ph_search')} value={q} onChange={(e) => setQ(e.target.value)} />
            <span className="flex-1"></span>
            <button className="btn-primary" onClick={openAdd} disabled={busy}>
              + <span>{t('btn_add_branch')}</span>
            </button>
          </div>
          {branches.length === 0 ? (
            <p className="text-sm text-soft py-4">{t('no_branches')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="py-2.5 px-3 font-semibold">{t('col_code')}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('br_name')}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('br_manager')}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('br_address')}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('br_status')}</th>
                    <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-3 px-3"><span className="badge badge-primary">{b.code}</span></td>
                      <td className="py-3 px-3"><b>{b.name}</b></td>
                      <td className="py-3 px-3">
                        {b.manager ? (
                          <>
                            <b>{b.manager.fullName}</b>
                            <span className="text-xs text-faint block">{b.manager.email}</span>
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-3 text-soft">{b.address || '—'}</td>
                      <td className="py-3 px-3">
                        {b.status === 'active' ? (
                          <span className="badge badge-success">{t('br_active')}</span>
                        ) : (
                          <span className="badge badge-danger">{t('br_archived')}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button className="btn-outline text-xs px-3 py-1" onClick={() => openEdit(b)}>{t('btn_edit')}</button>
                        {b.status === 'active' && (
                          <button
                            className="btn-outline text-xs px-3 py-1"
                            style={{ color: '#dc2626' }}
                            onClick={() => void archiveBranch(b)}
                          >
                            {t('btn_archive')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== MODAL: Thêm / Sửa chi nhánh (cấu trúc theo mockup 03) ===== */}
      <div
        id="branchModal"
        className={`${branchModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto`}
        style={{ background: 'rgba(0,0,0,.45)' }}
      >
        <div className="card p-8 w-full max-w-lg mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">{editing ? t('modal_edit_branch') : t('modal_add_branch')}</h3>
            <button className="text-xl text-faint" onClick={() => setBranchModal(false)}>✕</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('br_code')}</label>
              <input className="input-field" value={bCode} onChange={(e) => setBCode(e.target.value)} placeholder={t('ph_branch_code')} disabled={!!editing} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('br_name')}</label>
              <input className="input-field" value={bName} onChange={(e) => setBName(e.target.value)} placeholder={t('ph_branch_name')} />
            </div>
          </div>
          <label className="block text-sm font-semibold mb-1.5 mt-4">{t('br_address')}</label>
          <input className="input-field" value={bAddr} onChange={(e) => setBAddr(e.target.value)} placeholder={t('ph_branch_addr')} />
          <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_manager')}</label>
          <select className="input-field" value={bManager} onChange={(e) => setBManager(e.target.value)}>
            <option value="">{t('opt_no_manager')}</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>{m.fullName} ({m.email})</option>
            ))}
          </select>
          <div className="flex justify-end space-x-3 mt-6">
            <button className="btn-outline" onClick={() => setBranchModal(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={() => void submitBranch()} disabled={busy || !bName.trim() || (!editing && !bCode.trim())}>
              {busy ? t('loading') : t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
