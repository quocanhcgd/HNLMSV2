import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard, type AuthedRequest } from './jwt-auth.guard';
import { Req } from '@nestjs/common';

/**
 * GET /me/context — thông tin user + roles + scopes + module states cho UI.
 * (docs/05-api/api-spec.md — endpoint /me/context.)
 */
@ApiTags('auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly auth: AuthService) {}

  @Get('context')
  @ApiOperation({ summary: 'Context đăng nhập: user, roles, scopes, permissions, module states' })
  context(@Req() req: AuthedRequest) {
    return this.auth.meContext(req.user.sub);
  }
}
