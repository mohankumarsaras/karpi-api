import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { QueryCourseDto } from './dto/query-course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List all published courses with optional filtering and search' })
  findAll(@Query() query: QueryCourseDto) {
    return this.coursesService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all active course categories' })
  getCategories() {
    return this.coursesService.getCategories();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get single course details by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Get(':slug/related')
  @ApiOperation({ summary: 'Get related courses for a given course slug' })
  getRelated(@Param('slug') slug: string, @Query('categoryId') categoryId?: string) {
    return this.coursesService.getRelatedCourses(slug, categoryId);
  }
}

