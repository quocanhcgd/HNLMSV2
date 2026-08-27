import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolClass } from '../academic/class.entity';
import { OrgModule } from '../org/org.module';
import { ScopesModule } from '../scopes/scopes.module';
import { UsersModule } from '../users/users.module';
import { ContentClassLink } from './content-class-link.entity';
import { ContentVersion } from './content-version.entity';
import { LearningContent } from './learning-content.entity';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';

/** T049–T051 — Learning & Content (upload local + authorization theo scope). */
@Module({
  imports: [
    TypeOrmModule.forFeature([LearningContent, ContentVersion, ContentClassLink, SchoolClass]),
    OrgModule,
    ScopesModule,
    UsersModule,
  ],
  controllers: [LearningController],
  providers: [LearningService],
})
export class LearningModule {}
