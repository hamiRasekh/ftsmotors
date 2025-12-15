import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty({ example: 'سلام، سوالی دارم' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;
}

