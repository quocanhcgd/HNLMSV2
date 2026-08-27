import { api } from './api';

/**
 * T040 — Academic API client (backend AcademicController).
 * Contract: docs/05-api/api-spec.yaml §Academic + DDL docs/04-database-schema.md §6.
 */

export interface Department {
  id: string;
  code: string;
  name: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Program {
  id: string;
  departmentId: string;
  department?: { id: string; code: string; name: string } | null;
  code: string;
  name: string;
  description: string | null;
  durationMonths: number | null;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
}

export interface Course {
  id: string;
  programId: string;
  program?: { id: string; code: string; name: string } | null;
  code: string;
  name: string;
  description: string | null;
  orderIndex: number;
  status: 'draft' | 'active' | 'archived';
}

export interface Room {
  id: string;
  branchId: string;
  code: string;
  name: string | null;
  capacity: number | null;
  status: 'active' | 'inactive';
}

export interface ClassTeacher {
  teacherId: string;
  fullName: string;
  email: string;
  role: string;
}

export interface SchoolClass {
  id: string;
  branchId: string;
  programId: string;
  courseId: string;
  program?: { id: string; code: string; name: string } | null;
  course?: { id: string; code: string; name: string } | null;
  code: string;
  name: string;
  modality: 'offline' | 'online' | 'hybrid' | 'flexible';
  capacity: number;
  enrolledCount: number;
  enrollmentStatus: 'draft' | 'open' | 'closed' | 'full' | 'archived';
  startDate: string | null;
  endDate: string | null;
  status: 'draft' | 'active' | 'archived';
  teachers?: ClassTeacher[];
}

export interface ScheduleRow {
  id: string;
  classId: string;
  branchId: string;
  roomId: string | null;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  recurrence: 'weekly' | 'biweekly' | 'once';
  validFrom: string;
  validTo: string | null;
  createdAt: string;
}

// ================= DEPARTMENTS =================
export async function listDepartments(): Promise<Department[]> {
  const { data } = await api.get<Department[]>('/departments');
  return data;
}
export async function createDepartment(input: { code: string; name: string }): Promise<Department> {
  const { data } = await api.post<Department>('/departments', input);
  return data;
}
export async function updateDepartment(id: string, input: { name?: string; status?: 'active' | 'inactive' }): Promise<Department> {
  const { data } = await api.put<Department>(`/departments/${id}`, input);
  return data;
}

// ================= PROGRAMS =================
export async function listPrograms(filters: { departmentId?: string; status?: string } = {}): Promise<Program[]> {
  const { data } = await api.get<Program[]>('/programs', { params: { department_id: filters.departmentId, status: filters.status } });
  return data;
}
export async function createProgram(input: { departmentId: string; code: string; name: string; description?: string; durationMonths?: number }): Promise<Program> {
  const { data } = await api.post<Program>('/programs', input);
  return data;
}
export async function updateProgram(id: string, input: { name?: string; description?: string; durationMonths?: number; status?: string }): Promise<Program> {
  const { data } = await api.put<Program>(`/programs/${id}`, input);
  return data;
}

// ================= COURSES =================
export async function listCourses(filters: { programId?: string; status?: string } = {}): Promise<Course[]> {
  const { data } = await api.get<Course[]>('/courses', { params: { program_id: filters.programId, status: filters.status } });
  return data;
}
export async function createCourse(input: { programId: string; code: string; name: string; description?: string; orderIndex?: number }): Promise<Course> {
  const { data } = await api.post<Course>('/courses', input);
  return data;
}
export async function updateCourse(id: string, input: { name?: string; description?: string; orderIndex?: number; status?: string }): Promise<Course> {
  const { data } = await api.put<Course>(`/courses/${id}`, input);
  return data;
}

// ================= ROOMS =================
export async function listRooms(): Promise<Room[]> {
  const { data } = await api.get<Room[]>('/rooms');
  return data;
}
export async function createRoom(input: { branchId: string; code: string; name?: string; capacity?: number }): Promise<Room> {
  const { data } = await api.post<Room>('/rooms', input);
  return data;
}
export async function updateRoom(id: string, input: { name?: string; capacity?: number; status?: 'active' | 'inactive' }): Promise<Room> {
  const { data } = await api.put<Room>(`/rooms/${id}`, input);
  return data;
}

// ================= CLASSES =================
export async function listClasses(filters: { branchId?: string; programId?: string; status?: string } = {}): Promise<SchoolClass[]> {
  const { data } = await api.get<SchoolClass[]>('/classes', { params: { branch_id: filters.branchId, program_id: filters.programId, status: filters.status } });
  return data;
}
export async function createClass(input: {
  branchId: string;
  programId: string;
  courseId: string;
  code: string;
  name: string;
  modality?: string;
  capacity?: number;
  startDate?: string;
  endDate?: string;
  teacherIds?: string[];
}): Promise<SchoolClass> {
  const { data } = await api.post<SchoolClass>('/classes', input);
  return data;
}
export async function getClass(id: string): Promise<SchoolClass> {
  const { data } = await api.get<SchoolClass>(`/classes/${id}`);
  return data;
}
export async function updateClass(id: string, input: Partial<Record<string, unknown>>): Promise<SchoolClass> {
  const { data } = await api.put<SchoolClass>(`/classes/${id}`, input);
  return data;
}

// ================= SCHEDULES =================
export async function listSchedules(classId: string): Promise<ScheduleRow[]> {
  const { data } = await api.get<ScheduleRow[]>(`/classes/${classId}/schedules`);
  return data;
}
export async function createSchedule(classId: string, input: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacherId: string;
  roomId?: string;
  recurrence?: string;
  validFrom: string;
  validTo?: string;
}): Promise<ScheduleRow> {
  const { data } = await api.post<ScheduleRow>(`/classes/${classId}/schedules`, input);
  return data;
}
export async function deleteSchedule(classId: string, scheduleId: string): Promise<void> {
  await api.delete(`/classes/${classId}/schedules/${scheduleId}`);
}
