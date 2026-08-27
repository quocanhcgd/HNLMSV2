import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

/** PUT /roles/{id}/permissions — gán (thay thế) quyền cho vai trò. */
export class SetRolePermissionsDto {
  @ApiProperty({ example: ['user:read', 'user:create', 'report:export'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionKeys!: string[];
}
