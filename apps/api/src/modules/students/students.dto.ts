import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

/** DTO Students & Enrollment (T044–T046) — contract docs/05-api/api-spec.yaml §Students & Enrollment. */

export class CreateStudentDto {
  @ApiProperty({ example: 'SV2026-001' })
  @IsString() @MinLength(1) @MaxLength(50)
  studentCode!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString() @MinLength(2) @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional() @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'male' })
  @IsOptional() @IsString() @MaxLength(20)
  gender?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(30)
  guardianPhone?: string;

  @ApiPropertyOptional({ example: '001202012345' })
  @IsOptional() @IsString() @MaxLength(100)
  identityRef?: string;

  @ApiPropertyOptional({ description: 'Chi nhánh thao tác — kiểm tra scope, không lưu (students không có cột branch)' })
  @IsOptional() @IsUUID('4')
  branchId?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  notes?: string;
}

export class UpdateStudentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255)
  fullName?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional() @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20)
  gender?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(30)
  guardianPhone?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100)
  identityRef?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'graduated', 'dropped'] })
  @IsOptional() @IsIn(['active', 'inactive', 'graduated', 'dropped'])
  status?: 'active' | 'inactive' | 'graduated' | 'dropped';

  @ApiPropertyOptional() @IsOptional() @IsString()
  notes?: string;
}

export class CreateEnrollmentDto {
  @ApiProperty() @IsUUID('4')
  studentId!: string;

  @ApiProperty() @IsUUID('4')
  classId!: string;
}

export class UpdateEnrollmentDto {
  @ApiProperty({ enum: ['pending_payment', 'active', 'completed', 'dropped', 'suspended', 'waitlist'] })
  @IsIn(['pending_payment', 'active', 'completed', 'dropped', 'suspended', 'waitlist'])
  status!: 'pending_payment' | 'active' | 'completed' | 'dropped' | 'suspended' | 'waitlist';
}

export class ListStudentsQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, maximum: 100 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page_size?: number;

  @ApiPropertyOptional({ description: 'Tìm theo tên/mã học viên' })
  @IsOptional() @IsString() @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional() @IsUUID('4')
  branch_id?: string;
}
