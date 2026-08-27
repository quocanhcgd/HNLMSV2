import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassTeacher } from '../academic/class-teacher.entity';
import { Room } from '../academic/room.entity';
import { Schedule } from '../academic/schedule.entity';
import { SchoolClass } from '../academic/class.entity';
import { ContentClassLink } from '../learning/content-class-link.entity';
import { ContentProgress } from '../learning/content-progress.entity';
import { LearningContent } from '../learning/learning-content.entity';
import { OrgModule } from '../org/org.module';
import { ScopesModule } from '../scopes/scopes.module';
import { UsersModule } from '../users/users.module';
import { EnrollmentProgress } from './enrollment-progress.entity';
import { Enrollment } from './enrollment.entity';
import { Student } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

/** T044–T046 — Students & Enrollment. T053/T054 — portal học viên (lớp của tôi). */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Enrollment,
      EnrollmentProgress,
      SchoolClass,
      ClassTeacher,
      Schedule,
      Room,
      LearningContent,
      ContentClassLink,
      ContentProgress,
    ]),
    OrgModule,
    ScopesModule,
    UsersModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
