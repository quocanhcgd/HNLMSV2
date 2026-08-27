import { useEffect, useRef, useState } from 'react';
import { useShell } from '../shell/ShellContext';

/**
 * License screen — CHÉP Y HỆT docs/13-mockups/01-login-license.html (appScreen, lines 172-256):
 * welcome card (steps + kv box + nút relicense/addon), constraints (3 progress bars),
 * addons table, addon modal (serial), relic modal (dropzone upload). Hành vi demo y mockup
 * (simulateUpload 900ms, applyLicense 1400ms, activateAddon) — LicenseService vẫn là stub (D9).
 */

type UploadState = 'none' | 'progress' | 'done';

function Kv({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="kv-box">
      <span className="text-soft">{label}</span>
      <b>{children}</b>
    </div>
  );
}

export function LicensePage() {
  const { t, toast } = useShell();
  const [upgraded, setUpgraded] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [addonModal, setAddonModal] = useState(false);
  const [relicModal, setRelicModal] = useState(false);
  const [serial, setSerial] = useState('');
  const [upload, setUpload] = useState<UploadState>('none');
  const [applying, setApplying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));

  const activateAddon = () => {
    if (!serial.trim()) {
      toast(t('toast_serial'));
      return;
    }
    setAddons((p) => [...p, 'addon_crm']);
    setAddonModal(false);
    setSerial('');
    toast(t('toast_serial_ok'));
  };

  const simulateUpload = () => {
    setUpload('progress');
    later(() => {
      setUpload('done');
      toast(t('toast_upload_ok'));
    }, 900);
  };

  const applyLicense = () => {
    setApplying(true);
    later(() => {
      setRelicModal(false);
      setUpgraded(true);
      setApplying(false);
      toast(t('toast_applied'));
    }, 1400);
  };

  const addonDefs = [
    { key: 'addon_crm', desc: 'addon_crm_desc' },
    { key: 'addon_assess', desc: 'addon_assess_desc' },
    { key: 'addon_online', desc: 'addon_online_desc' },
    { key: 'addon_hrm', desc: 'addon_hrm_desc' },
  ];

  return (
    <div className="p-8">
      {/* ===== License status (mockup 01 lines 173-186) ===== */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">{t('lic_title')}</h3>
        <div className="flex items-center mb-6">
          <div className="step-dot gradient-teal text-white">1</div><div className="step-line"></div>
          <div className="step-dot gradient-teal text-white">2</div><div className="step-line"></div>
          <div className="step-dot gradient-teal text-white">3</div><div className="step-line"></div>
          <div className="step-dot">4</div>
        </div>
        <div id="welcomeBox">
          {upgraded ? (
            <>
              <Kv label={t('lic_status')}><span className="badge badge-success">{t('status_updated')}</span></Kv>
              <Kv label={t('lic_id')}>{t('lic_v2')}</Kv>
              <Kv label={t('max_students')}>2.000 → <span style={{ color: 'var(--secondary)' }}>3.000</span></Kv>
              <Kv label={t('max_branches')}>3 → <span style={{ color: 'var(--secondary)' }}>5</span></Kv>
              <Kv label={t('lic_signature')}><span className="badge badge-success">{t('lic_valid')}</span></Kv>
              <Kv label={t('lic_type')}>{t('lic_perpetual')}</Kv>
            </>
          ) : (
            <>
              <Kv label={t('lic_status')}><span className="badge badge-success">{t('lic_active')}</span></Kv>
              <Kv label={t('lic_id')}>LIC-2026-001-ABC-EDU</Kv>
              <Kv label={t('lic_type')}>{t('lic_perpetual')}</Kv>
              <Kv label={t('lic_support')}>2027-08-31</Kv>
              <Kv label={t('lic_signature')}><span className="badge badge-success">{t('lic_valid')}</span></Kv>
              <Kv label={t('lic_activated')}>2026-09-01</Kv>
            </>
          )}
        </div>
        <div className="flex space-x-3 mt-5">
          <button className="btn-outline" onClick={() => setRelicModal(true)}>↺ <span>{t('btn_relicense')}</span></button>
          <button className="btn-primary" onClick={() => setAddonModal(true)}>+ <span>{t('btn_addon')}</span></button>
        </div>
      </div>

      {/* ===== Constraints (mockup 01 lines 188-207) ===== */}
      <div className="card p-6 mb-6">
        <h3 className="text-lg font-bold mb-5">{t('con_title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2"><b>{t('con_students')}</b><span className="text-soft">1.120 / 2.000</span></div>
            <div className="h-2.5 rounded-full track"><div className="h-2.5 rounded-full gradient-teal" style={{ width: '56%' }}></div></div>
            <p className="text-xs mt-1.5 text-soft">56% — <span className="badge badge-blue">{t('ok')}</span></p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><b>{t('con_branches')}</b><span className="text-soft">2 / 3</span></div>
            <div className="h-2.5 rounded-full track"><div className="h-2.5 rounded-full gradient-teal" style={{ width: '67%' }}></div></div>
            <p className="text-xs mt-1.5 text-soft">67% — <span className="badge badge-blue">{t('ok')}</span></p>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><b>{t('con_storage')}</b><span className="text-soft">34 / 100</span></div>
            <div className="h-2.5 rounded-full track"><div className="h-2.5 rounded-full gradient-teal" style={{ width: '34%' }}></div></div>
            <p className="text-xs mt-1.5 text-soft">34% — <span className="badge badge-blue">{t('ok')}</span></p>
          </div>
        </div>
      </div>

      {/* ===== Addons (mockup 01 lines 209-221) ===== */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">{t('addon_title')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-3 px-3 font-semibold">{t('col_addon')}</th>
                <th className="py-3 px-3 font-semibold">{t('col_status')}</th>
                <th className="py-3 px-3 font-semibold">{t('col_expiry')}</th>
                <th className="py-3 px-3 font-semibold text-right">{t('col_action')}</th>
              </tr>
            </thead>
            <tbody id="addonRows">
              {addonDefs.map((d) => {
                const on = addons.includes(d.key); // mockup: addonsActivated khởi tạo rỗng
                return (
                  <tr key={d.key} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-3">
                      <b>{t(d.key)}</b>
                      <br />
                      <span className="text-xs text-faint">{t(d.desc)}</span>
                    </td>
                    <td className="py-3 px-3">
                      {on ? <span className="badge badge-success">● {t('lic_active')}</span> : <span className="badge badge-warning">{t('not_activated')}</span>}
                    </td>
                    <td className="py-3 px-3">{on ? '2027-08-31' : t('dash')}</td>
                    <td className="py-3 px-3 text-right">
                      {on ? (
                        <span className="badge badge-gray">{t('activated_badge')}</span>
                      ) : (
                        <button className="btn-primary px-4 py-1.5 text-xs" onClick={() => setAddonModal(true)}>
                          {t('activate')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-4 text-faint">{t('addon_note')}</p>
      </div>

      {/* ===== MODAL: Addon (mockup 01 lines 226-239 — hidden class như mockup, luôn trong DOM) ===== */}
      <div className={`${addonModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-24`} style={{ background: 'rgba(0,0,0,.45)' }} id="addonModal">
          <div className="card p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('modal_addon_title')}</h3>
              <button className="text-xl text-faint" onClick={() => setAddonModal(false)}>✕</button>
            </div>
            <label className="block text-sm font-semibold mb-1.5">{t('col_addon')}</label>
            <select className="input-field mb-4">
              <option>{t('opt_crm_price')}</option>
              <option>{t('opt_assess_price')}</option>
              <option>{t('opt_online_price')}</option>
              <option>{t('opt_hrm_price')}</option>
            </select>
            <label className="block text-sm font-semibold mb-1.5">{t('serial_key')}</label>
            <input className="input-field mb-6" placeholder={t('serial_ph')} value={serial} onChange={(e) => setSerial(e.target.value)} />
            <div className="flex justify-end space-x-3">
              <button className="btn-outline" onClick={() => setAddonModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={activateAddon}>{t('activate')}</button>
            </div>
          </div>
        </div>

      {/* ===== MODAL: Relicense (mockup 01 lines 241-256 — hidden class như mockup) ===== */}
      <div className={`${relicModal ? '' : 'hidden '}fixed inset-0 z-50 flex items-start justify-center pt-24`} style={{ background: 'rgba(0,0,0,.45)' }} id="relicModal">
          <div className="card p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('modal_relic_title')}</h3>
              <button className="text-xl text-faint" onClick={() => setRelicModal(false)}>✕</button>
            </div>
            <div className="dropzone" onClick={simulateUpload} id="dropzone">
              <p className="text-3xl mb-2">📄</p>
              <p className="font-semibold" style={{ color: 'var(--text-1)' }}>{t('dropzone_title')}</p>
              <p className="text-xs mt-1 text-soft">{t('dropzone_sub')}</p>
            </div>
            <p className="text-sm mt-4 text-soft" id="uploadState">
              {upload === 'progress' && (<><span className="spinner"></span> {t('upload_progress')}</>)}
              {upload === 'done' && t('upload_done')}
              {upload === 'none' && t('upload_none')}
            </p>
            <div className="flex justify-end space-x-3 mt-5">
              <button className="btn-outline" onClick={() => setRelicModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" id="applyBtn" disabled={upload !== 'done' || applying} onClick={applyLicense}>
                {applying ? (<><span className="spinner" style={{ borderColor: '#fff', borderTopColor: 'transparent' }}></span> {t('verifying')}</>) : t('apply_btn')}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
