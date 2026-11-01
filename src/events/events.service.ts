import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './event.entity';
import { QueryEventDto } from './dto/query-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findAll(query: QueryEventDto): Promise<Event[]> {
    const qb = this.eventRepository.createQueryBuilder('event');

    if (query.type) {
      qb.andWhere('event.type = :type', { type: query.type });
    }

    if (query.mode) {
      qb.andWhere('event.mode = :mode', { mode: query.mode });
    }

    if (query.status) {
      qb.andWhere('event.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere('(LOWER(event.title) LIKE :search OR LOWER(event.description) LIKE :search)', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    qb.orderBy('event.eventDate', 'ASC');
    return qb.getMany();
  }

  async findUpcoming(): Promise<Event[]> {
    return this.eventRepository.find({
      where: [{ status: EventStatus.UPCOMING }, { status: EventStatus.ONGOING }],
      order: { eventDate: 'ASC' },
      take: 6,
    });
  }

  async findBySlug(slug: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { slug } });
    if (!event) {
      throw new NotFoundException(`Event '${slug}' not found`);
    }
    return event;
  }
}

