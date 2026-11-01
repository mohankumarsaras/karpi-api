import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { PartnerReviewsService } from './partner-reviews.service';
import { CreatePartnerReviewDto, UpdatePartnerReviewDto } from './dto/partner-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('partner-reviews')
export class PartnerReviewsController {
  constructor(private readonly service: PartnerReviewsService) {}

  @Get()
  async getPublicReviews() {
    return this.service.findAll(true);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR)
  @Get('admin/all')
  async getAllReviews() {
    return this.service.findAll(false);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR)
  @Post()
  async create(@Body() dto: CreatePartnerReviewDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePartnerReviewDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TUTOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

