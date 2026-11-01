import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RookiesService } from './rookies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';

@Controller('rookies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RookiesController {
  constructor(private readonly rookiesService: RookiesService) {}

  @Roles(UserRole.TUTOR)
  @Get()
  async getRookies(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.rookiesService.findAll(search, status);
  }

  @Roles(UserRole.TUTOR)
  @Get(':id')
  async getRookie(@Param('id') id: string) {
    return this.rookiesService.findOne(id);
  }

  @Roles(UserRole.TUTOR)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.rookiesService.updateStatus(id, isActive);
  }

  @Roles(UserRole.ROOKIE)
  @Patch('me/profile')
  async updateMyProfile(
    @CurrentUser() user: any,
    @Body() body: { phoneNumber?: string; collegeName?: string },
  ) {
    return this.rookiesService.updateMyProfile(user.userId, body);
  }
}

