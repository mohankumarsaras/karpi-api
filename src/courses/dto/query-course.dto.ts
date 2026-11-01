import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SkillLevel, LearningMode } from '../course.entity';

export class QueryCourseDto {
  @ApiPropertyOptional({ description: 'Filter by category slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: SkillLevel, description: 'Filter by skill level' })
  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @ApiPropertyOptional({ enum: LearningMode, description: 'Filter by learning mode' })
  @IsOptional()
  @IsEnum(LearningMode)
  mode?: LearningMode;

  @ApiPropertyOptional({ description: 'Search term for title and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter featured courses only', example: 'true' })
  @IsOptional()
  @IsString()
  featured?: string;
}

