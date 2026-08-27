import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolClass } from '../academic/class.entity';
import { Student } from '../students/student.entity';
import { OrgModule } from '../org/org.module';
import { ScopesModule } from '../scopes/scopes.module';
import { UsersModule } from '../users/users.module';
import { ContentClassLink } from './content-class-link.entity';
import { ContentProgress } from './content-progress.entity';
import { ContentVersion } from './content-version.entity';
import { LearningContent } from './learning-content.entity';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';

/** T049–T055 — Learning & Content (upload local + authorization + library + progress). */
@Module({
  imports: [
    TypeOrmModule.forFeature([LearningContent, ContentVersion, ContentClassLink, ContentProgress, SchoolClass, Student]),
    OrgModule,
    ScopesModule,
    UsersModule,
  ],
  controllers: [LearningController],
  providers: [LearningService],
})
export class LearningModule {}
