import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/** PATCH /roles/{id} — sửa tên/mô tả (không đổi code hệ thống). */
export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Cố vấn học tập' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
