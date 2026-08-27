import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LicenseService } from '../license/license.service';
import { UsersService, type SafeUser } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './register.dto';
import type { JwtPayload } from './jwt-payload.interface';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * T017 — JWT authentication:
 *   - login: validate bcrypt → access token (15 phút) + refresh cookie (7 ngày)
 *   - refresh: cấp access mới từ refresh token
 *   - logout: xóa refresh cookie (revocation thật cần denylist/DB — giai đoạn sau)
 * Contract: docs/05-api/api-spec.md §1, §5.1.
 */
@Injectable()
export class AuthService {
  private readonly accessTtl: number;
  private readonly refreshTtl: number;

  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly license: LicenseService,
    config: ConfigService,
  ) {
    this.accessTtl = config.get<number>('jwt.accessTtlSeconds') ?? 900;
    this.refreshTtl = config.get<number>('jwt.refreshTtlSeconds') ?? 604800;
  }

  /** POST /auth/register — tạo user, băm mật khẩu bcrypt (T016). */
  async register(dto: RegisterDto): Promise<{ user: SafeUser }> {
    const user = await this.users.create({
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      role: dto.role ?? 'Student',
    });
    return { user };
  }

  /** POST /auth/login — kiểm tra bcrypt, phát token, ghi last_login. */
  async login(dto: LoginDto, ip?: string): Promise<{ user: SafeUser } & TokenPair> {
    const user = await this.users.validateCredentials(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    await this.users.markLastLogin(user.id, ip);
    const pair = await this.issueTokens(user);
    return { user, ...pair };
  }

  /** POST /auth/refresh — cấp access token mới từ refresh token. */
  async refresh(refreshToken: string | undefined): Promise<{ user: SafeUser } & TokenPair> {
    if (!refreshToken) {
      throw new UnauthorizedException('Thiếu refresh token');
    }
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc hết hạn');
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token không phải refresh token');
    }
    const user = await this.users.getByIdOrThrow(payload.sub);
    const pair = await this.issueTokens(user);
    return { user, ...pair };
  }

  /** GET /me/context — user + roles + permissions + scopes + modules (cho UI, api-spec).
   *  T035: roles/permissions/scopes đọc THẬT từ bảng RBAC (user_roles, role_permissions,
   *  scope_grants); fallback legacy [user.role] nếu user chưa có role trong user_roles.
   *  B: dùng effectiveRbac (dùng chung với AuthzGuard) → /me/context và guard luôn khớp. */
  async meContext(sub: string): Promise<{
    user: SafeUser;
    roles: string[];
    permissions: string[];
    scopes: { branches: string[]; classes: string[]; students: string[] };
    modules: Awaited<ReturnType<LicenseService['getModules']>>;
  }> {
    const user = await this.users.getByIdOrThrow(sub);
    const modules = await this.license.getModules();
    const { roles, permissions } = await this.users.effectiveRbac(sub, user.role);
    const scopes = await this.users.activeScopes(sub);
    return { user, roles, permissions, scopes, modules };
  }

  private async issueTokens(user: SafeUser): Promise<TokenPair> {
    const base: Omit<JwtPayload, 'type'> = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwt.signAsync({ ...base, type: 'access' } satisfies JwtPayload, {
      expiresIn: this.accessTtl,
    });
    const refreshToken = await this.jwt.signAsync({ ...base, type: 'refresh' } satisfies JwtPayload, {
      expiresIn: this.refreshTtl,
    });
    return { accessToken, refreshToken, expiresIn: this.accessTtl };
  }
}
