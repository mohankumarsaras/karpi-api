import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerReview } from './partner-review.entity';
import { PartnerReviewsService } from './partner-reviews.service';
import { PartnerReviewsController } from './partner-reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerReview])],
  providers: [PartnerReviewsService],
  controllers: [PartnerReviewsController],
  exports: [PartnerReviewsService],
})
export class PartnerReviewsModule {}

