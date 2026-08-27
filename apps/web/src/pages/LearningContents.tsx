import { useCallback, useEffect, useRef, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import { listClasses, type SchoolClass } from '../services/academic';
import { downloadContent, listContents, updateContent, uploadContent, type LearningContentItem } from '../services/learning';

/**
 * T052 — Học liệu (Learning Contents): upload file, set access_scope, gán lớp, tải về.
 * DEVIATION: mockup 02 không có screen học liệu — hiển thị như tab thứ 5 trong Academic
 * (route /academic, đúng design system) + route /learning/contents (theo T052).
 * Phân quyền server: content:read (xem/tải), content:manage (upload/sửa).
 */

const apiErr = (e: unknown, fallback: string): string => {
  const ax = e as { response?: { data?: { message?: string | string[] } } };
  const m = ax.response?.data?.message;
  if (Array.isArray(m)) return m.join(', ');
  return m ?? fallback;
};

const TYPE_KEYS: Record<string, string> = {
  document: 'ct_document',
  video: 'ct_video',
  audio: 'ct_audio',
  presentation: 'ct_presentation',
  interactive: 'ct_interactive',
  ebook: 'ct_ebook',
};

const SCOPE_KEYS: Record<string, string> = {
  public: 'sc_public',
  class: 'sc_class',
  private: 'sc_private',
};

function fmtSize(bytes: string | null): string {
  const n = Number(bytes ?? 0);
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}

export function LearningContents() {
  const { t, toast } = useShell();
  const [rows, setRows] = useState<LearningContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [filterClass, setFilterClass] = useState('');
  const [filterScope, setFilterScope] = useState('');
  // upload modal
  const [modal, setModal] = useState(false);
  const [fTitle, setFTitle] = useState('');
  const [fScope, setFScope] = useState('class');
  const [fClassIds, setFClassIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  // edit modal
  const [editRow, setEditRow] = useState<LearningContentItem | null>(null);

  const load = useCallback(() => {
    void listContents({ page, pageSize: 20, classId: filterClass || undefined, accessScope: filterScope || undefined })
      .then((r) => {
        setRows(r.data);
        setTotal(r.meta.total);
      })
      .catch(() => toast(t('toast_failed')));
  }, [page, filterClass, filterScope, toast, t]);
  useEffect(load, [load]);
  useEffect(() => {
    void listClasses({}).then((c) => setClasses(c)).catch(() => undefined);
  }, []);

  const submit = async () => {
    const file = fileRef.current?.files?.[0];
    if (!fTitle.trim() || !file) {
      toast(t('lc_need_title_file'));
      return;
    }
    setBusy(true);
    try {
      await uploadContent({ title: fTitle.trim(), accessScope: fScope, classIds: fClassIds, file });
      toast(t('toast_content_uploaded'));
      setModal(false);
      setFileName('');
      setFTitle('');
      setFClassIds([]);
      setPage(1);
      load();
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    } finally {
      setBusy(false);
    }
  };

  const saveEdit = async () => {
    if (!editRow) return;
    try {
      await updateContent(editRow.id, { title: editRow.title, accessScope: editRow.accessScope, classIds: fClassIds });
      toast(t('toast_content_updated'));
      setEditRow(null);
      load();
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-5">
        <select className="input-field !w-52" value={filterClass} onChange={(e) => { setFilterClass(e.target.value); setPage(1); }}>
          <option value="">{t('lc_all_classes')}</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
        </select>
        <select className="input-field !w-44" value={filterScope} onChange={(e) => { setFilterScope(e.target.value); setPage(1); }}>
          <option value="">{t('lc_all_scopes')}</option>
          <option value="public">{t('sc_public')}</option>
          <option value="class">{t('sc_class')}</option>
          <option value="private">{t('sc_private')}</option>
        </select>
        <span className="flex-1"></span>
        <button className="btn-primary" onClick={() => setModal(true)}>+ {t('lc_upload')}</button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-soft py-4">{t('lc_no_content')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="contentTable">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-3 font-semibold">{t('col_title')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_type')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_scope')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_classes')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_size')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_uploaded_at')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-3"><b>{c.title}</b></td>
                  <td className="py-3 px-3"><span className="badge badge-primary">{t(TYPE_KEYS[c.contentType] ?? 'ct_document')}</span></td>
                  <td className="py-3 px-3">
                    {c.accessScope === 'public' && <span className="badge badge-success">{t('sc_public')}</span>}
                    {c.accessScope === 'class' && <span className="badge badge-warning">{t('sc_class')}</span>}
                    {c.accessScope === 'private' && <span className="badge">{t('sc_private')}</span>}
                  </td>
                  <td className="py-3 px-3 text-xs">
                    {(c.classLinks ?? []).map((l) => l.class?.code).filter(Boolean).join(', ') || <span className="text-faint">—</span>}
                  </td>
                  <td className="py-3 px-3 text-soft">{fmtSize(c.fileSizeBytes)}</td>
                  <td className="py-3 px-3 text-soft">{c.createdAt?.slice(0, 10)}</td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => void downloadContent(c.id).catch((e) => toast(apiErr(e, t('toast_failed'))))}>
                      {t('btn_download')}
                    </button>
                    <button
                      className="btn-outline text-xs px-3 py-1"
                      onClick={() => {
                        setEditRow(c);
                        setFClassIds((c.classLinks ?? []).map((l) => l.classId));
                      }}
                    >
                      {t('btn_edit')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 text-sm text-soft">
            <span>{t('lc_total').replace('{n}', String(total))}</span>
            <div className="flex items-center space-x-3">
              <button className="btn-outline text-xs px-3 py-1" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
              <span>{t('page_label').replace('{page}', String(page)).replace('{total}', String(totalPages))}</span>
              <button className="btn-outline text-xs px-3 py-1" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Upload ===== */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('lc_upload')}</h3>
              <button className="text-xl text-faint" onClick={() => setModal(false)}>✕</button>
            </div>
            <label className="block text-sm font-semibold mb-1.5">{t('f_title')} *</label>
            <input className="input-field" value={fTitle} onChange={(e) => setFTitle(e.target.value)} placeholder={t('lc_title_ph')} />
            <label className="block text-sm font-semibold mb-1.5 mt-4">{t('col_scope')}</label>
            <select className="input-field" value={fScope} onChange={(e) => setFScope(e.target.value)}>
              <option value="class">{t('sc_class')}</option>
              <option value="public">{t('sc_public')}</option>
              <option value="private">{t('sc_private')}</option>
            </select>
            <label className="block text-sm font-semibold mb-1.5 mt-4">{t('col_classes')}</label>
            <select
              className="input-field"
              multiple
              value={fClassIds}
              onChange={(e) => setFClassIds(Array.from(e.target.selectedOptions).map((o) => o.value))}
            >
              {classes.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
            <p className="text-xs text-faint mt-1">{t('lc_multiple_hint')}</p>
            <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_file')} *</label>
            <input
              ref={fileRef}
              type="file"
              className="input-field"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
              data-testid="contentFile"
            />
            {fileName && <p className="text-xs text-soft mt-1">{fileName} — {t('lc_limit')}</p>}
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void submit()} disabled={busy || !fTitle.trim() || !fileName}>
                {busy ? t('loading') : t('lc_upload')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Sửa scope/lớp ===== */}
      {editRow && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('lc_edit')}: {editRow.title}</h3>
              <button className="text-xl text-faint" onClick={() => setEditRow(null)}>✕</button>
            </div>
            <label className="block text-sm font-semibold mb-1.5">{t('col_scope')}</label>
            <select
              className="input-field"
              value={editRow.accessScope}
              onChange={(e) => setEditRow({ ...editRow, accessScope: e.target.value as LearningContentItem['accessScope'] })}
            >
              <option value="class">{t('sc_class')}</option>
              <option value="public">{t('sc_public')}</option>
              <option value="private">{t('sc_private')}</option>
            </select>
            <label className="block text-sm font-semibold mb-1.5 mt-4">{t('col_classes')}</label>
            <select
              className="input-field"
              multiple
              value={fClassIds}
              onChange={(e) => setFClassIds(Array.from(e.target.selectedOptions).map((o) => o.value))}
            >
              {classes.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setEditRow(null)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void saveEdit()}>{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
