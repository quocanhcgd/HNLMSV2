import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolClass } from '../academic/class.entity';
import { OrgModule } from '../org/org.module';
import { ScopesModule } from '../scopes/scopes.module';
import { EnrollmentProgress } from './enrollment-progress.entity';
import { Enrollment } from './enrollment.entity';
import { Student } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

/** T044–T046 — Students & Enrollment. */
@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Enrollment, EnrollmentProgress, SchoolClass]),
    OrgModule,
    ScopesModule,
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
