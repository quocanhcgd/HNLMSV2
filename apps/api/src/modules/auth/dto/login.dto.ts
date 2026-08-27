import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@educenter.vn' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}
