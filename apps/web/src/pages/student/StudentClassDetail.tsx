import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShell } from '../../shell/ShellContext';
import { myClassDetail, type PortalClassDetail } from '../../services/students';
import { downloadContent, updateContentProgress } from '../../services/learning';

/**
 * T054 — Chi tiết lớp học viên (route /student/classes/:id):
 * thông tin lớp + giảng viên + lịch học + học liệu (đánh dấu hoàn thành → PATCH progress).
 */

const DAY_KEYS = ['day_1', 'day_2', 'day_3', 'day_4', 'day_5', 'day_6', 'day_7'];
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

export function StudentClassDetail() {
  const { classId } = useParams<{ classId: string }>();
  const { t, toast } = useShell();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<PortalClassDetail | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!classId) return;
    void myClassDetail(classId)
      .then(setDetail)
      .catch((e) => {
        const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message;
        toast(msg ?? t('toast_failed'));
        navigate('/student/classes');
      });
  }, [classId, navigate, t, toast]);
  useEffect(load, [load]);

  const toggleDone = async (contentId: string, isCompleted: boolean) => {
    setBusyId(contentId);
    try {
      await updateContentProgress(contentId, { is_completed: !isCompleted });
      toast(t('toast_progress_updated'));
      await load();
    } catch {
      toast(t('toast_failed'));
    } finally {
      setBusyId(null);
    }
  };

  if (!detail) return <p className="text-sm text-soft">{t('loading')}</p>;

  return (
    <div className="max-w-4xl">
      <button className="text-sm text-soft mb-3" onClick={() => navigate('/student/classes')}>← {t('back')}</button>

      <div className="card p-6 mb-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold">
            <span className="badge badge-primary mr-2">{detail.class.code}</span>
            {detail.class.name}
          </h3>
        </div>
        <p className="text-sm text-soft mb-3">
          {detail.class.program?.name ?? '—'} · {detail.class.course?.name ?? '—'}
          {detail.class.branchId ? '' : ''}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          {detail.teachers.length > 0 && (
            <div>
              <span className="text-soft">{t('col_teachers')}: </span>
              {detail.teachers.map((th, i) => (
                <b key={th.id}>
                  {th.fullName}
                  {th.role !== 'primary' ? ` (${th.role})` : ''}
                  {i < detail.teachers.length - 1 ? ', ' : ''}
                </b>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lịch học */}
      <p className="text-xs font-bold uppercase text-faint mb-2">{t('col_schedule')}</p>
      {detail.schedules.length === 0 ? (
        <p className="text-sm text-soft mb-5">{t('no_schedule')}</p>
      ) : (
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm" id="portalScheduleTable">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2 px-3 font-semibold">{t('col_day')}</th>
                <th className="py-2 px-3 font-semibold">{t('col_time')}</th>
                <th className="py-2 px-3 font-semibold">{t('col_teacher')}</th>
                <th className="py-2 px-3 font-semibold">{t('col_room')}</th>
              </tr>
            </thead>
            <tbody>
              {detail.schedules.map((s) => (
                <tr key={s.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2.5 px-3">{t(DAY_KEYS[s.dayOfWeek - 1] ?? 'day_1')}</td>
                  <td className="py-2.5 px-3">{s.startTime} – {s.endTime}</td>
                  <td className="py-2.5 px-3">{s.teacherName}</td>
                  <td className="py-2.5 px-3">{s.roomName ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Học liệu */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase text-faint">{t('col_materials')}</p>
        <button className="btn-outline text-xs px-3 py-1.5" onClick={() => navigate('/learning/library')}>
          {t('nav_portal_library')} →
        </button>
      </div>
      {detail.materials.length === 0 ? (
        <div className="card p-6 text-center text-soft text-sm">{t('no_materials')}</div>
      ) : (
        <div className="space-y-2">
          {detail.materials.map((m) => (
            <div key={m.id} className="card p-4 flex items-center space-x-4">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={!!m.myProgress?.isCompleted}
                disabled={busyId === m.id}
                onChange={() => void toggleDone(m.id, !!m.myProgress?.isCompleted)}
                data-testid={`done-${m.id}`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {m.title}
                  {m.myProgress?.isCompleted && <span className="badge badge-success ml-2">{t('completed')}</span>}
                </p>
                <p className="text-xs text-soft">
                  {t(TYPE_KEYS[m.contentType] ?? 'ct_document')} · {fmtSize(m.fileSizeBytes)}
                </p>
              </div>
              <button
                className="btn-outline text-xs px-3 py-1"
                onClick={() => void downloadContent(m.id).catch((e) => {
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
    </div>
  );
}
