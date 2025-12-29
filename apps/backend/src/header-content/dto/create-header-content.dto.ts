import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NavItemDto {
  @IsString()
  href: string;

  @IsString()
  label: string;
}

export class CreateHeaderContentDto {
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  logoAlt?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  navItems: NavItemDto[];

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

