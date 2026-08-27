import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './register.dto';
import { Public } from './public.decorator';

const REFRESH_COOKIE = 'refresh_token';

@ApiTags('auth')
@Public() // login/register/refresh/logout công khai (T018)
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Đăng ký tài khoản (băm mật khẩu bcrypt — T016)' })
  @ApiCreatedResponse({ description: 'Đã tạo user' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập → access token + refresh cookie (HTTP-only, 7 ngày)' })
  @ApiOkResponse({ description: '{ user, accessToken, expiresIn }' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = (req as unknown as { ip?: string }).ip;
    const result = await this.auth.login(dto, ip);
    this.setRefreshCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, expiresIn: result.expiresIn };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Làm mới access token (refresh token trong cookie HTTP-only)' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookie = (req as unknown as { cookies?: Record<string, string> }).cookies?.[REFRESH_COOKIE];
    const result = await this.auth.refresh(cookie);
    this.setRefreshCookie(res, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, expiresIn: result.expiresIn };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng xuất — xóa refresh cookie (revocation thật: denylist giai đoạn sau)' })
  logout(@Res({ passthrough: true }) res: Response) {
    // clearCookie KHÔNG được kèm maxAge — nếu không Express giữ cookie 7 ngày với giá trị rỗng
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions());
    return { ok: true };
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE, token, this.cookieOptions(7 * 24 * 3600 * 1000));
  }

  private cookieOptions(maxAgeMs?: number): Record<string, unknown> {
    return {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      ...(maxAgeMs ? { maxAge: maxAgeMs } : {}),
    };
  }
}
