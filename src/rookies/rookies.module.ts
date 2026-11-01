import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CourseEnrollment } from '../enrollments/course-enrollment.entity';
import { ProgramEnrollment } from '../enrollments/program-enrollment.entity';
import { EventRegistration } from '../enrollments/event-registration.entity';
import { RookiesService } from './rookies.service';
import { RookiesController } from './rookies.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CourseEnrollment,
      ProgramEnrollment,
      EventRegistration,
    ]),
  ],
  providers: [RookiesService],
  controllers: [RookiesController],
  exports: [RookiesService],
})
export class RookiesModule {}

