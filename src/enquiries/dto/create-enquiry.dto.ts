import { IsNotEmpty, IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnquiryDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'rahul.sharma@example.com' })
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ example: '+91 98765 43210' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'National Engineering College' })
  @IsOptional()
  @IsString()
  collegeOrInstitution?: string;

  @ApiPropertyOptional({ example: 'Full-Stack Web Development' })
  @IsOptional()
  @IsString()
  interestedCourse?: string;

  @ApiPropertyOptional({ example: 'Online Live', default: 'Online Live' })
  @IsOptional()
  @IsString()
  preferredLearningMode?: string;

  @ApiPropertyOptional({ example: 'I want to know about weekend batches and upcoming start dates.' })
  @IsOptional()
  @IsString()
  message?: string;
}

