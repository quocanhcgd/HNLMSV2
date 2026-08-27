import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import type { JwtPayload } from './jwt-payload.interface';

export type AuthedRequest = Request & { user: JwtPayload };

/**
 * JwtAuthGuard (global, SEC-006) — xác thực `Authorization: Bearer <accessToken>`.
 * Endpoint đánh dấu @Public() được bỏ qua.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

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
