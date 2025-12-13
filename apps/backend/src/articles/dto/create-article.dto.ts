import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  seoKeywords?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  publishedAt?: Date;
}

