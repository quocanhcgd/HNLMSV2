import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthedRequest } from '../auth/jwt-auth.guard';
import { RequirePermissions } from '../auth/authz.decorators';
import {
  CreateEnrollmentDto,
  CreateStudentDto,
  ListStudentsQueryDto,
  UpdateEnrollmentDto,
  UpdateStudentDto,
} from './students.dto';
import { StudentsService } from './students.service';

/**
 * T044–T046 — Students & Enrollment API (contract docs/05-api/api-spec.yaml §Students & Enrollment).
 * DEVIATION (thêm ngoài api-spec, ghi tasks-v2): PUT /students/:id, GET /students/:id,
 * GET /students/:id/enrollments, PUT /enrollments/:id (đổi status — trigger sync enrolled_count).
 * Phân quyền: 'user:read' cho đọc; 'enrollment:create' cho tạo/đổi ghi danh.
 */
@ApiTags('Students & Enrollment')
@Controller()
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get('/students')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Danh sách học viên (phân trang + tìm q + lọc branch)' })
  listStudents(@Query() q: ListStudentsQueryDto) {
    return this.students.listStudents({
      page: q.page ?? 1,
      pageSize: Math.min(q.page_size ?? 20, 100),
      q: q.q,
      branchId: q.branch_id,
    });
  }

  /** T053 — portal: hồ sơ + lớp đang ghi danh của tôi (khai báo TRƯỚC /students/:studentId). */
  @Get('/students/me')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Portal học viên: hồ sơ + các lớp đang ghi danh (kèm tiến độ)' })
  myPortal(@Req() req: AuthedRequest) {
    return this.students.myPortal(req.user.sub);
  }

  /** T054 — portal: chi tiết lớp của tôi (thông tin + giảng viên + lịch + học liệu + tiến độ). */
  @Get('/students/me/classes/:classId')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Portal học viên: chi tiết lớp đang ghi danh' })
  myClassDetail(@Param('classId') classId: string, @Req() req: AuthedRequest) {
    return this.students.myClassDetail(req.user.sub, classId);
  }

  @Post('/students')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Tạo hồ sơ học viên (branchId dùng kiểm tra scope)' })
  createStudent(@Body() dto: CreateStudentDto) {
    return this.students.createStudent(dto);
  }

  @Get('/students/:studentId')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Chi tiết học viên' })
  getStudent(@Param('studentId') id: string) {
    return this.students.getStudentById(id);
  }

  @Put('/students/:studentId')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Cập nhật hồ sơ học viên' })
  updateStudent(@Param('studentId') id: string, @Body() dto: UpdateStudentDto) {
    return this.students.updateStudent(id, dto);
  }

  @Get('/students/:studentId/enrollments')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Danh sách ghi danh của học viên (kèm class/program/course)' })
  listEnrollments(@Param('studentId') studentId: string) {
    return this.students.listEnrollmentsByStudent(studentId);
  }

  @Post('/enrollments')
  @RequirePermissions('enrollment:create')
  @ApiOperation({ summary: 'Ghi danh học viên vào lớp (409: trùng hoặc lớp đầy). DEVIATION: invoice=null (phase Finance)' })
  createEnrollment(@Body() dto: CreateEnrollmentDto, @Req() req: AuthedRequest) {
    return this.students.createEnrollment(dto, req.user.sub);
  }

  @Get('/enrollments/:enrollmentId')
  @RequirePermissions('user:read')
  @ApiOperation({ summary: 'Chi tiết ghi danh (bao gồm tiến độ)' })
  getEnrollment(@Param('enrollmentId') id: string) {
    return this.students.getEnrollmentById(id);
  }

  @Put('/enrollments/:enrollmentId')
  @RequirePermissions('enrollment:create')
  @ApiOperation({ summary: 'Đổi trạng thái ghi danh (trigger sync enrolled_count)' })
  updateEnrollment(@Param('enrollmentId') id: string, @Body() dto: UpdateEnrollmentDto) {
    return this.students.updateEnrollmentStatus(id, dto.status);
  }
}
