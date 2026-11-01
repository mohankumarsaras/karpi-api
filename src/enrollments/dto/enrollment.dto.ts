import { IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CancelEnrollmentDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateEnrollmentStatusDto {
  @IsString()
  status: string;
}

