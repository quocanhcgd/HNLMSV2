import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Đăng ký tài khoản (băm mật khẩu bcrypt — T016)' })
  @ApiCreatedResponse({ description: 'Đã tạo user; JWT sẽ bổ sung ở T017' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }
}
