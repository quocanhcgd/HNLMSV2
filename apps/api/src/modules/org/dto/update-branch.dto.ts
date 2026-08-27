import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/** PUT /organization/branches/{id} — cập nhật chi nhánh (api-spec). */
export class UpdateBranchDto {
  @ApiPropertyOptional({ example: 'Cơ sở Hà Nội 2' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  managerUserId?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  // ---- T030/T031 mở rộng ----
  @ApiPropertyOptional({ example: '02438223344' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'hn1@educenter.vn' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: '1900 633 055' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  hotline?: string;

  @ApiPropertyOptional({ example: '0101234567' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxCode?: string;

  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  representativeName?: string;

  @ApiPropertyOptional({ example: '2026-09-01', format: 'date' })
  @IsOptional()
  @IsDateString()
  openedAt?: string;

  @ApiPropertyOptional({ example: '2027-08-31', format: 'date' })
  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @ApiPropertyOptional({ example: 'Cơ sở trọng điểm đào tạo tiếng Anh khu vực miền Bắc' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  note?: string;
}
