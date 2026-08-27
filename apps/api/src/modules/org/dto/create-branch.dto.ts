import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

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

  @ApiPropertyOptional({ example: 'Cơ sở trọng điểm đào tạo tiếng Anh khu vực miền Bắc' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  note?: string;
}
