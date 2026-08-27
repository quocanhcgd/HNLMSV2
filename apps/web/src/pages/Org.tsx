import { useEffect, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import {
  createBranch,
  getOrganization,
  listBranches,
  updateBranch,
  updateOrganization,
  type Branch,
  type OrgBrandSettings,
  type OrgContactSettings,
  type Organization,
} from '../services/org';
import { listUsers, type UserRow } from '../services/users';

/**
 * T030 + T031 — Organization & Branches screen (route /org = nav mockup 02 nav_org).
 * Mockup 02 KHÔNG có screen org/branches → thiết kế theo design system mockup 02/03.
 *
 * T030 (mở rộng — khai báo đầy đủ): form Tổ chức 4 nhóm
 *  - Thông tin chung: name/timezone/academicPeriod + shortName/taxCode/licenseNo/representative/foundedAt
 *  - Liên hệ + Ngân hàng  → contact_settings JSONB (key cấu trúc, xem services/org.ts)
 *  - Thương hiệu          → brand_settings JSONB
 *  Không đổi contract API/DB — backend đã wire JSONB (T027).
 *
 * T031 (mở rộng): chi nhánh có phone/email/hotline/taxCode/representativeName/note
 *  (migration 1787800000002) + openedAt/closedAt đã có sẵn; archive = status inactive.
 */

export function OrgPage() {
  const { t, toast } = useShell();
  const [tab, setTab] = useState<'org' | 'branches'>('org');

  // ---- Organization form ----
  const [org, setOrg] = useState<Organization | null>(null);
  // nhóm chung
  const [fName, setFName] = useState('');
  const [fShort, setFShort] = useState('');
  const [fTz, setFTz] = useState('');
  const [fPeriod, setFPeriod] = useState('');
  const [fTax, setFTax] = useState('');
  const [fLic, setFLic] = useState('');
  const [fRep, setFRep] = useState('');
  const [fFounded, setFFounded] = useState('');
  // liên hệ
  const [fAddr, setFAddr] = useState('');
  const [fPhone, setFPhone] = useState('');
  const [fHotline, setFHotline] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fWeb, setFWeb] = useState('');
  const [fFax, setFFax] = useState('');
  // ngân hàng
  const [fBank, setFBank] = useState('');
  const [fBankAcc, setFBankAcc] = useState('');
  const [fBankHolder, setFBankHolder] = useState('');
  // thương hiệu
  const [fLogo, setFLogo] = useState('');
  const [fSlogan, setFSlogan] = useState('');
  const [fColor, setFColor] = useState('');
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
  const [bPhone, setBPhone] = useState('');
  const [bEmail, setBEmail] = useState('');
  const [bHotline, setBHotline] = useState('');
  const [bTax, setBTax] = useState('');
  const [bRep, setBRep] = useState('');
  const [bManager, setBManager] = useState('');
  const [bOpened, setBOpened] = useState('');
  const [bClosed, setBClosed] = useState('');
  const [bNote, setBNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const [o, b, m] = await Promise.all([getOrganization(), listBranches(), listUsers({ page: 1, pageSize: 100 })]);
        applyOrg(o);
        setBranches(b.data);
        setManagers(m.data);
      } catch {
        toast(t('toast_failed'));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyOrg = (o: Organization) => {
    setOrg(o);
    setFName(o.name);
    setFShort((o.contactSettings?.shortName as string) ?? '');
    setFTz(o.timezone);
    setFPeriod(o.academicPeriod ?? '');
    setFTax((o.contactSettings?.taxCode as string) ?? '');
    setFLic((o.contactSettings?.licenseNo as string) ?? '');
    setFRep((o.contactSettings?.representative as string) ?? '');
    setFFounded((o.contactSettings?.foundedAt as string) ?? '');
    setFAddr((o.contactSettings?.address as string) ?? '');
    setFPhone((o.contactSettings?.phone as string) ?? '');
    setFHotline((o.contactSettings?.hotline as string) ?? '');
    setFEmail((o.contactSettings?.email as string) ?? '');
    setFWeb((o.contactSettings?.website as string) ?? '');
    setFFax((o.contactSettings?.fax as string) ?? '');
    setFBank((o.contactSettings?.bankName as string) ?? '');
    setFBankAcc((o.contactSettings?.bankAccount as string) ?? '');
    setFBankHolder((o.contactSettings?.bankHolder as string) ?? '');
    setFLogo((o.brandSettings?.logoUrl as string) ?? '');
    setFSlogan((o.brandSettings?.slogan as string) ?? '');
    setFColor((o.brandSettings?.brandColor as string) ?? '');
  };

  const saveOrg = async () => {
    setSaving(true);
    try {
      const contact: OrgContactSettings = {
        shortName: fShort || undefined,
        taxCode: fTax || undefined,
        licenseNo: fLic || undefined,
        representative: fRep || undefined,
        foundedAt: fFounded || undefined,
        address: fAddr || undefined,
        phone: fPhone || undefined,
        hotline: fHotline || undefined,
        email: fEmail || undefined,
        website: fWeb || undefined,
        fax: fFax || undefined,
        bankName: fBank || undefined,
        bankAccount: fBankAcc || undefined,
        bankHolder: fBankHolder || undefined,
      };
      const brand: OrgBrandSettings = {
        logoUrl: fLogo || undefined,
        slogan: fSlogan || undefined,
        brandColor: fColor || undefined,
      };
      const o = await updateOrganization({ name: fName, timezone: fTz, academicPeriod: fPeriod, contactSettings: contact, brandSettings: brand });
      applyOrg(o);
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
    setBPhone('');
    setBEmail('');
    setBHotline('');
    setBTax('');
    setBRep('');
    setBManager('');
    setBOpened('');
    setBClosed('');
    setBNote('');
    setBranchModal(true);
  };

  const openEdit = (b: Branch) => {
    setEditing(b);
    setBCode(b.code);
    setBName(b.name);
    setBAddr(b.address ?? '');
    setBPhone(b.phone ?? '');
    setBEmail(b.email ?? '');
    setBHotline(b.hotline ?? '');
    setBTax(b.taxCode ?? '');
    setBRep(b.representativeName ?? '');
    setBManager(b.managerUserId ?? '');
    setBOpened(b.openedAt ?? '');
    setBClosed(b.closedAt ?? '');
    setBNote(b.note ?? '');
    setBranchModal(true);
  };

  const submitBranch = async () => {
    setBusy(true);
    try {
      if (editing) {
        await updateBranch(editing.id, {
          name: bName,
          address: bAddr,
          phone: bPhone || null,
          email: bEmail || null,
          hotline: bHotline || null,
          taxCode: bTax || null,
          representativeName: bRep || null,
          managerUserId: bManager || null,
          openedAt: bOpened || undefined,
          closedAt: bClosed || undefined,
          note: bNote || null,
        });
        toast(t('toast_branch_updated'));
      } else {
        await createBranch({
          code: bCode,
          name: bName,
          address: bAddr,
          phone: bPhone || undefined,
          email: bEmail || undefined,
          hotline: bHotline || undefined,
          taxCode: bTax || undefined,
          representativeName: bRep || undefined,
          managerUserId: bManager || null,
          openedAt: bOpened || undefined,
          note: bNote || undefined,
        });
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
              {/* 1. Thông tin chung */}
              <p className="text-xs font-bold uppercase mb-2 text-faint">{t('grp_general')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_org_name')}</label>
                  <input className="input-field" value={fName} onChange={(e) => setFName(e.target.value)} placeholder="EduCenter LMS" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_short_name')}</label>
                  <input className="input-field" value={fShort} onChange={(e) => setFShort(e.target.value)} placeholder="EC" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_tax_code')}</label>
                  <input className="input-field" value={fTax} onChange={(e) => setFTax(e.target.value)} placeholder="0101234567" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_license_no')}</label>
                  <input className="input-field" value={fLic} onChange={(e) => setFLic(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_representative')}</label>
                  <input className="input-field" value={fRep} onChange={(e) => setFRep(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_founded_at')}</label>
                  <input type="date" className="input-field" value={fFounded} onChange={(e) => setFFounded(e.target.value)} />
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

              {/* 2. Liên hệ */}
              <p className="text-xs font-bold uppercase mb-2 text-faint">{t('grp_contact')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">{t('f_address')}</label>
                  <input className="input-field" value={fAddr} onChange={(e) => setFAddr(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_phone')}</label>
                  <input className="input-field" value={fPhone} onChange={(e) => setFPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_hotline')}</label>
                  <input className="input-field" value={fHotline} onChange={(e) => setFHotline(e.target.value)} placeholder="1900 633 055" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_email')}</label>
                  <input className="input-field" value={fEmail} onChange={(e) => setFEmail(e.target.value)} placeholder="info@educenter.vn" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_website')}</label>
                  <input className="input-field" value={fWeb} onChange={(e) => setFWeb(e.target.value)} placeholder="https://educenter.vn" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_fax')}</label>
                  <input className="input-field" value={fFax} onChange={(e) => setFFax(e.target.value)} />
                </div>
              </div>

              {/* 3. Ngân hàng */}
              <p className="text-xs font-bold uppercase mb-2 text-faint">{t('grp_bank')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_bank_name')}</label>
                  <input className="input-field" value={fBank} onChange={(e) => setFBank(e.target.value)} placeholder="Vietcombank" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_bank_account')}</label>
                  <input className="input-field" value={fBankAcc} onChange={(e) => setFBankAcc(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_bank_holder')}</label>
                  <input className="input-field" value={fBankHolder} onChange={(e) => setFBankHolder(e.target.value)} />
                </div>
              </div>

              {/* 4. Thương hiệu */}
              <p className="text-xs font-bold uppercase mb-2 text-faint">{t('grp_brand')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-5">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_logo_url')}</label>
                  <input className="input-field" value={fLogo} onChange={(e) => setFLogo(e.target.value)} placeholder="https://.../logo.png" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_slogan')}</label>
                  <input className="input-field" value={fSlogan} onChange={(e) => setFSlogan(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t('f_brand_color')}</label>
                  <input className="input-field" value={fColor} onChange={(e) => setFColor(e.target.value)} placeholder="#0d9488" />
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
                    <th className="py-2.5 px-3 font-semibold">{t('col_contact')}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('br_address')}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('col_opened')}</th>
                    <th className="py-2.5 px-3 font-semibold">{t('br_status')}</th>
                    <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-3 px-3"><span className="badge badge-primary">{b.code}</span></td>
                      <td className="py-3 px-3">
                        <b>{b.name}</b>
                        {b.taxCode && <span className="text-xs text-faint block">MST: {b.taxCode}</span>}
                      </td>
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
                      <td className="py-3 px-3">
                        {b.phone || b.email ? (
                          <>
                            {b.phone && <span>{b.phone}</span>}
                            {b.email && <span className="text-xs text-faint block">{b.email}</span>}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-3 text-soft">{b.address || '—'}</td>
                      <td className="py-3 px-3">{b.openedAt ?? '—'}</td>
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

      {/* ===== MODAL: Thêm / Sửa chi nhánh ===== */}
      <div
        id="branchModal"
        className={`${branchModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto`}
        style={{ background: 'rgba(0,0,0,.45)' }}
      >
        <div className="card p-8 w-full max-w-2xl mb-10">
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
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_phone')}</label>
              <input className="input-field" value={bPhone} onChange={(e) => setBPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_email')}</label>
              <input className="input-field" value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="hn1@educenter.vn" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_hotline')}</label>
              <input className="input-field" value={bHotline} onChange={(e) => setBHotline(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_tax_code')}</label>
              <input className="input-field" value={bTax} onChange={(e) => setBTax(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_representative')}</label>
              <input className="input-field" value={bRep} onChange={(e) => setBRep(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_manager')}</label>
              <select className="input-field" value={bManager} onChange={(e) => setBManager(e.target.value)}>
                <option value="">{t('opt_no_manager')}</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>{m.fullName} ({m.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_opened_at')}</label>
              <input type="date" className="input-field" value={bOpened} onChange={(e) => setBOpened(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('f_closed_at')}</label>
              <input type="date" className="input-field" value={bClosed} onChange={(e) => setBClosed(e.target.value)} disabled={!editing} />
            </div>
          </div>
          <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_note')}</label>
          <textarea className="input-field" rows={3} value={bNote} onChange={(e) => setBNote(e.target.value)} />
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
