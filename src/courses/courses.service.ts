import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Category } from './category.entity';
import { QueryCourseDto } from './dto/query-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(query: QueryCourseDto): Promise<Course[]> {
    const qb = this.courseRepository.createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .where('course.isPublished = :isPublished', { isPublished: true });

    if (query.category) {
      qb.andWhere('category.slug = :categorySlug', { categorySlug: query.category });
    }

    if (query.level) {
      qb.andWhere('course.level = :level', { level: query.level });
    }

    if (query.mode) {
      qb.andWhere('course.mode = :mode', { mode: query.mode });
    }

    if (query.featured === 'true') {
      qb.andWhere('course.isFeatured = :isFeatured', { isFeatured: true });
    }

    if (query.search) {
      qb.andWhere('(LOWER(course.title) LIKE :search OR LOWER(course.shortDescription) LIKE :search)', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    qb.orderBy('course.createdAt', 'DESC');
    return qb.getMany();
  }

  async findBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { slug, isPublished: true },
      relations: ['category'],
    });

    if (!course) {
      throw new NotFoundException(`Course with slug '${slug}' not found`);
    }

    return course;
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
      relations: ['courses'],
    });
  }

  async getRelatedCourses(currentSlug: string, categoryId?: string, limit = 3): Promise<Course[]> {
    const qb = this.courseRepository.createQueryBuilder('course')
      .leftJoinAndSelect('course.category', 'category')
      .where('course.slug != :currentSlug', { currentSlug })
      .andWhere('course.isPublished = :isPublished', { isPublished: true });

    if (categoryId) {
      qb.andWhere('course.categoryId = :categoryId', { categoryId });
    }

    return qb.take(limit).getMany();
  }
}

