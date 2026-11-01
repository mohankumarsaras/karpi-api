import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryItem, GalleryCategory } from './gallery.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryItem)
    private readonly galleryRepository: Repository<GalleryItem>,
  ) {}

  async findAll(category?: GalleryCategory): Promise<GalleryItem[]> {
    const qb = this.galleryRepository.createQueryBuilder('item')
      .where('item.isPublished = :isPublished', { isPublished: true });

    if (category) {
      qb.andWhere('item.category = :category', { category });
    }

    qb.orderBy('item.eventDate', 'DESC');
    return qb.getMany();
  }
}

