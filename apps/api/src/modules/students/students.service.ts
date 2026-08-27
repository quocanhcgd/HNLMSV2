import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ClassTeacher } from '../academic/class-teacher.entity';
import { Room } from '../academic/room.entity';
import { Schedule } from '../academic/schedule.entity';
import { SchoolClass } from '../academic/class.entity';
import { ContentClassLink } from '../learning/content-class-link.entity';
import { ContentProgress } from '../learning/content-progress.entity';
import { LearningContent } from '../learning/learning-content.entity';
import { OrganizationService } from '../org/organization.service';
import { ScopeContextService } from '../scopes/scope-context.service';
import { UsersService } from '../users/users.service';
import { EnrollmentProgress } from './enrollment-progress.entity';
import { Enrollment } from './enrollment.entity';
import { Student } from './student.entity';

/**
 * T044/T045/T046 — Students & Enrollment service.
 * - students: hồ sơ học viên (org-wide registry — 3-layer model, user_id nullable).
 * - enrollments: ghi danh theo class (branch-scoped, T034+B); trigger sync enrolled_count.
 * - DEVIATION: invoice = null (bảng invoices thuộc phase Finance — ghi D9).
 * T053/T054 — portal học viên: GET /students/me + /students/me/classes/:classId
 * (lớp của tôi + chi tiết lớp: giảng viên, lịch, học liệu + tiến độ).
 * Phân quyền: guard đọc dùng 'user:read'; tạo/đổi enrollment dùng 'enrollment:create'.
 */
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private readonly students: Repository<Student>,
    @InjectRepository(Enrollment) private readonly enrollments: Repository<Enrollment>,
    @InjectRepository(EnrollmentProgress) private readonly progress: Repository<EnrollmentProgress>,
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
    @InjectRepository(ClassTeacher) private readonly classTeachers: Repository<ClassTeacher>,
    @InjectRepository(Schedule) private readonly schedules: Repository<Schedule>,
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
    @InjectRepository(LearningContent) private readonly contents: Repository<LearningContent>,
    @InjectRepository(ContentClassLink) private readonly links: Repository<ContentClassLink>,
    @InjectRepository(ContentProgress) private readonly contentProgress: Repository<ContentProgress>,
    private readonly orgs: OrganizationService,
    private readonly scopeCtx: ScopeContextService,
    private readonly users: UsersService,
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

  // ================= PORTAL HỌC VIÊN (T053/T054) =================

  /** GET /students/me — hồ sơ + các lớp đang ghi danh (kèm program/course + tiến độ). */
  async myPortal(sub: string) {
    const student = await this.findStudentByUser(sub);
    const enrollments = await this.enrollments.find({
      where: { studentId: student.id, status: In(['pending_payment', 'active'] as const) },
      relations: { class: { program: true, course: true }, progress: true },
      order: { enrolledAt: 'DESC' },
    });
    return { student, enrollments };
  }

  /** GET /students/me/classes/:classId — chi tiết lớp cho học viên đang ghi danh:
   *  thông tin + giảng viên + lịch học + học liệu (kèm tiến độ của tôi). */
  async myClassDetail(sub: string, classId: string) {
    const student = await this.findStudentByUser(sub);
    const enrollment = await this.enrollments.findOne({
      where: { studentId: student.id, classId, status: In(['pending_payment', 'active'] as const) },
    });
    if (!enrollment) throw new ForbiddenException('Bạn chưa ghi danh lớp này');
    const cls = await this.classes.findOne({
      where: { id: classId },
      relations: { program: true, course: true },
    });
    if (!cls) throw new NotFoundException('Không tìm thấy lớp học');

    // giảng viên
    const cts = await this.classTeachers.find({ where: { classId } });
    const teachers: { id: string; fullName: string; role: string }[] = [];
    for (const ct of cts) {
      try {
        const u = await this.users.getByIdOrThrow(ct.teacherId);
        teachers.push({ id: u.id, fullName: u.fullName, role: ct.role });
      } catch {
        /* teacher đã bị xóa — bỏ qua */
      }
    }

    // lịch học (kèm tên giảng viên + phòng)
    const scheds = await this.schedules.find({ where: { classId }, order: { dayOfWeek: 'ASC', startTime: 'ASC' } });
    const roomIds = [...new Set(scheds.map((s) => s.roomId).filter(Boolean))] as string[];
    const rooms = roomIds.length ? await this.rooms.find({ where: { id: In(roomIds) } }) : [];
    const roomMap = new Map(rooms.map((r) => [r.id, r.name]));
    const teacherIds = [...new Set(scheds.map((s) => s.teacherId))];
    const teacherNames = new Map<string, string>();
    for (const tid of teacherIds) {
      try {
        const u = await this.users.getByIdOrThrow(tid);
        teacherNames.set(tid, u.fullName);
      } catch {
        teacherNames.set(tid, '—');
      }
    }
    const schedules = scheds.map((s) => ({
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      recurrence: s.recurrence,
      roomName: s.roomId ? roomMap.get(s.roomId) ?? null : null,
      teacherName: teacherNames.get(s.teacherId) ?? '—',
    }));

    // học liệu của lớp (access_scope=class, published) + tiến độ của tôi
    const linked = await this.contents
      .createQueryBuilder('c')
      .innerJoin('content_class_links', 'l', 'l.content_id = c.id')
      .where('l.class_id = :classId', { classId })
      .andWhere("c.access_scope = 'class'")
      .andWhere("c.status = 'published'")
      .getMany();
    const contentIds = linked.map((c) => c.id);
    const myProgress = contentIds.length
      ? await this.contentProgress.find({ where: { studentId: student.id, contentId: In(contentIds) } })
      : [];
    const progressMap = new Map(myProgress.map((p) => [p.contentId, p]));
    const materials = linked.map((c) => ({
      ...c,
      myProgress: progressMap.get(c.id) ?? null,
    }));

    return { class: cls, teachers, schedules, materials };
  }

  private async findStudentByUser(sub: string): Promise<Student> {
    const student = await this.students.findOneBy({ userId: sub });
    if (!student) throw new NotFoundException('Tài khoản chưa liên kết hồ sơ học viên');
    return student;
  }

  // ================= SCOPE =================

  private async assertBranch(branchId: string): Promise<void> {
    const allowed = this.scopeCtx.branchIds();
    if (allowed === null) return;
    if (!allowed.includes(branchId)) throw new ForbiddenException('Chi nhánh nằm ngoài phạm vi được cấp');
  }
}
