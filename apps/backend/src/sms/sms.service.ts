import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly username: string;
  private readonly password: string;
  private readonly bodyId: number;
  private readonly apiUrl = 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber';

  constructor(private configService: ConfigService) {
    this.username = this.configService.get<string>('MELIPAYAMAK_USERNAME') || '989123895285';
    this.password = this.configService.get<string>('MELIPAYAMAK_PASSWORD') || 'ACLQ$';
    this.bodyId = parseInt(this.configService.get<string>('MELIPAYAMAK_BODY_ID') || '409528');
  }

  async sendOTP(phone: string, code: string): Promise<{ success: boolean; debug?: any }> {
    try {
      // Format phone number (remove leading 0 if exists, ensure it starts with 98)
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '98' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('98')) {
        formattedPhone = '98' + formattedPhone;
      }

      const requestBody = {
        username: this.username,
        password: this.password,
        bodyId: this.bodyId,
        text: code, // کد OTP به عنوان متغیر
        to: formattedPhone,
      };

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
      };

      const errorMessage = errorMessages[errorCode] || `خطای نامشخص: ${errorCode}`;
      this.logger.error(errorMessage);
      
      return {
        success: false,
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

