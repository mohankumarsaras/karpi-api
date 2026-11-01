import { IsNotEmpty, IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Priya Sundaram' })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ example: 'priya.s@example.com' })
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiPropertyOptional({ example: '+91 99887 76655' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'College Seminar Request' })
  @IsNotEmpty({ message: 'Subject is required' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'We would like to organize a 2-day technical seminar on Cloud Computing at our college campus.' })
  @IsNotEmpty({ message: 'Message content is required' })
  @IsString()
  message: string;
}

