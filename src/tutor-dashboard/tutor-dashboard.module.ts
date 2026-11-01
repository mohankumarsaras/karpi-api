import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Program } from '../programs/program.entity';
import { Event } from '../events/event.entity';
import { CourseEnrollment } from '../enrollments/course-enrollment.entity';
import { ProgramEnrollment } from '../enrollments/program-enrollment.entity';
import { EventRegistration } from '../enrollments/event-registration.entity';
import { TutorDashboardService } from './tutor-dashboard.service';
import { TutorDashboardController } from './tutor-dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Course,
      Program,
      Event,
      CourseEnrollment,
      ProgramEnrollment,
      EventRegistration,
    ]),
  ],
  providers: [TutorDashboardService],
  controllers: [TutorDashboardController],
  exports: [TutorDashboardService],
})
export class TutorDashboardModule {}
