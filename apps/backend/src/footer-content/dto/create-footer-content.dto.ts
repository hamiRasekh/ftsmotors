import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LinkDto {
  @IsString()
  href: string;

  @IsString()
  label: string;
}

export class CreateFooterContentDto {
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  logoAlt?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  @IsOptional()
  quickLinks?: LinkDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  @IsOptional()
  infoLinks?: LinkDto[];

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsOptional()
  phones?: string[];

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  copyrightText?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

