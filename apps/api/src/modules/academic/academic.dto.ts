import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

/** DTO Academic (T040) — contract docs/05-api/api-spec.yaml (Academic) + DDL §6. */

export class CreateDepartmentDto {
  @ApiProperty({ example: 'EN' })
  @IsString() @MinLength(1) @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Tiếng Anh' })
  @IsString() @MinLength(2) @MaxLength(255)
  name!: string;
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional() @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class CreateProgramDto {
  @ApiProperty() @IsUUID('4')
  departmentId!: string;

  @ApiProperty({ example: 'EN-MASTER' })
  @IsString() @MinLength(1) @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Tiếng Anh Giao tiếp Master' })
  @IsString() @MinLength(2) @MaxLength(255)
  name!: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  durationMonths?: number;
}

export class UpdateProgramDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255)
  name?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  durationMonths?: number;

  @ApiPropertyOptional({ enum: ['draft', 'active', 'archived'] })
  @IsOptional() @IsIn(['draft', 'active', 'archived'])
  status?: 'draft' | 'active' | 'archived';
}

export class CreateCourseDto {
  @ApiProperty() @IsUUID('4')
  programId!: string;

  @ApiProperty({ example: 'EN-M1' })
  @IsString() @MinLength(1) @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Ngữ pháp cơ bản' })
  @IsString() @MinLength(2) @MaxLength(255)
  name!: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  orderIndex?: number;
}

export class UpdateCourseDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255)
  name?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({ enum: ['draft', 'active', 'archived'] })
  @IsOptional() @IsIn(['draft', 'active', 'archived'])
  status?: 'draft' | 'active' | 'archived';
}

export class CreateRoomDto {
  @ApiProperty() @IsUUID('4')
  branchId!: string;

  @ApiProperty({ example: 'P101' })
  @IsString() @MinLength(1) @MaxLength(50)
  code!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  name?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  capacity?: number;
}

export class UpdateRoomDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  name?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional() @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class CreateClassDto {
  @ApiProperty() @IsUUID('4')
  branchId!: string;

  @ApiProperty() @IsUUID('4')
  programId!: string;

  @ApiProperty() @IsUUID('4')
  courseId!: string;

  @ApiProperty({ example: 'EN-M1-01' })
  @IsString() @MinLength(1) @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Lớp Anh văn M1 - Ca 1' })
  @IsString() @MinLength(2) @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ enum: ['offline', 'online', 'hybrid', 'flexible'] })
  @IsOptional() @IsIn(['offline', 'online', 'hybrid', 'flexible'])
  modality?: 'offline' | 'online' | 'hybrid' | 'flexible';

  @ApiPropertyOptional({ example: 20 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional() @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsUUID('4', { each: true })
  teacherIds?: string[];
}

export class UpdateClassDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ enum: ['offline', 'online', 'hybrid', 'flexible'] })
  @IsOptional() @IsIn(['offline', 'online', 'hybrid', 'flexible'])
  modality?: 'offline' | 'online' | 'hybrid' | 'flexible';

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  capacity?: number;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional() @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ['draft', 'open', 'closed', 'full', 'archived'] })
  @IsOptional() @IsIn(['draft', 'open', 'closed', 'full', 'archived'])
  enrollmentStatus?: 'draft' | 'open' | 'closed' | 'full' | 'archived';

  @ApiPropertyOptional({ enum: ['draft', 'active', 'archived'] })
  @IsOptional() @IsIn(['draft', 'active', 'archived'])
  status?: 'draft' | 'active' | 'archived';

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsUUID('4', { each: true })
  teacherIds?: string[];
}

export class CreateScheduleDto {
  @ApiProperty({ example: 2, description: '1=CN … 7=Thứ 7' })
  @Type(() => Number) @IsInt() @Min(1)
  dayOfWeek!: number;

  @ApiProperty({ example: '18:00' })
  @IsString()
  startTime!: string;

  @ApiProperty({ example: '19:30' })
  @IsString()
  endTime!: string;

  @ApiProperty() @IsUUID('4')
  teacherId!: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID('4')
  roomId?: string;

  @ApiPropertyOptional({ enum: ['weekly', 'biweekly', 'once'] })
  @IsOptional() @IsIn(['weekly', 'biweekly', 'once'])
  recurrence?: 'weekly' | 'biweekly' | 'once';

  @ApiProperty({ example: '2026-09-01', format: 'date' })
  @IsDateString()
  validFrom!: string;

  @ApiPropertyOptional({ example: '2027-08-31', format: 'date' })
  @IsOptional() @IsDateString()
  validTo?: string;
}
