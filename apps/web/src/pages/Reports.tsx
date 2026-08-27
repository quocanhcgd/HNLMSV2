import { useEffect, useRef, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import { I18N } from '../shell/i18n';

/**
 * Reports screen — CHÉP Y HỆT docs/13-mockups/04-reports.html:
 * 4 type cards, params (branch/from/to/format), jobs async (seed 1 job hoàn tất + tạo job mới chạy 180ms),
 * preview table (4 loại báo cáo). Demo data y mockup — sẽ wire report API + worker (US8) sau.
 */

const TYPES: { t: string; d: string; heads: string; rows: string[][] }[] = [
  { t: 't0', d: 't0d', heads: 'h0', rows: [['r0', '148', '612', '58', '6'], ['r1', '52', '183', '21', '2'], ['r2', '63', '240', '30', '4'], ['r3', '24', '96', '12', '1']] },
  { t: 't1', d: 't1d', heads: 'h1', rows: [['r4', '790tr', '180tr', '410tr', '200tr', '98tr'], ['r5', '630tr', '130tr', '370tr', '130tr', '88tr']] },
  { t: 't2', d: 't2d', heads: 'h2', rows: [['r6', 'r4', '20', '18', '90%', 's_good'], ['r7', 'r5', '16', '16', '100%', 's_full'], ['r8', 'r5', '15', '9', '60%', 's_open'], ['r9', 'r4', '20', '14', '70%', 's_normal']] },
  { t: 't3', d: 't3d', heads: 'h3', rows: [['r10', 'r6', '78%', '7.5', 's_low'], ['r11', 'r7', '45%', '6.8', 's_med'], ['r12', 'r9', '92%', '8.2', 's_low'], ['r13', 'r8', '20%', '5.5', 's_high']] },
];

const BADGE: Record<string, string> = {
  s_good: 'badge-success', s_full: 'badge-warning', s_open: 'badge-gray',
  s_normal: 'badge-primary', s_low: 'badge-success', s_med: 'badge-warning', s_high: 'badge-danger',
};

interface Job { id: string; type: number; period: 'period' | 'period2'; branch: string; pct: number; size: string }

export function ReportsPage() {
  const { t, toast, lang } = useShell();
  const [currentType, setCurrentType] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([
    { id: 'job-seed', type: 1, period: 'period2', branch: 'br_hn', pct: 100, size: '980 KB' },
  ]);
  const seq = useRef(1);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    const iv = intervals.current;
    return () => iv.forEach(clearInterval);
  }, []);

  const jobName = (j: Job) => t(TYPES[j.type].t) + ' · ' + (j.period === 'period' ? t('period') : t('period2')) + ' · ' + t(j.branch);

  const createReport = () => {
    const id = 'job-' + seq.current;
    seq.current += 1;
    const j: Job = { id, type: currentType, period: 'period', branch: 'all_branches', pct: 0, size: '1,2 MB' };
    setJobs((prev) => [j, ...prev]);
    toast(t('toast_queued') + (seq.current - 1) + t('toast_queued2'));
    const iv = setInterval(() => {
      setJobs((prev) => prev.map((x) => {
        if (x.id !== id) return x;
        const pct = Math.min(100, x.pct + 7 + Math.floor(Math.random() * 14));
        if (pct >= 100) {
          clearInterval(iv);
          toast(t('toast_ready') + t(TYPES[x.type].t) + t('toast_ready2'));
        }
        return { ...x, pct };
      }));
    }, 180);
    intervals.current.push(iv);
  };

  const d = TYPES[currentType];
  // h0-h3 là mảng header — đọc trực tiếp dict (t() chỉ trả string)
  const heads = (I18N[lang] as unknown as Record<string, string | string[]>)[d.heads] as string[];

  const cell = (v: string) => {
    if ((d.heads === 'h2' || d.heads === 'h3') && BADGE[v]) {
      return <span className={`badge ${BADGE[v]}`}>{t(v)}</span>;
    }
    return <>{t(v)}</>;
  };

  return (
    <div className="p-8">
      {/* Type cards (mockup 04 lines 116-117) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6" id="types">
        {TYPES.map((x, i) => (
          <div key={x.t} className={`type-card${i === currentType ? ' active' : ''}`} onClick={() => setCurrentType(i)}>
            <p className="text-2xl mb-2">{x.t.split(' ')[0]}</p>
            <b className="block mb-1">{t(x.t)}</b>
            <span className="text-xs text-soft">{t(x.d)}</span>
          </div>
        ))}
      </div>

      {/* Params (mockup 04 lines 119-131) */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold mb-4">{t('p_title')}</h3>
        <div className="flex flex-wrap gap-3 items-center">
          <select className="input-field !w-48">
            <option>{t('all_branches')}</option><option>{t('br_hn')}</option><option>{t('br_hcm')}</option>
          </select>
          <input type="date" defaultValue="2026-08-01" className="input-field !w-44" />
          <span className="text-faint">→</span>
          <input type="date" defaultValue="2026-08-31" className="input-field !w-44" />
          <select className="input-field !w-40">
            <option>{t('fmt_xlsx')}</option><option>{t('fmt_pdf')}</option><option>{t('fmt_csv')}</option>
          </select>
          <span className="flex-1"></span>
          <button className="btn-primary" onClick={createReport}>🚀 <span>{t('btn_create')}</span></button>
        </div>
        <p className="text-xs mt-3 text-faint">{t('p_note')}</p>
      </div>

      {/* Jobs (mockup 04 lines 133-137) */}
      <div className="card p-6 mb-6">
        <h3 className="font-bold mb-3">{t('jobs_title')}</h3>
        <div id="jobs">
          {jobs.map((j) => (
            <div key={j.id} className="job-row" id={j.id}>
              {j.pct >= 100 ? (
                <span style={{ color: 'var(--secondary)' }}>✅</span>
              ) : (
                <span className="spinner"></span>
              )}
              <b className="flex-1 text-sm">{jobName(j)}</b>
              {j.pct >= 100 ? (
                <>
                  <span className="badge badge-success">{t('st_done')}</span>
                  <span className="text-xs text-faint">{j.size}</span>
                  <button className="btn-primary px-4 py-1.5 text-xs" onClick={() => toast(t('toast_download'))}>{t('btn_download')}</button>
                </>
              ) : (
                <>
                  <span className="badge badge-warning">{t('st_processing')}</span>
                  <div className="h-2 rounded-full track w-32">
                    <div className="h-2 rounded-full gradient-teal" style={{ width: j.pct + '%' }}></div>
                  </div>
                  {j.pct < 100 && <span className="text-xs text-faint">{j.pct}%</span>}
                </>
              )}
            </div>
          ))}
        </div>
        <p id="jobsEmpty" className="text-sm py-3 text-soft" style={{ display: jobs.length ? 'none' : 'block' }}>
          {t('jobs_empty')}
        </p>
      </div>

      {/* Preview (mockup 04 lines 139-150) */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold" id="previewTitle">
            {t(d.t)} — {t('period')}{' '}
            <span className="text-xs font-normal text-faint">{t('sample')}</span>
          </h3>
          <div className="flex space-x-2">
            <button className="btn-outline text-xs px-3 py-1.5" onClick={() => toast(t('toast_export'))}>⬇ <span>{t('export_xlsx')}</span></button>
            <button className="btn-outline text-xs px-3 py-1.5" onClick={() => toast(t('toast_export'))}>⬇ <span>{t('export_pdf')}</span></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="previewTable">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                {heads.map((x) => <th key={x} className="py-2.5 px-3 font-semibold">{x}</th>)}
              </tr>
            </thead>
            <tbody>
              {d.rows.map((r, ri) => (
                <tr key={ri} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {r.map((c, ci) => <td key={ci} className="py-3 px-3">{cell(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
