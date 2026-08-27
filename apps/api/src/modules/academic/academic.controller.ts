import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../auth/authz.decorators';
import { AcademicService } from './academic.service';
import {
  CreateClassDto,
  CreateCourseDto,
  CreateDepartmentDto,
  CreateProgramDto,
  CreateRoomDto,
  CreateScheduleDto,
  UpdateClassDto,
  UpdateCourseDto,
  UpdateDepartmentDto,
  UpdateProgramDto,
  UpdateRoomDto,
} from './academic.dto';

/**
 * T040 — Academic CRUD API (contract docs/05-api/api-spec.yaml — Academic).
 * Phân quyền: program:read/create/update (ngành/chương trình/khóa học), class:read/create/update
 * (lớp + phòng), schedule:manage (lịch học). Branch scope: classes/rooms lọc theo branch được cấp (T034+B).
 */
@ApiTags('Academic')
@Controller()
export class AcademicController {
  constructor(private readonly academic: AcademicService) {}

  // ===== Departments =====
  @Get('/departments')
  @RequirePermissions('program:read')
  @ApiOperation({ summary: 'Danh sách ngành' })
  listDepartments() {
    return this.academic.listDepartments();
  }

  @Post('/departments')
  @RequirePermissions('program:create')
  @ApiOperation({ summary: 'Tạo ngành' })
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.academic.createDepartment(dto);
  }

  @Put('/departments/:departmentId')
  @RequirePermissions('program:update')
  @ApiOperation({ summary: 'Cập nhật ngành' })
  updateDepartment(@Param('departmentId') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.academic.updateDepartment(id, dto);
  }

  // ===== Programs =====
  @Get('/programs')
  @RequirePermissions('program:read')
  @ApiOperation({ summary: 'Danh sách chương trình (lọc department_id/status)' })
  listPrograms(@Query('department_id') departmentId?: string, @Query('status') status?: string) {
    return this.academic.listPrograms({ departmentId, status });
  }

  @Post('/programs')
  @RequirePermissions('program:create')
  @ApiOperation({ summary: 'Tạo chương trình' })
  createProgram(@Body() dto: CreateProgramDto) {
    return this.academic.createProgram(dto);
  }

  @Put('/programs/:programId')
  @RequirePermissions('program:update')
  @ApiOperation({ summary: 'Cập nhật chương trình' })
  updateProgram(@Param('programId') id: string, @Body() dto: UpdateProgramDto) {
    return this.academic.updateProgram(id, dto);
  }

  // ===== Courses (DEVIATION: api-spec chưa có /courses — bổ sung theo DDL §6) =====
  @Get('/courses')
  @RequirePermissions('program:read')
  @ApiOperation({ summary: 'Danh sách khóa học (lọc program_id/status)' })
  listCourses(@Query('program_id') programId?: string, @Query('status') status?: string) {
    return this.academic.listCourses({ programId, status });
  }

  @Post('/courses')
  @RequirePermissions('program:create')
  @ApiOperation({ summary: 'Tạo khóa học' })
  createCourse(@Body() dto: CreateCourseDto) {
    return this.academic.createCourse(dto);
  }

  @Put('/courses/:courseId')
  @RequirePermissions('program:update')
  @ApiOperation({ summary: 'Cập nhật khóa học' })
  updateCourse(@Param('courseId') id: string, @Body() dto: UpdateCourseDto) {
    return this.academic.updateCourse(id, dto);
  }

  // ===== Rooms =====
  @Get('/rooms')
  @RequirePermissions('class:read')
  @ApiOperation({ summary: 'Danh sách phòng học (branch scope)' })
  listRooms() {
    return this.academic.listRooms();
  }

  @Post('/rooms')
  @RequirePermissions('schedule:manage')
  @ApiOperation({ summary: 'Tạo phòng học' })
  createRoom(@Body() dto: CreateRoomDto) {
    return this.academic.createRoom(dto);
  }

  @Put('/rooms/:roomId')
  @RequirePermissions('schedule:manage')
  @ApiOperation({ summary: 'Cập nhật phòng học' })
  updateRoom(@Param('roomId') id: string, @Body() dto: UpdateRoomDto) {
    return this.academic.updateRoom(id, dto);
  }

  // ===== Classes =====
  @Get('/classes')
  @RequirePermissions('class:read')
  @ApiOperation({ summary: 'Danh sách lớp (lọc branch_id/program_id/status + branch scope)' })
  listClasses(@Query('branch_id') branchId?: string, @Query('program_id') programId?: string, @Query('status') status?: string) {
    return this.academic.listClasses({ branchId, programId, status });
  }

  @Post('/classes')
  @RequirePermissions('class:create')
  @ApiOperation({ summary: 'Tạo lớp học' })
  createClass(@Body() dto: CreateClassDto) {
    return this.academic.createClass(dto);
  }

  @Get('/classes/:classId')
  @RequirePermissions('class:read')
  @ApiOperation({ summary: 'Chi tiết lớp (kèm giảng viên)' })
  async getClass(@Param('classId') id: string) {
    const cls = await this.academic.getClassById(id);
    const teachers = await this.academic.listTeachers(id);
    return { ...cls, teachers };
  }

  @Put('/classes/:classId')
  @RequirePermissions('class:update')
  @ApiOperation({ summary: 'Cập nhật lớp' })
  updateClass(@Param('classId') id: string, @Body() dto: UpdateClassDto) {
    return this.academic.updateClass(id, dto);
  }

  // ===== Schedules (T039 — chống trùng lịch) =====
  @Get('/classes/:classId/schedules')
  @RequirePermissions('class:read')
  @ApiOperation({ summary: 'Lịch học của lớp' })
  listSchedules(@Param('classId') classId: string) {
    return this.academic.listSchedules(classId);
  }

  @Post('/classes/:classId/schedules')
  @RequirePermissions('schedule:manage')
  @ApiOperation({ summary: 'Tạo lịch học (409 nếu trùng teacher/room/time)' })
  createSchedule(@Param('classId') classId: string, @Body() dto: CreateScheduleDto) {
    return this.academic.createSchedule(classId, dto);
  }

  @Delete('/classes/:classId/schedules/:scheduleId')
  @RequirePermissions('schedule:manage')
  @ApiOperation({ summary: 'Xóa lịch học' })
  deleteSchedule(@Param('classId') classId: string, @Param('scheduleId') scheduleId: string) {
    return this.academic.deleteSchedule(classId, scheduleId);
  }
}
