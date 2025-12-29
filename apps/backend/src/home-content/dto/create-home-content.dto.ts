import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateHomeContentDto {
  @IsString()
  tagline: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  backgroundImage?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  ctaText?: string;

  @IsString()
  @IsOptional()
  ctaLink?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

