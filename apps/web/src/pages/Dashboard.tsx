import { useShell } from '../shell/ShellContext';
import { I18N } from '../shell/i18n';

/**
 * Dashboard — CHÉP Y HỆT docs/13-mockups/02-admin-dashboard.html (lines 116-213).
 * Dữ liệu KPI/CHARTS/RECENT là DEMO theo mockup — sẽ wire API khi có module
 * (students/classes/finance...). Branch switch = demo scope dữ liệu (mockup switchBranch).
 */

// Demo data (mockup lines 312-328) — TODO: thay bằng API khi có module
const DATA: Record<string, { students: string; classes: string; revenue: string; debt: string }> = {
  all: { students: '1.120', classes: '36', revenue: '1,42 tỷ ₫', debt: '186 triệu ₫' },
  hn: { students: '640', classes: '20', revenue: '790 triệu ₫', debt: '98 triệu ₫' },
  hcm: { students: '480', classes: '16', revenue: '630 triệu ₫', debt: '88 triệu ₫' },
};
const CHARTS: Record<string, number[]> = {
  all: [38, 42, 45, 50, 48, 55, 61, 58, 66, 70, 74, 81],
  hn: [22, 24, 26, 28, 27, 31, 33, 32, 37, 39, 41, 45],
  hcm: [16, 18, 19, 22, 21, 24, 28, 26, 29, 31, 33, 36],
};
const RECENT: { s: string; c: string; b: 'br_hn' | 'br_hcm'; f: string; paid: boolean }[] = [
  { s: 'Nguyễn Minh Anh', c: 'EN-B1-26 (K41)', b: 'br_hn', f: '3.500.000 ₫', paid: false },
  { s: 'Trần Quốc Bảo', c: 'IT-Python-09', b: 'br_hcm', f: '4.200.000 ₫', paid: true },
  { s: 'Lê Thu Hà', c: 'EN-A2-12 (K40)', b: 'br_hn', f: '3.200.000 ₫', paid: true },
  { s: 'Phạm Đức Huy', c: 'IELTS-6.5-03', b: 'br_hcm', f: '6.800.000 ₫', paid: false },
  { s: 'Vũ Ngọc Mai', c: 'EN-B1-26 (K41)', b: 'br_hn', f: '3.500.000 ₫', paid: true },
];

export function DashboardPage() {
  const { t, lang, branch, toast } = useShell();
  const d = DATA[branch] ?? DATA.all;
  const chart = CHARTS[branch] ?? CHARTS.all;
  const max = Math.max(...chart);
  const months = I18N[lang].m;

  return (
    <div className="p-8">
      {/* ===== KPI (mockup 02 lines 118-147) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-soft">{t('kpi_students')}</p>
              <p className="text-3xl font-extrabold mt-1 num-change" id="st_students">{d.students}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(13,148,136,.12)' }}>🎓</div>
          </div>
          <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--secondary)' }}>{t('tr_students')}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-soft">{t('kpi_classes')}</p>
              <p className="text-3xl font-extrabold mt-1 num-change" id="st_classes">{d.classes}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(139,92,246,.12)' }}>📚</div>
          </div>
          <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--secondary)' }}>{t('tr_classes')}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-soft">{t('kpi_revenue')}</p>
              <p className="text-3xl font-extrabold mt-1 num-change" id="st_revenue">{d.revenue}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,.15)' }}>💰</div>
          </div>
          <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--secondary)' }}>{t('tr_revenue')}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-soft">{t('kpi_debt')}</p>
              <p className="text-3xl font-extrabold mt-1 num-change" id="st_debt">{d.debt}</p>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(239,68,68,.1)' }}>⏳</div>
          </div>
          <p className="text-xs mt-2 font-semibold" style={{ color: '#dc2626' }}>{t('tr_debt')}</p>
        </div>
      </div>

      {/* ===== Charts (mockup 02 lines 149-175) ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold">
              <span>{t('ch_enroll')}</span> <span className="text-xs font-normal text-faint">{t('ch_year')}</span>
            </h3>
            <span className="badge badge-primary">+23% YoY</span>
          </div>
          <div className="flex items-end gap-3 h-44" id="enrollChart">
            {chart.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full max-w-[42px] rounded-t-md"
                  style={{
                    height: `${Math.round((v / max) * 150)}px`,
                    background:
                      i === chart.length - 1
                        ? 'linear-gradient(180deg, var(--secondary), var(--primary))'
                        : 'linear-gradient(180deg, var(--primary-light), var(--primary))',
                  }}
                />
                <span className="text-[10px] text-faint">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-5">{t('don_title')}</h3>
          <div className="flex justify-center mb-4">
            <div
              className="w-40 h-40 rounded-full relative"
              style={{ background: 'conic-gradient(#0d9488 0 62%, #10b981 62% 84%, #f59e0b 84% 95%, #ef4444 95% 100%)' }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p
                  className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center"
                  style={{ background: 'var(--bg-1)' }}
                >
                  <b className="text-lg">1,42 tỷ</b>
                  <span className="text-[10px] text-faint">{t('don_total')}</span>
                </p>
              </div>
            </div>
          </div>
          <ul className="text-sm space-y-2">
            <li className="flex items-center"><span className="w-3 h-3 rounded mr-2" style={{ background: '#0d9488' }} /><span>{t('don_vnpay')}</span></li>
            <li className="flex items-center"><span className="w-3 h-3 rounded mr-2" style={{ background: '#10b981' }} /><span>{t('don_cash')}</span></li>
            <li className="flex items-center"><span className="w-3 h-3 rounded mr-2" style={{ background: '#f59e0b' }} /><span>{t('don_bank')}</span></li>
            <li className="flex items-center"><span className="w-3 h-3 rounded mr-2" style={{ background: '#ef4444' }} /><span>{t('don_momo')}</span></li>
          </ul>
        </div>
      </div>

      {/* ===== Recent enrollments + Alerts (mockup 02 lines 177-202) ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{t('rec_title')}</h3>
            <button className="btn-outline text-xs px-4 py-1.5" onClick={() => toast(t('toast_view_all'))}>
              {t('rec_all')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" id="enrollTable">
              <thead>
                <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                  {(['col_student', 'col_class', 'col_branch', 'col_fee', 'col_status'] as const).map((k) => (
                    <th key={k} className="py-2.5 px-3 font-semibold">{t(k)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RECENT.map((r, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-3 px-3"><b>{r.s}</b></td>
                    <td className="py-3 px-3">{r.c}</td>
                    <td className="py-3 px-3">{t(r.b)}</td>
                    <td className="py-3 px-3">{r.f}</td>
                    <td className="py-3 px-3">
                      {r.paid ? (
                        <span className="badge badge-success">{t('st_paid')}</span>
                      ) : (
                        <span className="badge badge-warning">{t('st_pending')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-4">{t('al_title')}</h3>
          <div className="alert-red p-3.5 rounded-xl mb-3 text-sm">
            <b className="block">{t('al_overdue')}</b>
            <span className="text-soft">{t('al_overdue_sub')}</span>
          </div>
          <div className="alert-amber p-3.5 rounded-xl mb-3 text-sm">
            <b className="block">{t('al_addon')}</b>
            <span className="text-soft">{t('al_addon_sub')}</span>
          </div>
          <div className="alert-blue p-3.5 rounded-xl mb-3 text-sm">
            <b className="block">{t('al_storage')}</b>
            <span className="text-soft">{t('al_storage_sub')}</span>
          </div>
          <div className="alert-blue p-3.5 rounded-xl text-sm">
            <b className="block">{t('al_class')}</b>
            <span className="text-soft">{t('al_class_sub')}</span>
          </div>
        </div>
      </div>

      {/* ===== Quick actions (mockup 02 lines 204-212) ===== */}
      <div className="card p-6">
        <h3 className="font-bold mb-4">{t('qa_title')}</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={() => toast(t('toast_demo') + t('qa_enroll'))}>
            + <span>{t('qa_enroll')}</span>
          </button>
          <button className="btn-outline" onClick={() => toast(t('toast_demo') + t('qa_class'))}>
            + <span>{t('qa_class')}</span>
          </button>
          <button className="btn-outline" onClick={() => toast(t('toast_demo') + t('qa_fee'))}>
            + <span>{t('qa_fee')}</span>
          </button>
          <button className="btn-outline" onClick={() => toast(t('toast_demo') + t('qa_report'))}>
            📄 <span>{t('qa_report')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
