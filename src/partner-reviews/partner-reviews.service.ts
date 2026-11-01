import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerReview } from './partner-review.entity';
import { CreatePartnerReviewDto, UpdatePartnerReviewDto } from './dto/partner-review.dto';

@Injectable()
export class PartnerReviewsService {
  constructor(
    @InjectRepository(PartnerReview)
    private readonly repo: Repository<PartnerReview>,
  ) {}

  async findAll(publishedOnly = false) {
    const where = publishedOnly ? { isPublished: true } : {};
    return this.repo.find({
      where,
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const review = await this.repo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Partner review not found');
    return review;
  }

  async create(dto: CreatePartnerReviewDto) {
    const review = this.repo.create(dto);
    return this.repo.save(review);
  }

  async update(id: string, dto: UpdatePartnerReviewDto) {
    const review = await this.findOne(id);
    Object.assign(review, dto);
    return this.repo.save(review);
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    return this.repo.remove(review);
  }
}

