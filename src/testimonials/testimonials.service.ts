import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './testimonial.entity';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
  ) {}

  async findAll(featuredOnly = false): Promise<Testimonial[]> {
    const where: any = {};
    if (featuredOnly) {
      where.isFeatured = true;
    }
    return this.testimonialRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }
}

