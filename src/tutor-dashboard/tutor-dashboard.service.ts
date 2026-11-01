import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Program } from '../programs/program.entity';
import { Event } from '../events/event.entity';
import { CourseEnrollment } from '../enrollments/course-enrollment.entity';
import { ProgramEnrollment } from '../enrollments/program-enrollment.entity';
import { EventRegistration } from '../enrollments/event-registration.entity';

@Injectable()
export class TutorDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollmentRepo: Repository<CourseEnrollment>,
    @InjectRepository(ProgramEnrollment)
    private readonly programEnrollmentRepo: Repository<ProgramEnrollment>,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepo: Repository<EventRegistration>,
  ) {}

  async getOverview() {
    const [
      totalRookies,
      totalCourses,
      publishedCourses,
      totalPrograms,
      activePrograms,
      totalEvents,
      upcomingEvents,
      totalCourseEnrollments,
      totalProgramEnrollments,
      totalEventRegistrations,
    ] = await Promise.all([
      this.userRepo.count({ where: { role: UserRole.ROOKIE } }),
      this.courseRepo.count(),
      this.courseRepo.count({ where: { isPublished: true } }),
      this.programRepo.count(),
      this.programRepo.count({ where: { isActive: true } }),
      this.eventRepo.count(),
      this.eventRepo.count({ where: { status: 'Upcoming' as any } }),
      this.courseEnrollmentRepo.count(),
      this.programEnrollmentRepo.count(),
      this.eventRegistrationRepo.count(),
    ]);

    const recentCourseEnrollments = await this.courseEnrollmentRepo.find({
      relations: ['user', 'course'],
      order: { createdAt: 'DESC' },
      take: 6,
    });

    const recentProgramEnrollments = await this.programEnrollmentRepo.find({
      relations: ['user', 'program'],
      order: { createdAt: 'DESC' },
      take: 6,
    });

    const recentRegistrations = await this.eventRegistrationRepo.find({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
      take: 6,
    });

    return {
      metrics: {
        totalRookies,
        totalCourses,
        publishedCourses,
        totalPrograms,
        activePrograms,
        totalEvents,
        upcomingEvents,
        totalEnrollments: totalCourseEnrollments + totalProgramEnrollments + totalEventRegistrations,
        totalCourseEnrollments,
        totalProgramEnrollments,
        totalEventRegistrations,
      },
      recentActivity: {
        courses: recentCourseEnrollments,
        programs: recentProgramEnrollments,
        events: recentRegistrations,
      },
    };
  }
}
