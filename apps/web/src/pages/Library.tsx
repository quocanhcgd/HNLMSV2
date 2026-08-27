import { useCallback, useEffect, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import { downloadContent, searchLibrary, type LearningContentItem } from '../services/learning';

/**
 * T055 — Thư viện học viên (route /learning/library): tìm kiếm học liệu
 * (public + học liệu lớp đang ghi danh) theo q/subject + phân trang + tải về.
 */

const TYPE_KEYS: Record<string, string> = {
  document: 'ct_document',
  video: 'ct_video',
  audio: 'ct_audio',
  presentation: 'ct_presentation',
  interactive: 'ct_interactive',
  ebook: 'ct_ebook',
};

function fmtSize(bytes: string | null): string {
  const n = Number(bytes ?? 0);
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${n} B`;
}

export function LibraryPage() {
  const { t, toast } = useShell();
  const [rows, setRows] = useState<LearningContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState('');

  const load = useCallback(() => {
    void searchLibrary({ page, pageSize: 20, q: q || undefined, subject: subject || undefined })
      .then((r) => {
        setRows(r.data);
        setTotal(r.meta.total);
      })
      .catch(() => toast(t('toast_failed')));
  }, [page, q, subject, toast, t]);
  useEffect(load, [load]);

  const totalPages = Math.max(1, Math.ceil(total / 20));

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input className="input-field !w-80" placeholder={t('lib_search_ph')} value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        <input className="input-field !w-48" placeholder={t('f_subject')} value={subject} onChange={(e) => { setSubject(e.target.value); setPage(1); }} />
        <span className="flex-1"></span>
      </div>

      {rows.length === 0 ? (
        <div className="card p-8 text-center text-soft">{t('lc_no_content')}</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((c) => (
            <div key={c.id} className="card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-primary">{t(TYPE_KEYS[c.contentType] ?? 'ct_document')}</span>
                <span className="text-xs text-faint">{fmtSize(c.fileSizeBytes)}</span>
              </div>
              <p className="font-bold mb-1">{c.title}</p>
              <p className="text-xs text-soft mb-3 flex-1">
                {c.classLinks?.length
                  ? `${t('col_classes')}: ${c.classLinks.map((l) => l.class?.code).filter(Boolean).join(', ')}`
                  : t('sc_public')}
              </p>
              <button
                className="btn-outline text-xs px-3 py-1.5 self-start"
                onClick={() => void downloadContent(c.id).catch((e) => {
                  const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message;
                  toast(msg ?? t('toast_failed'));
                })}
              >
                {t('btn_download')}
              </button>
            </div>
          ))}
        </div>
      )}

      {total > 20 && (
        <div className="flex items-center justify-between mt-4 text-sm text-soft">
          <span>{t('lc_total').replace('{n}', String(total))}</span>
          <div className="flex items-center space-x-3">
            <button className="btn-outline text-xs px-3 py-1" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
            <span>{t('page_label').replace('{page}', String(page)).replace('{total}', String(totalPages))}</span>
            <button className="btn-outline text-xs px-3 py-1" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}
