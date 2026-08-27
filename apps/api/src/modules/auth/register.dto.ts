import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'hocvien@educenter.vn' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'matkhau123', minLength: 8, maxLength: 72 })
  @IsString()
  @MinLength(8)
  @MaxLength(72) // giới hạn 72 bytes của bcrypt
  password!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional({ example: 'Student', enum: ['Student', 'Teacher', 'Admin'] })
  @IsOptional()
  @IsIn(['Student', 'Teacher', 'Admin'])
  role?: 'Student' | 'Teacher' | 'Admin';
}
