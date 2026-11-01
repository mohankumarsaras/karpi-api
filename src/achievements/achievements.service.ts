import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './achievement.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {}

  async findAll(): Promise<Achievement[]> {
    return this.achievementRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }
}

