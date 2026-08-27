import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrgModule } from '../org/org.module';
import { ScopesModule } from '../scopes/scopes.module';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';
import { ClassTeacher } from './class-teacher.entity';
import { SchoolClass } from './class.entity';
import { Course } from './course.entity';
import { Department } from './department.entity';
import { Program } from './program.entity';
import { Room } from './room.entity';
import { Schedule } from './schedule.entity';

/** T038+T039+T040 — Academic Core (MVP). */
@Module({
  imports: [TypeOrmModule.forFeature([Department, Program, Course, Room, SchoolClass, ClassTeacher, Schedule]), OrgModule, ScopesModule],
  controllers: [AcademicController],
  providers: [AcademicService],
})
export class AcademicModule {}
