import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTicketMessageDto {
  @ApiProperty({ example: 'این مشکل را بررسی کردم...' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}

