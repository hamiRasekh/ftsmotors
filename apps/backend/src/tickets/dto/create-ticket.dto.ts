import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 'مشکل در خرید خودرو' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'در هنگام خرید خودرو با خطا مواجه شدم...' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}

