import { api } from './api';

/**
 * T044–T046 — Students & Enrollment API client (backend StudentsController).
 * Contract: docs/05-api/api-spec.yaml §Students & Enrollment + DEVIATION endpoints
 * (PUT /students/:id, GET /students/:id/enrollments, PUT /enrollments/:id).
 */

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string | null;
  gender: string | null;
  phone: string | null;
  guardianPhone: string | null;
  identityRef: string | null;
  status: 'active' | 'inactive' | 'graduated' | 'dropped';
  notes: string | null;
  createdAt: string;
}

export interface PagedStudents {
  data: Student[];
  meta: { page: number; pageSize: number; total: number };
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  branchId: string;
  status: 'pending_payment' | 'active' | 'completed' | 'dropped' | 'suspended' | 'waitlist';
  enrolledAt: string;
  class?:
    | {
        id: string;
        code: string;
        name: string;
        program?: { code: string; name: string } | null;
        course?: { code: string; name: string } | null;
      }
    | null;
  student?: { id: string; studentCode: string; fullName: string } | null;
  progress?: { progressPercent: number } | null;
}

export interface CreateEnrollmentResult {
  enrollment: Enrollment;
  invoice: null; // DEVIATION: bảng invoices thuộc phase Finance (ghi D9)
}

export async function listStudents(params: { page: number; pageSize: number; q?: string; branchId?: string }): Promise<PagedStudents> {
  const { data } = await api.get<PagedStudents>('/students', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      q: params.q || undefined,
      branch_id: params.branchId || undefined,
    },
  });
  return data;
}

export async function createStudent(payload: {
  studentCode: string;
  fullName: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  guardianPhone?: string;
  identityRef?: string;
  branchId?: string;
  notes?: string;
}): Promise<Student> {
  const { data } = await api.post<Student>('/students', payload);
  return data;
}

export async function updateStudent(
  id: string,
  payload: { fullName?: string; dateOfBirth?: string; gender?: string; phone?: string; guardianPhone?: string; identityRef?: string; status?: string; notes?: string },
): Promise<Student> {
  const { data } = await api.put<Student>(`/students/${id}`, payload);
  return data;
}

export async function getStudent(id: string): Promise<Student> {
  const { data } = await api.get<Student>(`/students/${id}`);
  return data;
}

export async function listEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
  const { data } = await api.get<Enrollment[]>(`/students/${studentId}/enrollments`);
  return data;
}

export async function createEnrollment(payload: { studentId: string; classId: string }): Promise<CreateEnrollmentResult> {
  const { data } = await api.post<CreateEnrollmentResult>('/enrollments', payload);
  return data;
}

export async function updateEnrollmentStatus(enrollmentId: string, status: string): Promise<Enrollment> {
  const { data } = await api.put<Enrollment>(`/enrollments/${enrollmentId}`, { status });
  return data;
}
