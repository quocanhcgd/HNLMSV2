import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

/** POST /users — tạo người dùng (docs/05-api/api-spec.yaml /users). */
export class CreateUserDto {
  @ApiProperty({ example: 'a.nguyen@edu.vn' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'matkhau123', minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional({ example: ['teacher', 'student'], description: 'Role codes (từ /roles)' })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roleCodes?: string[];

  @ApiPropertyOptional({ example: [] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  branchIds?: string[];
}
