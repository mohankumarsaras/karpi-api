import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePartnerReviewDto {
  @IsNotEmpty()
  @IsString()
  partnerName: string;

  @IsOptional()
  @IsString()
  partnerLogo?: string;

  @IsNotEmpty()
  @IsString()
  reviewerName: string;

  @IsNotEmpty()
  @IsString()
  reviewerDesignation: string;

  @IsNotEmpty()
  @IsString()
  reviewContent: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

export class UpdatePartnerReviewDto {
  @IsOptional()
  @IsString()
  partnerName?: string;

  @IsOptional()
  @IsString()
  partnerLogo?: string;

  @IsOptional()
  @IsString()
  reviewerName?: string;

  @IsOptional()
  @IsString()
  reviewerDesignation?: string;

  @IsOptional()
  @IsString()
  reviewContent?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

