import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly username: string;
  private readonly password: string;
  private readonly bodyId: number;
  private readonly senderNumber: string;
  
  // سرویس قدیمی: استفاده از متد BaseServiceNumber که فقط کد OTP را به عنوان ورودی می‌گیرد
  private readonly apiUrlBaseService = 'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber';
  
  // سرویس جدید: استفاده از متد SendSMS که از شماره فرستنده استفاده می‌کند
  private readonly apiUrlSendSMS = 'https://rest.payamak-panel.com/api/SendSMS/SendSMS';

  constructor(private configService: ConfigService) {
    this.username = this.configService.get<string>('MELIPAYAMAK_USERNAME') || '989123895285';
    // استفاده از password جدید که کاربر ارائه داده
    this.password = this.configService.get<string>('MELIPAYAMAK_PASSWORD') || 'be536d9b-339d-4deb-8cdb-27ce5493c79d';
    this.bodyId = parseInt(this.configService.get<string>('MELIPAYAMAK_BODY_ID') || '409528');
    this.senderNumber = this.configService.get<string>('MELIPAYAMAK_SENDER_NUMBER') || '50002710095288';
  }

  /**
   * سرویس قدیمی: ارسال OTP با استفاده از BaseServiceNumber
   * این سرویس برای استفاده در آینده نگه داشته شده است
   */
  async sendOTPBaseService(phone: string, code: string): Promise<{ success: boolean; debug?: any; smsResponse?: any }> {
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

      this.logger.log(`Sending OTP to ${formattedPhone} using BaseServiceNumber, bodyId ${this.bodyId}, code: ${code}`);

      const response = await fetch(this.apiUrlBaseService, {
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
            smsResponse: result,
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
        smsResponse: result,
        debug: {
          formattedPhone,
          originalPhone: phone,
          errorCode,
          errorMessage,
          apiResponse: result,
          requestBody: {
            ...requestBody,
            password: '***',
          },
          apiUrl: this.apiUrlBaseService,
        }
      };
    } catch (error) {
      this.logger.error(`Error sending OTP to ${phone}:`, error);
      return {
        success: false,
        smsResponse: null,
        debug: {
          originalPhone: phone,
          error: error instanceof Error ? error.message : String(error),
          errorStack: error instanceof Error ? error.stack : undefined,
          apiUrl: this.apiUrlBaseService,
        }
      };
    }
  }

  /**
   * سرویس جدید: ارسال OTP با استفاده از SendSMS
   * این سرویس فعلاً استفاده می‌شود
   */
  async sendOTPSendSMS(phone: string, code: string): Promise<{ success: boolean; debug?: any; smsResponse?: any }> {
    try {
      // Format phone number (remove leading 0 if exists, ensure it starts with 98)
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '98' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('98')) {
        formattedPhone = '98' + formattedPhone;
      }

      // استفاده از متد SendSMS که نیاز به from (شماره فرستنده) دارد
      const requestBody = {
        username: this.username,
        password: this.password,
        to: formattedPhone,
        from: this.senderNumber, // شماره فرستنده: 50002710095288
        text: code, // کد OTP
        isFlash: false, // پیام عادی (نه Flash)
      };

      this.logger.log(`Sending OTP to ${formattedPhone} using SendSMS, from ${this.senderNumber}, code: ${code}`);

      const response = await fetch(this.apiUrlSendSMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      // بررسی نتیجه
      if (result.RetStatus === 1 && result.StrRetStatus === 'Ok') {
        // Value باید recID باشد (یک عدد بیش از 11 رقم)
        const value = result.Value;
        if (value && !isNaN(parseInt(value)) && value.length >= 11) {
          this.logger.log(`OTP sent successfully to ${formattedPhone}, recID: ${value}`);
          return { 
            success: true,
            smsResponse: result, // برگرداندن response کامل SMS
            debug: {
              formattedPhone,
              apiResponse: result,
              recID: value,
            }
          };
        }
      }

      // بررسی کدهای خطا
      const errorCode = result.Value || result.RetStatus?.toString();
      this.logger.error(`Failed to send OTP to ${formattedPhone}. Error: ${errorCode}`);
      
      // کدهای خطای رایج بر اساس مستندات
      const errorMessages: Record<string, string> = {
        '-111': 'IP در لیست مجاز قرار ندارد',
        '-110': 'الزام استفاده از ApiKey به جای رمز عبور',
        '-109': 'IP در لیست مجاز API قرار ندارد',
        '-108': 'IP در لیست مجاز قرار ندارد',
        '0': 'نام کاربری یا رمز عبور صحیح نمی باشد',
        '1': 'ارسال با موفقیت انجام شد',
        '2': 'اعتبار کافی نمی باشد',
        '3': 'محدودیت در ارسال لینک',
        '4': 'محدودیت در حجم لینک',
        '5': 'شماره فرستنده معتبر نمی باشد',
        '6': 'متن در لیست سیاه قرار دارد',
        '7': 'متن لینک فیلتر شده است',
        '9': 'خطا در ارتباط با سرویس',
        '10': 'نام کاربری فعال نمی باشد',
        '11': 'ارسال لینک',
        '12': 'نام کاربری کامل نمی باشد',
        '14': 'متن لینک در انتظار',
        '15': 'محدودیت در تعداد متن لینک',
        '16': 'ارسال یا دریافت شماره',
        '17': 'متن لینک خالی است',
        '18': 'شماره موبایل معتبر نمی باشد',
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
          apiUrl: this.apiUrlSendSMS,
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
          apiUrl: this.apiUrlSendSMS,
        }
      };
    }
  }

  /**
   * متد اصلی sendOTP که فعلاً از سرویس جدید SendSMS استفاده می‌کند
   */
  async sendOTP(phone: string, code: string): Promise<{ success: boolean; debug?: any; smsResponse?: any }> {
    // فعلاً از سرویس جدید SendSMS استفاده می‌کنیم
    return this.sendOTPSendSMS(phone, code);
  }
}

