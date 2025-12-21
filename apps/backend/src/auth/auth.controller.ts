import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'Registration successful' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP code to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid phone number' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async sendOTP(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOTP(sendOtpDto.phone);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code and login/register user' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 400, description: 'Invalid phone number or code' })
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto.phone, verifyOtpDto.code);
  }
}
