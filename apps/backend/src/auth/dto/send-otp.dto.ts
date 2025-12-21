import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ example: '09123456789', description: 'شماره موبایل' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^09\d{9}$|^9\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
  phone: string;
}

