import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShell } from '../../shell/ShellContext';
import { useAuth } from '../../auth/AuthContext';
import { myPortal, type Student, type Enrollment } from '../../services/students';

/**
 * T053 — Student dashboard (route /student/dashboard): lời chào + các lớp đang ghi danh
 * (kèm program/course + tiến độ) + thư viện quick link.
 */

function enrPct(e: Enrollment & { progress?: { progressPercent: string } | null }): number {
  return Number(e.progress?.progressPercent ?? 0);
}

export function StudentDashboard() {
  const { t, toast } = useShell();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<(Enrollment & { progress?: { progressPercent: string } | null })[]>([]);

  useEffect(() => {
    void myPortal()
      .then((r) => {
        setStudent(r.student);
        setEnrollments(r.enrollments);
      })
      .catch(() => toast(t('toast_failed')));
  }, [toast, t]);

  const firstName = (user?.fullName ?? '').split(' ').slice(0, 2).join(' ') || user?.email;

  return (
    <div>
      <div className="card p-6 mb-6">
        <h3 className="text-xl font-bold mb-1">
          {t('portal_greeting').replace('{name}', firstName ?? '')}
        </h3>
        <p className="text-sm text-soft">
          {student ? `${t('f_student_code')} ${student.studentCode} · ${student.fullName}` : t('loading')}
        </p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase text-faint">{t('my_classes')}</p>
        <button className="btn-outline text-xs px-3 py-1.5" onClick={() => navigate('/student/classes')}>
          {t('view_all')} →
        </button>
      </div>

      {enrollments.length === 0 ? (
        <div className="card p-8 text-center text-soft">{t('no_classes_portal')}</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {enrollments.map((e) => (
            <button
              key={e.id}
              className="card p-5 text-left hover:shadow-md transition-shadow"
              onClick={() => navigate(`/student/classes/${e.classId}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="badge badge-primary">{e.class?.code}</span>
                <span className="text-xs text-faint">{e.enrolledAt?.slice(0, 10)}</span>
              </div>
              <p className="font-bold">{e.class?.name}</p>
              <p className="text-sm text-soft mt-1">
                {e.class?.program?.name ?? '—'} · {e.class?.course?.code ?? ''}
              </p>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-soft">{t('my_progress')}</span>
                  <b>{enrPct(e)}%</b>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full gradient-teal" style={{ width: `${enrPct(e)}%` }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-8 mb-3">
        <p className="text-xs font-bold uppercase text-faint">{t('nav_portal_library')}</p>
        <button className="btn-outline text-xs px-3 py-1.5" onClick={() => navigate('/learning/library')}>
          {t('view_all')} →
        </button>
      </div>
      <button
        className="card p-5 text-left flex items-center space-x-4 hover:shadow-md transition-shadow"
        onClick={() => navigate('/learning/library')}
      >
        <span className="text-3xl">📚</span>
        <span>
          <span className="font-bold block">{t('nav_portal_library')}</span>
          <span className="text-sm text-soft">{t('page_sub_library')}</span>
        </span>
      </button>
    </div>
  );
}
