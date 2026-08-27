import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from './password.service';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { Role } from './role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { ScopeGrant } from './scope-grant.entity';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, RolePermission, UserRole, ScopeGrant])],
  controllers: [UsersController, RolesController],
  providers: [UsersService, RolesService, PasswordService],
  exports: [UsersService, RolesService, PasswordService],
})
export class UsersModule {}
