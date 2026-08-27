import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShell } from '../shell/ShellContext';
import {
  createClass,
  createCourse,
  createDepartment,
  createProgram,
  createSchedule,
  deleteSchedule,
  getClass,
  listClasses,
  listCourses,
  listDepartments,
  listPrograms,
  listRooms,
  listSchedules,
  updateClass,
  updateCourse,
  updateDepartment,
  updateProgram,
  type Course,
  type Department,
  type Program,
  type Room,
  type ScheduleRow,
  type SchoolClass,
} from '../services/academic';
import { listUsers, type UserRow } from '../services/users';
import { listBranches, type Branch } from '../services/org';

/**
 * T041–T043 — Academic screen (route /academic = nav mockup 02 nav_academic "Đào tạo").
 * Mockup 02 KHÔNG có screen academic → thiết kế theo design system mockup 02/03 + contract
 * api-spec Academic + DDL §6. 4 tab: Ngành → Chương trình → Khóa học → Lớp học.
 * Tab Lớp học có chi tiết lớp (giảng viên) + lịch học (chống trùng — backend trả 409).
 */

const apiErr = (e: unknown, fallback: string): string => {
  const ax = e as { response?: { data?: { message?: string | string[] } } };
  const m = ax.response?.data?.message;
  if (Array.isArray(m)) return m.join(', ');
  return m ?? fallback;
};

const statusBadge = (status: string) => {
  if (status === 'active' || status === 'open') return <span className="badge badge-success">{status}</span>;
  if (status === 'archived' || status === 'closed') return <span className="badge badge-danger">{status}</span>;
  if (status === 'full') return <span className="badge badge-warning">{status}</span>;
  return <span className="badge badge-primary">{status}</span>;
};

interface Teachers {
  [userId: string]: UserRow;
}

function useTeachers(): Teachers {
  const [map, setMap] = useState<Teachers>({});
  useEffect(() => {
    void listUsers({ page: 1, pageSize: 100 }).then((r) => {
      const m: Teachers = {};
      for (const u of r.data) if (u.roles.some((rl) => rl.code === 'teacher')) m[u.id] = u;
      setMap(m);
    });
  }, []);
  return map;
}

const DAY_KEYS = ['day_1', 'day_2', 'day_3', 'day_4', 'day_5', 'day_6', 'day_7'];

/* ================= DEPARTMENTS ================= */
function DepartmentsTab() {
  const { t, toast } = useShell();
  const [rows, setRows] = useState<Department[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    void listDepartments().then(setRows).catch(() => toast(t('toast_failed')));
  }, [toast, t]);
  useEffect(load, [load]);

  const openAdd = () => {
    setEditing(null); setCode(''); setName(''); setStatus('active'); setModal(true);
  };
  const openEdit = (d: Department) => {
    setEditing(d); setCode(d.code); setName(d.name); setStatus(d.status); setModal(true);
  };
  const submit = async () => {
    setBusy(true);
    try {
      if (editing) {
        await updateDepartment(editing.id, { name, status });
        toast(t('toast_dept_updated'));
      } else {
        await createDepartment({ code, name });
        toast(t('toast_dept_created'));
      }
      setModal(false);
      load();
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-5">
        <span className="flex-1"></span>
        <button className="btn-primary" onClick={openAdd}>+ {t('btn_add_dept')}</button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-soft py-4">{t('no_depts')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-3 font-semibold">{t('col_code')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_dept')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('dept_status')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-3"><span className="badge badge-primary">{d.code}</span></td>
                  <td className="py-3 px-3"><b>{d.name}</b></td>
                  <td className="py-3 px-3">{statusBadge(d.status)}</td>
                  <td className="py-3 px-3 text-right">
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => openEdit(d)}>{t('btn_edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-md mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editing ? t('modal_edit_dept') : t('modal_add_dept')}</h3>
              <button className="text-xl text-faint" onClick={() => setModal(false)}>✕</button>
            </div>
            <label className="block text-sm font-semibold mb-1.5">{t('col_code')}</label>
            <input className="input-field" value={code} onChange={(e) => setCode(e.target.value)} disabled={!!editing} placeholder="EN" />
            <label className="block text-sm font-semibold mb-1.5 mt-4">{t('col_dept')}</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tiếng Anh" />
            {editing && (
              <>
                <label className="block text-sm font-semibold mb-1.5 mt-4">{t('dept_status')}</label>
                <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}>
                  <option value="active">{t('br_active')}</option>
                  <option value="inactive">{t('br_archived')}</option>
                </select>
              </>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void submit()} disabled={busy || !code.trim() || !name.trim()}>
                {busy ? t('loading') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= PROGRAMS ================= */
function ProgramsTab({ departments }: { departments: Department[] }) {
  const { t, toast } = useShell();
  const [rows, setRows] = useState<Program[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [dept, setDept] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [months, setMonths] = useState('');
  const [status, setStatus] = useState('draft');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    void listPrograms().then(setRows).catch(() => toast(t('toast_failed')));
  }, [toast, t]);
  useEffect(load, [load]);

  const openAdd = () => {
    setEditing(null); setDept(departments[0]?.id ?? ''); setCode(''); setName(''); setDesc(''); setMonths(''); setStatus('draft'); setModal(true);
  };
  const openEdit = (p: Program) => {
    setEditing(p); setDept(p.departmentId); setCode(p.code); setName(p.name); setDesc(p.description ?? ''); setMonths(p.durationMonths ? String(p.durationMonths) : ''); setStatus(p.status); setModal(true);
  };
  const submit = async () => {
    setBusy(true);
    try {
      if (editing) {
        await updateProgram(editing.id, { name, description: desc, durationMonths: months ? Number(months) : undefined, status });
        toast(t('toast_program_updated'));
      } else {
        await createProgram({ departmentId: dept, code, name, description: desc, durationMonths: months ? Number(months) : undefined });
        toast(t('toast_program_created'));
      }
      setModal(false);
      load();
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-5">
        <span className="flex-1"></span>
        <button className="btn-primary" onClick={openAdd}>+ {t('btn_add_program')}</button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-soft py-4">{t('no_programs')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-3 font-semibold">{t('col_code')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('tab_program')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_department')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_duration_months')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_status')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-3"><span className="badge badge-primary">{p.code}</span></td>
                  <td className="py-3 px-3"><b>{p.name}</b></td>
                  <td className="py-3 px-3 text-soft">{p.department ? `${p.department.code} — ${p.department.name}` : '—'}</td>
                  <td className="py-3 px-3">{p.durationMonths ? `${p.durationMonths} tháng` : '—'}</td>
                  <td className="py-3 px-3">{statusBadge(p.status)}</td>
                  <td className="py-3 px-3 text-right">
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => openEdit(p)}>{t('btn_edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-2xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editing ? t('modal_edit_program') : t('modal_add_program')}</h3>
              <button className="text-xl text-faint" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_department')}</label>
                <select className="input-field" value={dept} onChange={(e) => setDept(e.target.value)} disabled={!!editing}>
                  <option value="">{t('opt_none')}</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('col_code')}</label>
                <input className="input-field" value={code} onChange={(e) => setCode(e.target.value)} disabled={!!editing} placeholder="EN-MASTER" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('tab_program')}</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tiếng Anh Master" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_duration_months')}</label>
                <input type="number" className="input-field" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="12" />
              </div>
            </div>
            <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_description')}</label>
            <textarea className="input-field" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
            {editing && (
              <>
                <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_status')}</label>
                <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">{t('st_draft')}</option>
                  <option value="active">{t('br_active')}</option>
                  <option value="archived">{t('st_archived')}</option>
                </select>
              </>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void submit()} disabled={busy || !dept || !code.trim() || !name.trim()}>
                {busy ? t('loading') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= COURSES ================= */
function CoursesTab({ programs }: { programs: Program[] }) {
  const { t, toast } = useShell();
  const [rows, setRows] = useState<Course[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [prog, setProg] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [order, setOrder] = useState('');
  const [status, setStatus] = useState('draft');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    void listCourses().then(setRows).catch(() => toast(t('toast_failed')));
  }, [toast, t]);
  useEffect(load, [load]);

  const openAdd = () => {
    setEditing(null); setProg(programs[0]?.id ?? ''); setCode(''); setName(''); setDesc(''); setOrder(''); setStatus('draft'); setModal(true);
  };
  const openEdit = (c: Course) => {
    setEditing(c); setProg(c.programId); setCode(c.code); setName(c.name); setDesc(c.description ?? ''); setOrder(String(c.orderIndex)); setStatus(c.status); setModal(true);
  };
  const submit = async () => {
    setBusy(true);
    try {
      if (editing) {
        await updateCourse(editing.id, { name, description: desc, orderIndex: order ? Number(order) : undefined, status });
        toast(t('toast_course_updated'));
      } else {
        await createCourse({ programId: prog, code, name, description: desc, orderIndex: order ? Number(order) : undefined });
        toast(t('toast_course_created'));
      }
      setModal(false);
      load();
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-5">
        <span className="flex-1"></span>
        <button className="btn-primary" onClick={openAdd}>+ {t('btn_add_course')}</button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-soft py-4">{t('no_courses')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-3 font-semibold">{t('col_code')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('tab_course')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_program')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_order_index')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_status')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-3"><span className="badge badge-primary">{c.code}</span></td>
                  <td className="py-3 px-3"><b>{c.name}</b></td>
                  <td className="py-3 px-3 text-soft">{c.program ? `${c.program.code} — ${c.program.name}` : '—'}</td>
                  <td className="py-3 px-3">{c.orderIndex}</td>
                  <td className="py-3 px-3">{statusBadge(c.status)}</td>
                  <td className="py-3 px-3 text-right">
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => openEdit(c)}>{t('btn_edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-2xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editing ? t('modal_edit_course') : t('modal_add_course')}</h3>
              <button className="text-xl text-faint" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_program')}</label>
                <select className="input-field" value={prog} onChange={(e) => setProg(e.target.value)} disabled={!!editing}>
                  <option value="">{t('opt_none')}</option>
                  {programs.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('col_code')}</label>
                <input className="input-field" value={code} onChange={(e) => setCode(e.target.value)} disabled={!!editing} placeholder="EN-M1" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('tab_course')}</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ngữ pháp cơ bản" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_order_index')}</label>
                <input type="number" className="input-field" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="1" />
              </div>
            </div>
            <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_description')}</label>
            <textarea className="input-field" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
            {editing && (
              <>
                <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_status')}</label>
                <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">{t('st_draft')}</option>
                  <option value="active">{t('br_active')}</option>
                  <option value="archived">{t('st_archived')}</option>
                </select>
              </>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void submit()} disabled={busy || !prog || !code.trim() || !name.trim()}>
                {busy ? t('loading') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= CLASSES ================= */
function ClassesTab({ programs, courses, branches }: { programs: Program[]; courses: Course[]; branches: Branch[] }) {
  const { t, toast } = useShell();
  const teachers = useTeachers();
  const [rows, setRows] = useState<SchoolClass[]>([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<SchoolClass | null>(null);
  const [bId, setBId] = useState('');
  const [pId, setPId] = useState('');
  const [cId, setCId] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [modality, setModality] = useState('offline');
  const [capacity, setCapacity] = useState('20');
  const [sDate, setSDate] = useState('');
  const [eDate, setEDate] = useState('');
  const [tIds, setTIds] = useState<string[]>([]);
  const [status, setStatus] = useState('draft');
  const [busy, setBusy] = useState(false);

  // detail
  const [detail, setDetail] = useState<SchoolClass | null>(null);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  // schedule form
  const [sDay, setSDay] = useState('2');
  const [sStart, setSStart] = useState('18:00');
  const [sEnd, setSEnd] = useState('19:30');
  const [sTeacher, setSTeacher] = useState('');
  const [sRoom, setSRoom] = useState('');
  const [sValidFrom, setSValidFrom] = useState('');
  const [sValidTo, setSValidTo] = useState('');

  const load = useCallback(() => {
    void listClasses({ branchId: branchFilter || undefined })
      .then(setRows)
      .catch(() => toast(t('toast_failed')));
    void listRooms().then(setRooms).catch(() => undefined);
  }, [branchFilter, toast, t]);
  useEffect(load, [load]);

  const openAdd = () => {
    setEditing(null);
    setBId(branchFilter || branches[0]?.id || '');
    setPId(programs[0]?.id || '');
    setCId(courses.find((c) => c.programId === programs[0]?.id)?.id || courses[0]?.id || '');
    setCode(''); setName(''); setModality('offline'); setCapacity('20'); setSDate(''); setEDate(''); setTIds([]); setStatus('draft');
    setModal(true);
  };
  const openEdit = (c: SchoolClass) => {
    setEditing(c); setBId(c.branchId); setPId(c.programId); setCId(c.courseId);
    setCode(c.code); setName(c.name); setModality(c.modality); setCapacity(String(c.capacity));
    setSDate(c.startDate ?? ''); setEDate(c.endDate ?? ''); setTIds(c.teachers?.map((x) => x.teacherId) ?? []); setStatus(c.status);
    setModal(true);
  };
  const submit = async () => {
    setBusy(true);
    try {
      if (editing) {
        await updateClass(editing.id, { name, modality, capacity: Number(capacity), startDate: sDate || undefined, endDate: eDate || undefined, status, teacherIds: tIds });
        toast(t('toast_class_updated'));
      } else {
        await createClass({ branchId: bId, programId: pId, courseId: cId, code, name, modality, capacity: Number(capacity), startDate: sDate || undefined, endDate: eDate || undefined, teacherIds: tIds });
        toast(t('toast_class_created'));
      }
      setModal(false);
      load();
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    } finally {
      setBusy(false);
    }
  };

  const openDetail = async (c: SchoolClass) => {
    try {
      const full = await getClass(c.id);
      setDetail(full);
      setSchedules(await listSchedules(c.id));
      setSTeacher(Object.keys(teachers)[0] ?? '');
      setSValidFrom(new Date().toISOString().slice(0, 10));
      setSValidTo('');
    } catch {
      toast(t('toast_failed'));
    }
  };

  const addSchedule = async () => {
    if (!detail) return;
    try {
      await createSchedule(detail.id, {
        dayOfWeek: Number(sDay),
        startTime: sStart,
        endTime: sEnd,
        teacherId: sTeacher,
        roomId: sRoom || undefined,
        validFrom: sValidFrom,
        validTo: sValidTo || undefined,
      });
      toast(t('toast_schedule_created'));
      setSchedules(await listSchedules(detail.id));
      setDetail(await getClass(detail.id));
    } catch (e) {
      toast(apiErr(e, t('toast_failed')));
    }
  };

  const removeSchedule = async (scheduleId: string) => {
    if (!detail) return;
    try {
      await deleteSchedule(detail.id, scheduleId);
      toast(t('toast_schedule_deleted'));
      setSchedules(await listSchedules(detail.id));
    } catch {
      toast(t('toast_failed'));
    }
  };

  const coursesOfProgram = useMemo(() => courses.filter((c) => c.programId === pId), [courses, pId]);

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-3 mb-5">
        <select className="input-field !w-56" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="">{t('all_branches')}</option>
          {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <span className="flex-1"></span>
        <button className="btn-primary" onClick={openAdd}>+ {t('btn_add_class')}</button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-soft py-4">{t('no_classes')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2.5 px-3 font-semibold">{t('col_code')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('col_class')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_branch')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_program')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_course')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_capacity')}</th>
                <th className="py-2.5 px-3 font-semibold">{t('f_status')}</th>
                <th className="py-2.5 px-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 px-3"><span className="badge badge-primary">{c.code}</span></td>
                  <td className="py-3 px-3"><b>{c.name}</b></td>
                  <td className="py-3 px-3 text-soft">{branches.find((b) => b.id === c.branchId)?.name ?? '—'}</td>
                  <td className="py-3 px-3 text-soft">{c.program ? c.program.code : '—'}</td>
                  <td className="py-3 px-3 text-soft">{c.course ? c.course.code : '—'}</td>
                  <td className="py-3 px-3">{c.enrolledCount}/{c.capacity}</td>
                  <td className="py-3 px-3">{statusBadge(c.status)}</td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => void openDetail(c)}>{t('col_schedule')}</button>
                    <button className="btn-outline text-xs px-3 py-1" onClick={() => openEdit(c)}>{t('btn_edit')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== MODAL: Thêm / Sửa lớp ===== */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-2xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editing ? t('modal_edit_class') : t('modal_add_class')}</h3>
              <button className="text-xl text-faint" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_branch')}</label>
                <select className="input-field" value={bId} onChange={(e) => setBId(e.target.value)} disabled={!!editing}>
                  <option value="">{t('opt_none')}</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('col_code')}</label>
                <input className="input-field" value={code} onChange={(e) => setCode(e.target.value)} disabled={!!editing} placeholder="EN-M1-01" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_program')}</label>
                <select className="input-field" value={pId} onChange={(e) => { setPId(e.target.value); setCId(courses.find((c) => c.programId === e.target.value)?.id ?? ''); }} disabled={!!editing}>
                  <option value="">{t('opt_none')}</option>
                  {programs.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_course')}</label>
                <select className="input-field" value={cId} onChange={(e) => setCId(e.target.value)} disabled={!!editing}>
                  <option value="">{t('opt_none')}</option>
                  {coursesOfProgram.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">{t('col_class')}</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lớp Anh văn M1 - Ca 1" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_modality')}</label>
                <select className="input-field" value={modality} onChange={(e) => setModality(e.target.value)}>
                  <option value="offline">{t('mod_offline')}</option>
                  <option value="online">{t('mod_online')}</option>
                  <option value="hybrid">{t('mod_hybrid')}</option>
                  <option value="flexible">{t('mod_flexible')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_capacity')}</label>
                <input type="number" className="input-field" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_start_date')}</label>
                <input type="date" className="input-field" value={sDate} onChange={(e) => setSDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_end_date')}</label>
                <input type="date" className="input-field" value={eDate} onChange={(e) => setEDate(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1.5">{t('f_teachers')}</label>
                <select className="input-field" multiple size={3} value={tIds} onChange={(e) => setTIds(Array.from(e.target.selectedOptions).map((o) => o.value))}>
                  {Object.values(teachers).map((u) => <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>)}
                </select>
              </div>
            </div>
            {editing && (
              <>
                <label className="block text-sm font-semibold mb-1.5 mt-4">{t('f_status')}</label>
                <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">{t('st_draft')}</option>
                  <option value="active">{t('br_active')}</option>
                  <option value="archived">{t('st_archived')}</option>
                </select>
              </>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-outline" onClick={() => setModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={() => void submit()} disabled={busy || !bId || !pId || !cId || !code.trim() || !name.trim()}>
                {busy ? t('loading') : t('save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: Chi tiết lớp + lịch học ===== */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 overflow-y-auto" style={{ background: 'rgba(0,0,0,.45)' }}>
          <div className="card p-8 w-full max-w-3xl mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{t('class_detail')}: {detail.code} — {detail.name}</h3>
              <button className="text-xl text-faint" onClick={() => setDetail(null)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-5">
              <div><span className="text-soft">{t('f_branch')}:</span> <b>{branches.find((b) => b.id === detail.branchId)?.name ?? detail.branchId}</b></div>
              <div><span className="text-soft">{t('f_program')}:</span> <b>{detail.program ? `${detail.program.code} — ${detail.program.name}` : detail.programId}</b></div>
              <div><span className="text-soft">{t('f_course')}:</span> <b>{detail.course ? `${detail.course.code} — ${detail.course.name}` : detail.courseId}</b></div>
              <div><span className="text-soft">{t('f_modality')}:</span> <b>{t(`mod_${detail.modality}`)}</b> · <span className="text-soft">{t('f_capacity')}:</span> <b>{detail.enrolledCount}/{detail.capacity}</b></div>
              <div><span className="text-soft">{t('f_start_date')}:</span> <b>{detail.startDate ?? '—'}</b></div>
              <div><span className="text-soft">{t('f_end_date')}:</span> <b>{detail.endDate ?? '—'}</b></div>
              <div className="col-span-2">
                <span className="text-soft">{t('f_teachers')}:</span>{' '}
                {detail.teachers?.length ? (
                  detail.teachers.map((x) => <span key={x.teacherId} className="badge badge-primary mr-1">{x.fullName}</span>)
                ) : (
                  <span className="text-soft">—</span>
                )}
              </div>
            </div>

            <p className="text-xs font-bold uppercase mb-2 text-faint">{t('sched_title')}</p>
            {schedules.length === 0 ? (
              <p className="text-sm text-soft py-2">{t('no_schedules')}</p>
            ) : (
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-soft" style={{ borderBottom: '1px solid var(--border)' }}>
                      <th className="py-2 px-3 font-semibold">{t('f_day_of_week')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_start_time')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_end_time')}</th>
                      <th className="py-2 px-3 font-semibold">{t('col_teacher')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_room')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_recurrence')}</th>
                      <th className="py-2 px-3 font-semibold">{t('f_valid_from')}</th>
                      <th className="py-2 px-3 font-semibold text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((s) => (
                      <tr key={s.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-2 px-3">{t(DAY_KEYS[s.dayOfWeek - 1])}</td>
                        <td className="py-2 px-3">{s.startTime.slice(0, 5)}</td>
                        <td className="py-2 px-3">{s.endTime.slice(0, 5)}</td>
                        <td className="py-2 px-3">{teachers[s.teacherId]?.fullName ?? s.teacherId}</td>
                        <td className="py-2 px-3">{rooms.find((r) => r.id === s.roomId)?.code ?? '—'}</td>
                        <td className="py-2 px-3">{t(`rec_${s.recurrence}`)}</td>
                        <td className="py-2 px-3 text-soft">{s.validFrom}{s.validTo ? ` → ${s.validTo}` : ''}</td>
                        <td className="py-2 px-3 text-right">
                          <button className="btn-outline text-xs px-2 py-1" style={{ color: '#dc2626' }} onClick={() => void removeSchedule(s.id)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-xs font-bold uppercase mb-2 text-faint">{t('modal_add_schedule')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_day_of_week')}</label>
                <select className="input-field" value={sDay} onChange={(e) => setSDay(e.target.value)}>
                  {DAY_KEYS.map((k, i) => <option key={k} value={i + 1}>{t(k)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_start_time')}</label>
                <input type="time" className="input-field" value={sStart} onChange={(e) => setSStart(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_end_time')}</label>
                <input type="time" className="input-field" value={sEnd} onChange={(e) => setSEnd(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('col_teacher')}</label>
                <select className="input-field" value={sTeacher} onChange={(e) => setSTeacher(e.target.value)}>
                  {Object.values(teachers).map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_room')}</label>
                <select className="input-field" value={sRoom} onChange={(e) => setSRoom(e.target.value)}>
                  <option value="">{t('opt_none')}</option>
                  {rooms.filter((r) => r.branchId === detail.branchId).map((r) => <option key={r.id} value={r.id}>{r.code} — {r.name ?? ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_valid_from')}</label>
                <input type="date" className="input-field" value={sValidFrom} onChange={(e) => setSValidFrom(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t('f_valid_to')}</label>
                <input type="date" className="input-field" value={sValidTo} onChange={(e) => setSValidTo(e.target.value)} />
              </div>
              <div className="flex items-end">
                <button className="btn-primary w-full" onClick={() => void addSchedule()} disabled={!sTeacher || !sValidFrom}>
                  + {t('btn_add_schedule')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= PAGE ================= */
export function AcademicPage() {
  const { t } = useShell();
  const [tab, setTab] = useState<'dept' | 'program' | 'course' | 'class'>('dept');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    void Promise.all([listDepartments(), listPrograms(), listCourses(), listBranches()])
      .then(([d, p, c, b]) => {
        setDepartments(d);
        setPrograms(p);
        setCourses(c);
        setBranches(b.data);
      })
      .catch(() => undefined);
  }, [tab]);

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'dept', label: t('tab_dept') },
    { key: 'program', label: t('tab_program') },
    { key: 'course', label: t('tab_course') },
    { key: 'class', label: t('tab_class') },
  ];

  return (
    <div>
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map((x) => (
          <button
            key={x.key}
            className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px ${tab === x.key ? 'text-teal-600 border-teal-500' : 'text-soft border-transparent'}`}
            onClick={() => setTab(x.key)}
          >
            {x.label}
          </button>
        ))}
      </div>
      {tab === 'dept' && <DepartmentsTab />}
      {tab === 'program' && <ProgramsTab departments={departments} />}
      {tab === 'course' && <CoursesTab programs={programs} />}
      {tab === 'class' && <ClassesTab programs={programs} courses={courses} branches={branches} />}
    </div>
  );
}
