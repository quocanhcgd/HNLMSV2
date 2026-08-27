import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrganizationService } from '../org/organization.service';
import { ScopeContextService } from '../scopes/scope-context.service';
import { Department } from './department.entity';
import { Program } from './program.entity';
import { Course } from './course.entity';
import { Room } from './room.entity';
import { SchoolClass } from './class.entity';
import { ClassTeacher } from './class-teacher.entity';
import { Schedule } from './schedule.entity';

/**
 * T038+T039+T040 — Academic Core (MVP): departments → programs → courses → classes + rooms + schedules.
 * Contract: docs/05-api/api-spec.yaml (Academic) + DDL docs/04-database-schema.md §6.
 * Phân quyền: guard @RequirePermissions (program:read/create/update, class:read/create/update,
 * schedule:manage). Branch scope (T034+B): classes/rooms lọc theo branch được cấp;
 * departments/programs/courses là cấu trúc org-wide (không lọc branch).
 * Chống trùng lịch (T039): so teacher/room + day_of_week + date-range + time-range overlap → 409.
 */
@Injectable()
export class AcademicService {
  constructor(
    @InjectRepository(Department) private readonly departments: Repository<Department>,
    @InjectRepository(Program) private readonly programs: Repository<Program>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(Room) private readonly rooms: Repository<Room>,
    @InjectRepository(SchoolClass) private readonly classes: Repository<SchoolClass>,
    @InjectRepository(ClassTeacher) private readonly classTeachers: Repository<ClassTeacher>,
    @InjectRepository(Schedule) private readonly schedules: Repository<Schedule>,
    private readonly orgs: OrganizationService,
    private readonly scopeCtx: ScopeContextService,
  ) {}

  // ================= DEPARTMENTS =================

  listDepartments(): Promise<Department[]> {
    return this.departments.find({ order: { createdAt: 'ASC' } });
  }

  async createDepartment(input: { code: string; name: string }): Promise<Department> {
    const org = await this.orgs.getDefault();
    const dept = this.departments.create({
      organizationId: org.id,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      status: 'active',
    });
    try {
      return await this.departments.save(dept);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') throw new ConflictException(`Mã ngành '${dept.code}' đã tồn tại`);
      throw err;
    }
  }

  async updateDepartment(id: string, input: { name?: string; status?: 'active' | 'inactive' }): Promise<Department> {
    const dept = await this.departments.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Không tìm thấy ngành');
    });
    if (input.name !== undefined) dept.name = input.name.trim();
    if (input.status !== undefined) dept.status = input.status;
    return this.departments.save(dept);
  }

  // ================= PROGRAMS =================

  listPrograms(filters: { departmentId?: string; status?: string }): Promise<Program[]> {
    return this.programs.find({
      where: {
        ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
        ...(filters.status ? { status: filters.status as Program['status'] } : {}),
      },
      relations: { department: true },
      order: { createdAt: 'ASC' },
    });
  }

  async createProgram(input: { departmentId: string; code: string; name: string; description?: string; durationMonths?: number }): Promise<Program> {
    const org = await this.orgs.getDefault();
    await this.ensureDepartment(input.departmentId);
    const program = this.programs.create({
      organizationId: org.id,
      departmentId: input.departmentId,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description ?? null,
      durationMonths: input.durationMonths ?? null,
      status: 'draft',
    });
    try {
      return await this.programs.save(program);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') throw new ConflictException(`Mã chương trình '${program.code}' đã tồn tại`);
      throw err;
    }
  }

  async updateProgram(
    id: string,
    input: { name?: string; description?: string; durationMonths?: number; status?: 'draft' | 'active' | 'archived' },
  ): Promise<Program> {
    const program = await this.programs.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Không tìm thấy chương trình');
    });
    if (input.name !== undefined) program.name = input.name.trim();
    if (input.description !== undefined) program.description = input.description ?? null;
    if (input.durationMonths !== undefined) program.durationMonths = input.durationMonths ?? null;
    if (input.status !== undefined) program.status = input.status;
    return this.programs.save(program);
  }

  // ================= COURSES =================

  listCourses(filters: { programId?: string; status?: string }): Promise<Course[]> {
    return this.courses.find({
      where: {
        ...(filters.programId ? { programId: filters.programId } : {}),
        ...(filters.status ? { status: filters.status as Course['status'] } : {}),
      },
      relations: { program: true },
      order: { orderIndex: 'ASC', createdAt: 'ASC' },
    });
  }

  async createCourse(input: { programId: string; code: string; name: string; description?: string; orderIndex?: number }): Promise<Course> {
    const org = await this.orgs.getDefault();
    await this.programs.findOneByOrFail({ id: input.programId }).catch(() => {
      throw new BadRequestException('Chương trình không tồn tại');
    });
    const course = this.courses.create({
      organizationId: org.id,
      programId: input.programId,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description ?? null,
      orderIndex: input.orderIndex ?? 0,
      status: 'draft',
    });
    try {
      return await this.courses.save(course);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') throw new ConflictException(`Mã khóa học '${course.code}' đã tồn tại trong chương trình`);
      throw err;
    }
  }

  async updateCourse(id: string, input: { name?: string; description?: string; orderIndex?: number; status?: 'draft' | 'active' | 'archived' }): Promise<Course> {
    const course = await this.courses.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Không tìm thấy khóa học');
    });
    if (input.name !== undefined) course.name = input.name.trim();
    if (input.description !== undefined) course.description = input.description ?? null;
    if (input.orderIndex !== undefined) course.orderIndex = input.orderIndex;
    if (input.status !== undefined) course.status = input.status;
    return this.courses.save(course);
  }

  // ================= ROOMS =================

  listRooms(): Promise<Room[]> {
    const allowed = this.scopeCtx.branchIds();
    return this.rooms.find({
      where: allowed === null ? {} : { branchId: In(allowed) },
      order: { code: 'ASC' },
    });
  }

  async createRoom(input: { branchId: string; code: string; name?: string; capacity?: number }): Promise<Room> {
    await this.assertBranch(input.branchId);
    const org = await this.orgs.getDefault();
    const room = this.rooms.create({
      organizationId: org.id,
      branchId: input.branchId,
      code: input.code.trim().toUpperCase(),
      name: input.name ?? null,
      capacity: input.capacity ?? null,
      status: 'active',
    });
    try {
      return await this.rooms.save(room);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') throw new ConflictException(`Mã phòng '${room.code}' đã tồn tại trong chi nhánh`);
      throw err;
    }
  }

  async updateRoom(id: string, input: { name?: string; capacity?: number; status?: 'active' | 'inactive' }): Promise<Room> {
    const room = await this.rooms.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException('Không tìm thấy phòng học');
    });
    await this.assertBranch(room.branchId);
    if (input.name !== undefined) room.name = input.name ?? null;
    if (input.capacity !== undefined) room.capacity = input.capacity ?? null;
    if (input.status !== undefined) room.status = input.status;
    return this.rooms.save(room);
  }

  // ================= CLASSES =================

  listClasses(filters: { branchId?: string; programId?: string; status?: string }): Promise<SchoolClass[]> {
    const allowed = this.scopeCtx.branchIds();
    if (allowed !== null && filters.branchId && !allowed.includes(filters.branchId)) return Promise.resolve([]);
    return this.classes.find({
      where: {
        ...(allowed === null ? {} : { branchId: In(allowed) }),
        ...(filters.branchId ? { branchId: filters.branchId } : {}),
        ...(filters.programId ? { programId: filters.programId } : {}),
        ...(filters.status ? { status: filters.status as SchoolClass['status'] } : {}),
      },
      relations: { program: true, course: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createClass(input: {
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
    await this.assertBranch(input.branchId);
    await this.programs.findOneByOrFail({ id: input.programId }).catch(() => {
      throw new BadRequestException('Chương trình không tồn tại');
    });
    await this.courses.findOneByOrFail({ id: input.courseId }).catch(() => {
      throw new BadRequestException('Khóa học không tồn tại');
    });
    const org = await this.orgs.getDefault();
    const cls = this.classes.create({
      organizationId: org.id,
      branchId: input.branchId,
      programId: input.programId,
      courseId: input.courseId,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      modality: (input.modality as SchoolClass['modality']) ?? 'offline',
      capacity: input.capacity ?? 20,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
      enrollmentStatus: 'draft',
      status: 'draft',
    });
    let saved: SchoolClass;
    try {
      saved = await this.classes.save(cls);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') throw new ConflictException(`Mã lớp '${cls.code}' đã tồn tại trong chi nhánh`);
      throw err;
    }
    if (input.teacherIds?.length) await this.setTeachers(saved.id, input.teacherIds);
    return this.getClassById(saved.id);
  }

  async getClassById(id: string): Promise<SchoolClass> {
    const cls = await this.classes.findOne({
      where: { id },
      relations: { program: true, course: true },
    });
    if (!cls) throw new NotFoundException('Không tìm thấy lớp học');
    await this.assertBranch(cls.branchId);
    return cls;
  }

  async updateClass(
    id: string,
    input: {
      name?: string;
      modality?: string;
      capacity?: number;
      startDate?: string;
      endDate?: string;
      enrollmentStatus?: string;
      status?: string;
      teacherIds?: string[];
    },
  ): Promise<SchoolClass> {
    const cls = await this.getClassById(id);
    if (input.name !== undefined) cls.name = input.name.trim();
    if (input.modality !== undefined) cls.modality = input.modality as SchoolClass['modality'];
    if (input.capacity !== undefined) {
      if (input.capacity < cls.enrolledCount) throw new BadRequestException('Sức chứa không được nhỏ hơn số học viên đã ghi danh');
      cls.capacity = input.capacity;
    }
    if (input.startDate !== undefined) cls.startDate = input.startDate ?? null;
    if (input.endDate !== undefined) cls.endDate = input.endDate ?? null;
    if (input.enrollmentStatus !== undefined) cls.enrollmentStatus = input.enrollmentStatus as SchoolClass['enrollmentStatus'];
    if (input.status !== undefined) cls.status = input.status as SchoolClass['status'];
    const saved = await this.classes.save(cls);
    if (input.teacherIds !== undefined) await this.setTeachers(id, input.teacherIds);
    return this.getClassById(saved.id);
  }

  async listTeachers(classId: string): Promise<{ teacherId: string; fullName: string; email: string; role: string }[]> {
    await this.getClassById(classId);
    const rows = (await this.classTeachers
      .createQueryBuilder('ct')
      .select('ct.teacher_id', 'teacher_id')
      .addSelect('ct.role', 'role')
      .addSelect('u.full_name', 'full_name')
      .addSelect('u.email', 'email')
      .innerJoin('users', 'u', 'u.id = ct.teacher_id')
      .where('ct.class_id = :classId', { classId })
      .getRawMany()) as { teacher_id: string; full_name: string; email: string; role: string }[];
    return rows.map((r) => ({ teacherId: r.teacher_id, fullName: r.full_name, email: r.email, role: r.role }));
  }

  private async setTeachers(classId: string, teacherIds: string[]): Promise<void> {
    await this.classTeachers.delete({ classId });
    for (const teacherId of teacherIds) {
      await this.classTeachers.save(this.classTeachers.create({ classId, teacherId, role: 'primary' }));
    }
  }

  // ================= SCHEDULES (T039) =================

  listSchedules(classId: string): Promise<Schedule[]> {
    void this.getClassById(classId); // assert scope
    return this.schedules.find({ where: { classId }, order: { dayOfWeek: 'ASC', startTime: 'ASC' } });
  }

  async createSchedule(
    classId: string,
    input: { dayOfWeek: number; startTime: string; endTime: string; teacherId: string; roomId?: string; recurrence?: string; validFrom: string; validTo?: string },
  ): Promise<Schedule> {
    const cls = await this.getClassById(classId);
    if (input.endTime <= input.startTime) throw new BadRequestException('Giờ kết thúc phải sau giờ bắt đầu');
    if (input.roomId) {
      const room = await this.rooms.findOneByOrFail({ id: input.roomId }).catch(() => {
        throw new BadRequestException('Phòng học không tồn tại');
      });
      await this.assertBranch(room.branchId);
      if (room.branchId !== cls.branchId) throw new BadRequestException('Phòng học thuộc chi nhánh khác với lớp');
    }
    await this.assertBranch(cls.branchId);
    const conflict = await this.findConflict({
      excludeScheduleId: null,
      teacherId: input.teacherId,
      roomId: input.roomId ?? null,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      validFrom: input.validFrom,
      validTo: input.validTo ?? null,
    });
    if (conflict) {
      const who = conflict.roomId ? `phòng ${conflict.roomCode}` : `giảng viên ${conflict.teacherName}`;
      throw new ConflictException(
        `Trùng lịch ${who} (${conflict.classCode}, thứ ${conflict.dayOfWeek}, ${conflict.startTime}-${conflict.endTime})`,
      );
    }
    const org = await this.orgs.getDefault();
    const schedule = this.schedules.create({
      organizationId: org.id,
      classId,
      branchId: cls.branchId,
      roomId: input.roomId ?? null,
      teacherId: input.teacherId,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      recurrence: (input.recurrence as Schedule['recurrence']) ?? 'weekly',
      validFrom: input.validFrom,
      validTo: input.validTo ?? null,
    });
    return this.schedules.save(schedule);
  }

  async deleteSchedule(classId: string, scheduleId: string): Promise<void> {
    await this.getClassById(classId);
    const schedule = await this.schedules.findOne({ where: { id: scheduleId, classId } });
    if (!schedule) throw new NotFoundException('Không tìm thấy lịch học');
    await this.schedules.delete(schedule.id);
  }

  /** T039 — tìm lịch trùng: cùng teacher HOẶC room, cùng weekday, date-range và time-range giao nhau. */
  private async findConflict(c: {
    excludeScheduleId: string | null;
    teacherId: string;
    roomId: string | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    validFrom: string;
    validTo: string | null;
  }): Promise<{
    classCode: string;
    teacherName: string;
    roomId: string | null;
    roomCode: string | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  } | null> {
    const qb = this.schedules
      .createQueryBuilder('s')
      .select('s.id', 'id')
      .addSelect('s.room_id', 'room_id')
      .addSelect('s.day_of_week', 'day_of_week')
      .addSelect('s.start_time', 'start_time')
      .addSelect('s.end_time', 'end_time')
      .addSelect('c.code', 'class_code')
      .addSelect('u.full_name', 'teacher_name')
      .addSelect('r.code', 'room_code')
      .innerJoin('classes', 'c', 'c.id = s.class_id')
      .innerJoin('users', 'u', 'u.id = s.teacher_id')
      .leftJoin('rooms', 'r', 'r.id = s.room_id')
      .where('s.day_of_week = :day', { day: c.dayOfWeek })
      .andWhere(`s.start_time < :end AND s.end_time > :start`, { start: c.startTime, end: c.endTime })
      .andWhere(`s.valid_from <= COALESCE(:validTo, DATE '9999-12-31')`, { validTo: c.validTo })
      .andWhere(`COALESCE(s.valid_to, DATE '9999-12-31') >= :validFrom`, { validFrom: c.validFrom });
    if (c.roomId) {
      qb.andWhere('(s.teacher_id = :teacherId OR s.room_id = :roomId)', { teacherId: c.teacherId, roomId: c.roomId });
    } else {
      qb.andWhere('s.teacher_id = :teacherId', { teacherId: c.teacherId });
    }
    if (c.excludeScheduleId) qb.andWhere('s.id <> :exclude', { exclude: c.excludeScheduleId });
    const row = (await qb.limit(1).getRawOne()) as
      | { id: string; room_id: string | null; day_of_week: number; start_time: string; end_time: string; class_code: string; teacher_name: string; room_code: string | null }
      | undefined;
    if (!row) return null;
    return {
      classCode: row.class_code,
      teacherName: row.teacher_name,
      roomId: row.room_id,
      roomCode: row.room_code,
      dayOfWeek: row.day_of_week,
      startTime: row.start_time,
      endTime: row.end_time,
    };
  }

  // ================= SCOPE HELPERS =================

  private async assertBranch(branchId: string): Promise<void> {
    const allowed = this.scopeCtx.branchIds();
    if (allowed === null) return;
    if (!allowed.includes(branchId)) throw new ForbiddenException('Chi nhánh nằm ngoài phạm vi được cấp');
  }

  private async ensureDepartment(departmentId: string): Promise<void> {
    await this.departments.findOneByOrFail({ id: departmentId }).catch(() => {
      throw new BadRequestException('Ngành không tồn tại');
    });
  }
}
