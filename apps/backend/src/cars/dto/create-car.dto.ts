import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreateCarDto {
  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  features?: Record<string, any>;

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
}

