import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '09123456789', description: 'شماره موبایل' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^09\d{9}$|^9\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
  phone: string;

  @ApiProperty({ example: '123456', description: 'کد تایید 6 رقمی' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'کد تایید باید 6 رقم باشد' })
  code: string;
}

