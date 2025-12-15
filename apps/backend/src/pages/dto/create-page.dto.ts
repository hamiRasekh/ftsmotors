import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({ example: 'درباره ما' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'about-us' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: '<p>محتوای صفحه...</p>' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '/images/page.jpg', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 'درباره ما | FTS Motors', required: false })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({ example: 'توضیحات SEO', required: false })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({ example: 'کلمات کلیدی', required: false })
  @IsOptional()
  @IsString()
  seoKeywords?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

