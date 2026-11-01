import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { CourseEnrollment } from '../enrollments/course-enrollment.entity';
import { ProgramEnrollment } from '../enrollments/program-enrollment.entity';
import { EventRegistration } from '../enrollments/event-registration.entity';

@Injectable()
export class RookiesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollmentRepo: Repository<CourseEnrollment>,
    @InjectRepository(ProgramEnrollment)
    private readonly programEnrollmentRepo: Repository<ProgramEnrollment>,
    @InjectRepository(EventRegistration)
    private readonly eventRegistrationRepo: Repository<EventRegistration>,
  ) {}

  async findAll(search?: string, status?: string) {
    const qb = this.userRepo.createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.ROOKIE });

    if (search) {
      qb.andWhere('(user.fullName LIKE :s OR user.email LIKE :s OR user.collegeName LIKE :s)', {
        s: `%${search}%`,
      });
    }

    if (status === 'active') {
      qb.andWhere('user.isActive = true');
    } else if (status === 'suspended') {
      qb.andWhere('user.isActive = false');
    }

    qb.orderBy('user.createdAt', 'DESC');
    const users = await qb.getMany();

    // Attach enrollment counts
    const result = await Promise.all(
      users.map(async (u) => {
        const [courseCount, programCount, eventCount] = await Promise.all([
          this.courseEnrollmentRepo.count({ where: { userId: u.id } }),
          this.programEnrollmentRepo.count({ where: { userId: u.id } }),
          this.eventRegistrationRepo.count({ where: { userId: u.id } }),
        ]);
        const { passwordHash, ...safe } = u;
        return {
          ...safe,
          enrollmentsCount: courseCount + programCount + eventCount,
          courseCount,
          programCount,
          eventCount,
        };
      }),
    );

    return result;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id, role: UserRole.ROOKIE } });
    if (!user) throw new NotFoundException('Rookie not found');

    const [courses, programs, events] = await Promise.all([
      this.courseEnrollmentRepo.find({ where: { userId: id }, relations: ['course'] }),
      this.programEnrollmentRepo.find({ where: { userId: id }, relations: ['program'] }),
      this.eventRegistrationRepo.find({ where: { userId: id }, relations: ['event'] }),
    ]);

    const { passwordHash, ...safe } = user;
    return {
      ...safe,
      courses,
      programs,
      events,
    };
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await this.userRepo.findOne({ where: { id, role: UserRole.ROOKIE } });
    if (!user) throw new NotFoundException('Rookie not found');
    user.isActive = isActive;
    await this.userRepo.save(user);
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async updateMyProfile(userId: string, data: { phoneNumber?: string; collegeName?: string }) {
    const user = await this.userRepo.findOne({ where: { id: userId, role: UserRole.ROOKIE } });
    if (!user) throw new NotFoundException('User not found');
    if (data.phoneNumber !== undefined) user.phoneNumber = data.phoneNumber;
    if (data.collegeName !== undefined) user.collegeName = data.collegeName;
    await this.userRepo.save(user);
    const { passwordHash, ...safe } = user;
    return safe;
  }
}

