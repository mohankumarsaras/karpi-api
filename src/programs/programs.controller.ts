import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all learning programs and initiatives' })
  findAll() {
    return this.programsService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get single program details' })
  findBySlug(@Param('slug') slug: string) {
    return this.programsService.findBySlug(slug);
  }
}

