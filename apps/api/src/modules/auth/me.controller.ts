import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequirePermissions } from './authz.decorators';
import type { AuthedRequest } from './jwt-auth.guard';

/**
 * GET /me/context — thông tin user + roles + scopes + module states cho UI.
 * (docs/05-api/api-spec.md — endpoint /me/context.)
 * Bảo vệ bởi global JwtAuthGuard + AuthzGuard (T018).
 */
@ApiTags('auth')
@ApiBearerAuth()
@RequirePermissions('auth:context')
@Controller('me')
export class MeController {
  constructor(private readonly auth: AuthService) {}

  @Get('context')
  @ApiOperation({ summary: 'Context đăng nhập: user, roles, scopes, permissions, module states' })
  context(@Req() req: AuthedRequest) {
    return this.auth.meContext(req.user.sub);
  }
}
