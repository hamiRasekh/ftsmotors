import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly username: string;
  private readonly password: string;
  private readonly bodyId: number;
  // استفاده از متد BaseServiceNumber که فقط کد OTP را به عنوان ورودی می‌گیرد
  private readonly apiUrl = 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber';

  constructor(private configService: ConfigService) {
    this.username = this.configService.get<string>('MELIPAYAMAK_USERNAME') || '989123895285';
    // استفاده از password جدید که کاربر ارائه داده
    this.password = this.configService.get<string>('MELIPAYAMAK_PASSWORD') || 'be536d9b-339d-4deb-8cdb-27ce5493c79d';
    this.bodyId = parseInt(this.configService.get<string>('MELIPAYAMAK_BODY_ID') || '409528');
  }

  async sendOTP(phone: string, code: string): Promise<{ success: boolean; debug?: any; smsResponse?: any }> {
    try {
      // Format phone number (remove leading 0 if exists, ensure it starts with 98)
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '98' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('98')) {
        formattedPhone = '98' + formattedPhone;
      }

      // در این API فقط کد OTP به عنوان ورودی ارسال می‌شود
      // bodyId در پترن تعریف شده است (409528)
      const requestBody = {
        username: this.username,
        password: this.password,
        bodyId: this.bodyId,
        text: code, // فقط کد OTP
        to: formattedPhone,
      };

      this.logger.log(`Sending OTP to ${formattedPhone} using bodyId ${this.bodyId}, code: ${code}`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      // بررسی نتیجه
      if (result.RetStatus === 1 && result.StrRetStatus === 'Ok') {
        // اگر Value یک عدد بیش از 15 رقم باشد، ارسال موفق بوده
        const value = result.Value;
        if (value && value.length > 15) {
          this.logger.log(`OTP sent successfully to ${formattedPhone}`);
          return { 
            success: true,
            smsResponse: result, // برگرداندن response کامل SMS
            debug: {
              formattedPhone,
              apiResponse: result,
              messageId: value,
            }
          };
        }
      }

      // بررسی کدهای خطا
      const errorCode = result.Value;
      this.logger.error(`Failed to send OTP to ${formattedPhone}. Error: ${errorCode}`);
      
      // کدهای خطای رایج
      const errorMessages: Record<string, string> = {
        '0': 'نام کاربری یا رمز عبور صحیح نمی باشد',
        '2': 'اعتبار کافی نمی باشد',
        '4': 'کد متن ارسالی صحیح نمی باشد',
        '18': 'شماره موبایل معتبر نمی باشد',
        '19': 'سقف محدودیت روزانه ارسال از وبسرویس',
        '-110': 'الزام استفاده از ApiKey به جای رمز عبور',
        '110': 'الزام استفاده از ApiKey به جای رمز عبور',
      };

      const errorMessage = errorMessages[errorCode] || `خطای نامشخص: ${errorCode}`;
      this.logger.error(errorMessage);
      
      return {
        success: false,
        smsResponse: result, // برگرداندن response کامل SMS حتی در صورت خطا
        debug: {
          formattedPhone,
          originalPhone: phone,
          errorCode,
          errorMessage,
          apiResponse: result,
          requestBody: {
            ...requestBody,
            password: '***', // Hide password in debug
          },
          apiUrl: this.apiUrl,
        }
      };
    } catch (error) {
      this.logger.error(`Error sending OTP to ${phone}:`, error);
      return {
        success: false,
        smsResponse: null, // در صورت خطای exception
        debug: {
          originalPhone: phone,
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
          apiUrl: this.apiUrl,
        }
      };
    }
  }
}

