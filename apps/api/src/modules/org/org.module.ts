import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { BranchesService } from './branches.service';
import { Organization } from './organization.entity';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Branch])],
  controllers: [OrganizationController],
  providers: [OrganizationService, BranchesService],
  exports: [OrganizationService, BranchesService],
})
export class OrgModule {}
