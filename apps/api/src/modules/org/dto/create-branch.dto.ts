import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

/** POST /organization/branches — tạo chi nhánh (api-spec: code, name bắt buộc). */
export class CreateBranchDto {
  @ApiProperty({ example: 'HN1' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Cơ sở Hà Nội 1' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'Số 1 Tràng Tiền, Hoàn Kiếm' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  managerUserId?: string;
}
