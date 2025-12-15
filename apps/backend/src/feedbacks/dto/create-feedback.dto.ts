import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsOptional, Min, Max, IsInt, MinLength } from 'class-validator';
import { FeedbackType } from '@prisma/client';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'SUGGESTION', enum: FeedbackType })
  @IsEnum(FeedbackType)
  type: FeedbackType;

  @ApiProperty({ example: 'پیشنهاد می‌کنم که...' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  message: string;

  @ApiProperty({ example: 5, required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}

