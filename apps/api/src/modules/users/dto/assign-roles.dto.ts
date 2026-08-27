import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

/** PUT /users/{id}/roles — gán (thay thế) danh sách vai trò theo code. */
export class AssignRolesDto {
  @ApiProperty({ example: ['teacher', 'finance_officer'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roleCodes!: string[];
}
