import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './program.entity';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async findAll(): Promise<Program[]> {
    return this.programRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<Program> {
    const program = await this.programRepository.findOne({
      where: { slug, isActive: true },
    });
    if (!program) {
      throw new NotFoundException(`Program '${slug}' not found`);
    }
    return program;
  }
}

