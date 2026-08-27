import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShell } from '../../shell/ShellContext';
import { myPortal, type Student, type Enrollment } from '../../services/students';

/** T053 — Lớp của tôi (route /student/classes): bảng các lớp đang ghi danh. */

function enrPct(e: Enrollment & { progress?: { progressPercent: string } | null }): number {
  return Number(e.progress?.progressPercent ?? 0);
}

export function StudentClasses() {
  const { t, toast } = useShell();
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

  return (
    <div>
      <p className="text-sm text-soft mb-4">
        {student ? `${t('f_student_code')} ${student.studentCode} · ${student.fullName}` : ''}
      </p>
      {enrollments.length === 0 ? (
        <div className="card p-8 text-center text-soft">{t('no_classes_portal')}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" id="myClassesTable">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-3 font-semibold">{t('col_class')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_program')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_course')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_enrolled_at')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_progress')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e) => (
                <tr key={e.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-3">
                    <span className="badge badge-primary">{e.class?.code}</span> <b>{e.class?.name}</b>
                  </td>
                  <td className="py-3 px-3 text-soft">{e.class?.program?.name ?? '—'}</td>
                  <td className="py-3 px-3 text-soft">{e.class?.course?.code ?? '—'}</td>
                  <td className="py-3 px-3 text-soft">{e.enrolledAt?.slice(0, 10)}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full gradient-teal" style={{ width: `${enrPct(e)}%` }} />
                      </div>
                      <span className="text-xs">{enrPct(e)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => navigate(`/student/classes/${e.classId}`)}>
                      {t('btn_details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
