import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolClass } from '../academic/class.entity';
import { OrganizationService } from '../org/organization.service';
import { ScopeContextService } from '../scopes/scope-context.service';
import { EnrollmentProgress } from './enrollment-progress.entity';
import { Enrollment } from './enrollment.entity';
import { Student } from './student.entity';

/**
 * T044/T045/T046 — Students & Enrollment service.
 * - students: hồ sơ học viên (org-wide registry — 3-layer model, user_id nullable).
 * - enrollments: ghi danh theo class (branch-scoped, T034+B); trigger sync enrolled_count.
 * - DEVIATION: invoice = null (bảng invoices thuộc phase Finance — ghi D9).
 * Phân quyền: guard đọc dùng 'user:read'; tạo/đổi enrollment dùng 'enrollment:create'.
 */
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private readonly students: Repository<Student>,
    @InjectRepository(Enrollment) private readonly enrollments: Repository<Enrollment>,
    @InjectRepository(EnrollmentProgress) private readonly progress: Repository<EnrollmentProgress>,
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
    private readonly orgs: OrganizationService,
    private readonly scopeCtx: ScopeContextService,
  ) {}

  // ================= STUDENTS =================

  async listStudents(input: { page: number; pageSize: number; q?: string; branchId?: string }) {
    const qb = this.students.createQueryBuilder('s').orderBy('s.created_at', 'DESC');
    if (input.q?.trim()) {
      const like = `%${input.q.trim()}%`;
      qb.andWhere('(s.full_name ILIKE :q OR s.student_code ILIKE :q)', { q: like });
    }
    if (input.branchId) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM enrollments e JOIN classes c ON c.id = e.class_id
                 WHERE e.student_id = s.id AND c.branch_id = :branchId)`,
        { branchId: input.branchId },
      );
    }
    qb.skip((input.page - 1) * input.pageSize).take(input.pageSize);
    const [data, total] = await qb.getManyAndCount();
    return { data, meta: { page: input.page, pageSize: input.pageSize, total } };
  }

  async createStudent(input: {
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
    const allowed = this.scopeCtx.branchIds();
    if (input.branchId) await this.assertBranch(input.branchId);
    else if (allowed !== null) throw new BadRequestException('Cần chọn chi nhánh để tạo hồ sơ học viên');
    const org = await this.orgs.getDefault();
    const student = this.students.create({
      organizationId: org.id,
      studentCode: input.studentCode.trim().toUpperCase(),
      fullName: input.fullName.trim(),
      dateOfBirth: input.dateOfBirth ?? null,
      gender: input.gender ?? null,
      phone: input.phone ?? null,
      guardianPhone: input.guardianPhone ?? null,
      identityRef: input.identityRef ?? null,
      status: 'active',
      notes: input.notes ?? null,
    });
    try {
      return await this.students.save(student);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException(`Mã học viên '${student.studentCode}' đã tồn tại`);
      }
      throw err;
    }
  }

  async updateStudent(
    id: string,
    input: { fullName?: string; dateOfBirth?: string; gender?: string; phone?: string; guardianPhone?: string; identityRef?: string; status?: string; notes?: string },
  ): Promise<Student> {
    const student = await this.students.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Không tìm thấy học viên');
    });
    if (input.fullName !== undefined) student.fullName = input.fullName.trim();
    if (input.dateOfBirth !== undefined) student.dateOfBirth = input.dateOfBirth ?? null;
    if (input.gender !== undefined) student.gender = input.gender ?? null;
    if (input.phone !== undefined) student.phone = input.phone ?? null;
    if (input.guardianPhone !== undefined) student.guardianPhone = input.guardianPhone ?? null;
    if (input.identityRef !== undefined) student.identityRef = input.identityRef ?? null;
    if (input.status !== undefined) student.status = input.status as Student['status'];
    if (input.notes !== undefined) student.notes = input.notes ?? null;
    return this.students.save(student);
  }

  async getStudentById(id: string): Promise<Student> {
    const student = await this.students.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Không tìm thấy học viên');
    });
    return student;
  }

  // ================= ENROLLMENTS =================

  async listEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    await this.students.findOneByOrFail({ id: studentId }).catch(() => {
      throw new NotFoundException('Không tìm thấy học viên');
    });
    return this.enrollments.find({
      where: { studentId },
      relations: { class: { program: true, course: true }, student: true, progress: true },
      order: { enrolledAt: 'DESC' },
    });
  }

  async getEnrollmentById(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollments.findOne({
      where: { id },
      relations: { class: { program: true, course: true }, student: true, progress: true },
    });
    if (!enrollment) throw new NotFoundException('Không tìm thấy ghi danh');
    return enrollment;
  }

  /** Ghi danh: chống trùng (UNIQUE) + kiểm tra capacity + scope. DEVIATION: invoice = null (phase Finance). */
  async createEnrollment(
    input: { studentId: string; classId: string },
    userId?: string,
  ): Promise<{ enrollment: Enrollment; invoice: null }> {
    await this.students.findOneByOrFail({ id: input.studentId }).catch(() => {
      throw new NotFoundException('Không tìm thấy học viên');
    });
    const cls = await this.classes.findOneByOrFail({ id: input.classId }).catch(() => {
      throw new NotFoundException('Không tìm thấy lớp học');
    });
    await this.assertBranch(cls.branchId);
    const dup = await this.enrollments.findOne({ where: { studentId: input.studentId, classId: input.classId } });
    if (dup) throw new ConflictException('Học viên đã ghi danh lớp này');
    if (cls.enrolledCount >= cls.capacity) {
      throw new ConflictException(`Lớp đã đầy (${cls.enrolledCount}/${cls.capacity} chỗ)`);
    }
    const org = await this.orgs.getDefault();
    const enrollment = this.enrollments.create({
      organizationId: org.id,
      branchId: cls.branchId,
      studentId: input.studentId,
      classId: input.classId,
      status: 'pending_payment',
      createdBy: userId ?? null,
    });
    const saved = await this.enrollments.save(enrollment);
    const full = await this.getEnrollmentById(saved.id);
    return { enrollment: full, invoice: null };
  }

  async updateEnrollmentStatus(id: string, status: Enrollment['status']): Promise<Enrollment> {
    const enrollment = await this.getEnrollmentById(id);
    if (enrollment.status !== status) {
      enrollment.status = status;
      await this.enrollments.save(enrollment);
    }
    return this.getEnrollmentById(id);
  }

  // ================= SCOPE =================

  private async assertBranch(branchId: string): Promise<void> {
    const allowed = this.scopeCtx.branchIds();
    if (allowed === null) return;
    if (!allowed.includes(branchId)) throw new ForbiddenException('Chi nhánh nằm ngoài phạm vi được cấp');
  }
}
