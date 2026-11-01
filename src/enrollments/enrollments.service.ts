import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseEnrollment, EnrollmentStatus } from './course-enrollment.entity';
import { ProgramEnrollment } from './program-enrollment.entity';
import { EventRegistration } from './event-registration.entity';
import { Course } from '../courses/course.entity';
import { Program } from '../programs/program.entity';
import { Event, EventStatus } from '../events/event.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollmentRepo: Repository<CourseEnrollment>,
    @InjectRepository(ProgramEnrollment)
    private readonly programEnrollmentRepo: Repository<ProgramEnrollment>,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepo: Repository<EventRegistration>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Program)
    private readonly programRepo: Repository<Program>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  // ─── ROOKIE ENROLLMENT ACTIONS ──────────────────────────────────────────

  async enrollCourse(userId: string, courseId: string) {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    if (!course.isPublished) {
      throw new BadRequestException('Course is currently not available for enrollment');
    }

    const existing = await this.courseEnrollmentRepo.findOne({
      where: { userId, courseId },
    });

    if (existing) {
      if (existing.status !== EnrollmentStatus.CANCELLED) {
        throw new ConflictException('You are already enrolled in this course');
      }
      existing.status = EnrollmentStatus.ACTIVE;
      existing.cancellationReason = undefined;
      existing.cancelledAt = undefined;
      return this.courseEnrollmentRepo.save(existing);
    }

    const enrollment = this.courseEnrollmentRepo.create({
      userId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
    });
    return this.courseEnrollmentRepo.save(enrollment);
  }

  async enrollProgram(userId: string, programId: string) {
    const program = await this.programRepo.findOne({ where: { id: programId } });
    if (!program) throw new NotFoundException('Program not found');
    if (!program.isActive) {
      throw new BadRequestException('Program is currently not available for enrollment');
    }

    const existing = await this.programEnrollmentRepo.findOne({
      where: { userId, programId },
    });

    if (existing) {
      if (existing.status !== EnrollmentStatus.CANCELLED) {
        throw new ConflictException('You are already enrolled in this program');
      }
      existing.status = EnrollmentStatus.ACTIVE;
      existing.cancellationReason = undefined;
      existing.cancelledAt = undefined;
      return this.programEnrollmentRepo.save(existing);
    }

    const enrollment = this.programEnrollmentRepo.create({
      userId,
      programId,
      status: EnrollmentStatus.ACTIVE,
    });
    return this.programEnrollmentRepo.save(enrollment);
  }

  async registerEvent(userId: string, eventId: string) {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.status === EventStatus.COMPLETED) {
      throw new BadRequestException('Event registrations are currently closed');
    }

    const existing = await this.eventRegistrationRepo.findOne({
      where: { userId, eventId },
    });

    if (existing) {
      if (existing.status !== EnrollmentStatus.CANCELLED) {
        throw new ConflictException('You are already registered for this event');
      }
      existing.status = EnrollmentStatus.CONFIRMED;
      existing.cancellationReason = undefined;
      existing.cancelledAt = undefined;
      return this.eventRegistrationRepo.save(existing);
    }

    const registration = this.eventRegistrationRepo.create({
      userId,
      eventId,
      status: EnrollmentStatus.CONFIRMED,
    });
    return this.eventRegistrationRepo.save(registration);
  }

  // ─── ROOKIE GET MY ENROLLMENTS ──────────────────────────────────────────

  async getMyEnrollments(userId: string) {
    const courses = await this.courseEnrollmentRepo.find({
      where: { userId },
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });

    const programs = await this.programEnrollmentRepo.find({
      where: { userId },
      relations: ['program'],
      order: { createdAt: 'DESC' },
    });

    const events = await this.eventRegistrationRepo.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });

    return {
      courses,
      programs,
      events,
    };
  }

  // ─── ROOKIE CANCEL ENROLLMENT ───────────────────────────────────────────

  async cancelCourseEnrollment(userId: string, enrollmentId: string, reason?: string) {
    const enrollment = await this.courseEnrollmentRepo.findOne({
      where: { id: enrollmentId, userId },
      relations: ['course'],
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.status === EnrollmentStatus.COMPLETED) {
      throw new BadRequestException('Completed courses cannot be cancelled');
    }
    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new BadRequestException('Enrollment is already cancelled');
    }

    enrollment.status = EnrollmentStatus.CANCELLED;
    enrollment.cancellationReason = reason || 'Cancelled by student';
    enrollment.cancelledAt = new Date();
    return this.courseEnrollmentRepo.save(enrollment);
  }

  async cancelProgramEnrollment(userId: string, enrollmentId: string, reason?: string) {
    const enrollment = await this.programEnrollmentRepo.findOne({
      where: { id: enrollmentId, userId },
      relations: ['program'],
    });

    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (enrollment.status === EnrollmentStatus.COMPLETED) {
      throw new BadRequestException('Completed programs cannot be cancelled');
    }
    if (enrollment.status === EnrollmentStatus.CANCELLED) {
      throw new BadRequestException('Enrollment is already cancelled');
    }

    enrollment.status = EnrollmentStatus.CANCELLED;
    enrollment.cancellationReason = reason || 'Cancelled by student';
    enrollment.cancelledAt = new Date();
    return this.programEnrollmentRepo.save(enrollment);
  }

  async cancelEventRegistration(userId: string, registrationId: string, reason?: string) {
    const registration = await this.eventRegistrationRepo.findOne({
      where: { id: registrationId, userId },
      relations: ['event'],
    });

    if (!registration) throw new NotFoundException('Registration not found');
    if (registration.status === EnrollmentStatus.COMPLETED) {
      throw new BadRequestException('Past events cannot be cancelled');
    }
    if (registration.status === EnrollmentStatus.CANCELLED) {
      throw new BadRequestException('Registration is already cancelled');
    }

    registration.status = EnrollmentStatus.CANCELLED;
    registration.cancellationReason = reason || 'Cancelled by student';
    registration.cancelledAt = new Date();
    return this.eventRegistrationRepo.save(registration);
  }

  // ─── TUTOR CORPORATE ENROLLMENT REVIEWS ──────────────────────────────────

  async getAllEnrollments() {
    const courses = await this.courseEnrollmentRepo.find({
      relations: ['user', 'course'],
      order: { createdAt: 'DESC' },
    });

    const programs = await this.programEnrollmentRepo.find({
      relations: ['user', 'program'],
      order: { createdAt: 'DESC' },
    });

    const events = await this.eventRegistrationRepo.find({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });

    return { courses, programs, events };
  }

  async updateEnrollmentStatus(
    type: 'course' | 'program' | 'event',
    id: string,
    status: EnrollmentStatus,
  ) {
    if (type === 'course') {
      const item = await this.courseEnrollmentRepo.findOne({ where: { id } });
      if (!item) throw new NotFoundException('Course enrollment not found');
      item.status = status;
      return this.courseEnrollmentRepo.save(item);
    } else if (type === 'program') {
      const item = await this.programEnrollmentRepo.findOne({ where: { id } });
      if (!item) throw new NotFoundException('Program enrollment not found');
      item.status = status;
      return this.programEnrollmentRepo.save(item);
    } else if (type === 'event') {
      const item = await this.eventRegistrationRepo.findOne({ where: { id } });
      if (!item) throw new NotFoundException('Event registration not found');
      item.status = status;
      return this.eventRegistrationRepo.save(item);
    }
    throw new BadRequestException('Invalid enrollment type');
  }
}
