import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GalleryService } from './gallery.service';
import { GalleryCategory } from './gallery.entity';

@ApiTags('gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @ApiOperation({ summary: 'List published gallery items with optional category filter' })
  @ApiQuery({ name: 'category', enum: GalleryCategory, required: false })
  findAll(@Query('category') category?: GalleryCategory) {
    return this.galleryService.findAll(category);
  }
}

