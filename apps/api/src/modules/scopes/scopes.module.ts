import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../users/role.entity';
import { ScopeGrant } from '../users/scope-grant.entity';
import { UserRole } from '../users/user-role.entity';
import { ScopeContextService } from './scope-context.service';
import { ScopeContextInterceptor } from './scope-context.interceptor';
import { ScopesService } from './scopes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScopeGrant, UserRole, Role])],
  providers: [ScopesService, ScopeContextService, ScopeContextInterceptor],
  exports: [ScopesService, ScopeContextService],
})
export class ScopesModule {}
