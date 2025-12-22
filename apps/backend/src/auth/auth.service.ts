import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OtpService } from '../otp/otp.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private smsService: SmsService,
  ) {}

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone, true); // Include password for validation
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phone, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { phone: user.phone, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(
      registerDto.phone,
      registerDto.password,
      'USER',
      registerDto.name,
      registerDto.email,
    );
    const payload = { phone: user.phone, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message?: string }> {
    // Validate phone number format (Iranian format)
    const phoneRegex = /^09\d{9}$|^9\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      throw new BadRequestException('شماره موبایل معتبر نیست');
    }

    // Check rate limit
    const canProceed = await this.otpService.checkRateLimit(phone);
    if (!canProceed) {
      throw new HttpException('تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید.', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Generate OTP
    const code = this.otpService.generateOTP();
    
    // Store OTP
    await this.otpService.storeOTP(phone, code);

    // Send SMS
    const smsResult = await this.smsService.sendOTP(phone, code);
    
    if (!smsResult.success) {
      throw new BadRequestException({
        message: 'خطا در ارسال پیامک. لطفاً دوباره تلاش کنید.',
        debug: smsResult.debug,
      });
    }

    return {
      success: true,
      message: 'کد تایید به شماره موبایل شما ارسال شد.',
      debug: smsResult.debug,
    };
  }

  async verifyOTP(phone: string, code: string): Promise<{ access_token: string; user: any }> {
    // Validate phone number
    const phoneRegex = /^09\d{9}$|^9\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      throw new BadRequestException('شماره موبایل معتبر نیست');
    }

    // Verify OTP
    const isValid = await this.otpService.verifyOTP(phone, code);
    if (!isValid) {
      throw new UnauthorizedException('کد تایید نامعتبر است یا منقضی شده است.');
    }

    // Find or create user
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      // Create new user without password
      user = await this.usersService.createWithoutPassword(phone);
    }

    // Generate JWT token
    const payload = { phone: user.phone, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}
