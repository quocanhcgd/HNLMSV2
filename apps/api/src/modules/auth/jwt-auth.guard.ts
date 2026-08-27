import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { JwtPayload } from './jwt-payload.interface';

export type AuthedRequest = Request & { user: JwtPayload };

/**
 * JwtAuthGuard — xác thực `Authorization: Bearer <accessToken>`.
 * (SEC-006: API endpoints validate JWT.) Guard role/permission là T018.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthedRequest>();
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException('Thiếu access token');
    }
    const token = header.slice('Bearer '.length);
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Access token không hợp lệ hoặc hết hạn');
    }
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Token không phải access token');
    }
    req.user = payload;
    return true;
  }
}
