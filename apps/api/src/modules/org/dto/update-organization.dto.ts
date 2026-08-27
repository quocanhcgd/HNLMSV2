import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

/** PUT /organization — cập nhật cấu hình tổ chức (api-spec). */
export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'EduCenter LMS' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'Asia/Ho_Chi_Minh' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;

  @ApiPropertyOptional({ example: '2026-2027' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  academicPeriod?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  brandSettings?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  contactSettings?: Record<string, unknown>;
}
