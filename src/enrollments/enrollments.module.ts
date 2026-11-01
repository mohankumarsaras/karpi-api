import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEnrollment } from './course-enrollment.entity';
import { ProgramEnrollment } from './program-enrollment.entity';
import { EventRegistration } from './event-registration.entity';
import { Course } from '../courses/course.entity';
import { Program } from '../programs/program.entity';
import { Event } from '../events/event.entity';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEnrollment,
      ProgramEnrollment,
      EventRegistration,
      Course,
      Program,
      Event,
    ]),
  ],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
