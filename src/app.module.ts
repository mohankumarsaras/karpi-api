import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { ProgramsModule } from './programs/programs.module';
import { EventsModule } from './events/events.module';
import { GalleryModule } from './gallery/gallery.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { AchievementsModule } from './achievements/achievements.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { RookiesModule } from './rookies/rookies.module';
import { TutorDashboardModule } from './tutor-dashboard/tutor-dashboard.module';
import { PartnerReviewsModule } from './partner-reviews/partner-reviews.module';

import { Course } from './courses/course.entity';
import { Category } from './courses/category.entity';
import { Program } from './programs/program.entity';
import { Event } from './events/event.entity';
import { GalleryItem } from './gallery/gallery.entity';
import { Testimonial } from './testimonials/testimonial.entity';
import { Achievement } from './achievements/achievement.entity';
import { Enquiry } from './enquiries/enquiry.entity';
import { ContactMessage } from './contact/contact.entity';
import { User } from './users/user.entity';
import { CourseEnrollment } from './enrollments/course-enrollment.entity';
import { ProgramEnrollment } from './enrollments/program-enrollment.entity';
import { EventRegistration } from './enrollments/event-registration.entity';
import { PartnerReview } from './partner-reviews/partner-review.entity';
import { AuditLog } from './audit-logs/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 30,
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'root'),
        database: configService.get<string>('DB_NAME', 'karpi_db'),
        entities: [
          Course,
          Category,
          Program,
          Event,
          GalleryItem,
          Testimonial,
          Achievement,
          Enquiry,
          ContactMessage,
          User,
          CourseEnrollment,
          ProgramEnrollment,
          EventRegistration,
          PartnerReview,
          AuditLog,
        ],
        synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),
    AuthModule,
    EnrollmentsModule,
    RookiesModule,
    TutorDashboardModule,
    PartnerReviewsModule,
    HealthModule,
    CoursesModule,
    ProgramsModule,
    EventsModule,
    GalleryModule,
    TestimonialsModule,
    AchievementsModule,
    EnquiriesModule,
    ContactModule,
  ],
})
export class AppModule {}
