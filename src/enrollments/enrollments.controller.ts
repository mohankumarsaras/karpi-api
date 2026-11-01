import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CancelEnrollmentDto, UpdateEnrollmentStatusDto } from './dto/enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';
import { EnrollmentStatus } from './course-enrollment.entity';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // ─── ROOKIE ENROLLMENT ENDPOINTS ────────────────────────────────────────

  @Roles(UserRole.ROOKIE)
  @Post('courses/:courseId')
  async enrollCourse(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.enrollCourse(user.userId, courseId);
  }

  @Roles(UserRole.ROOKIE)
  @Post('programs/:programId')
  async enrollProgram(
    @CurrentUser() user: any,
    @Param('programId') programId: string,
  ) {
    return this.enrollmentsService.enrollProgram(user.userId, programId);
  }

  @Roles(UserRole.ROOKIE)
  @Post('events/:eventId')
  async registerEvent(
    @CurrentUser() user: any,
    @Param('eventId') eventId: string,
  ) {
    return this.enrollmentsService.registerEvent(user.userId, eventId);
  }

  @Roles(UserRole.ROOKIE)
  @Get('my')
  async getMyEnrollments(@CurrentUser() user: any) {
    return this.enrollmentsService.getMyEnrollments(user.userId);
  }

  @Roles(UserRole.ROOKIE)
  @Post('courses/:id/cancel')
  async cancelCourseEnrollment(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CancelEnrollmentDto,
  ) {
    return this.enrollmentsService.cancelCourseEnrollment(user.userId, id, dto.reason);
  }

  @Roles(UserRole.ROOKIE)
  @Post('programs/:id/cancel')
  async cancelProgramEnrollment(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CancelEnrollmentDto,
  ) {
    return this.enrollmentsService.cancelProgramEnrollment(user.userId, id, dto.reason);
  }

  @Roles(UserRole.ROOKIE)
  @Post('events/:id/cancel')
  async cancelEventRegistration(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CancelEnrollmentDto,
  ) {
    return this.enrollmentsService.cancelEventRegistration(user.userId, id, dto.reason);
  }

  // ─── TUTOR CORPORATE ENDPOINTS ──────────────────────────────────────────

  @Roles(UserRole.TUTOR)
  @Get('all')
  async getAllEnrollments() {
    return this.enrollmentsService.getAllEnrollments();
  }

  @Roles(UserRole.TUTOR)
  @Patch(':type/:id/status')
  async updateStatus(
    @Param('type') type: 'course' | 'program' | 'event',
    @Param('id') id: string,
    @Body() dto: UpdateEnrollmentStatusDto,
  ) {
    return this.enrollmentsService.updateEnrollmentStatus(type, id, dto.status as EnrollmentStatus);
  }
}

