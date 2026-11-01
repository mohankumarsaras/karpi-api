import { Controller, Get, UseGuards } from '@nestjs/common';
import { TutorDashboardService } from './tutor-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('tutor/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TutorDashboardController {
  constructor(private readonly dashboardService: TutorDashboardService) {}

  @Roles(UserRole.TUTOR)
  @Get('overview')
  async getOverview() {
    return this.dashboardService.getOverview();
  }
}

