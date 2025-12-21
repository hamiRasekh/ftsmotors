import { Injectable, Logger, TooManyRequestsException } from '@nestjs/common';

interface OTPData {
  code: string;
  expiresAt: Date;
  attempts: number;
}

interface RateLimitData {
  count: number;
  resetAt: Date;
}

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly otpStore = new Map<string, OTPData>();
  private readonly rateLimitStore = new Map<string, RateLimitData>();
  private readonly OTP_EXPIRY_MINUTES = 5;
  private readonly MAX_ATTEMPTS = 3;
  private readonly RATE_LIMIT_WINDOW_MINUTES = 10;
  private readonly MAX_REQUESTS_PER_WINDOW = 3;

  generateOTP(): string {
    // Generate 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOTP(phone: string, code: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    this.otpStore.set(phone, {
      code,
      expiresAt,
      attempts: 0,
    });

    // Clean up expired OTPs periodically
    this.cleanupExpiredOTPs();
  }

  async verifyOTP(phone: string, code: string): Promise<boolean> {
    const otpData = this.otpStore.get(phone);

    if (!otpData) {
      this.logger.warn(`No OTP found for phone: ${phone}`);
      return false;
    }

    // Check if OTP is expired
    if (new Date() > otpData.expiresAt) {
      this.logger.warn(`OTP expired for phone: ${phone}`);
      this.otpStore.delete(phone);
      return false;
    }

    // Check attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      this.logger.warn(`Max attempts reached for phone: ${phone}`);
      this.otpStore.delete(phone);
      return false;
    }

    // Increment attempts
    otpData.attempts++;

    if (otpData.code === code) {
      // OTP verified successfully, remove it
      this.otpStore.delete(phone);
      this.logger.log(`OTP verified successfully for phone: ${phone}`);
      return true;
    }

    // Store updated attempts
    this.otpStore.set(phone, otpData);
    this.logger.warn(`Invalid OTP attempt for phone: ${phone}. Attempts: ${otpData.attempts}`);
    return false;
  }

  async checkRateLimit(phone: string): Promise<boolean> {
    const now = new Date();
    const rateLimitData = this.rateLimitStore.get(phone);

    if (!rateLimitData || now > rateLimitData.resetAt) {
      // Reset or create new rate limit window
      const resetAt = new Date();
      resetAt.setMinutes(resetAt.getMinutes() + this.RATE_LIMIT_WINDOW_MINUTES);
      this.rateLimitStore.set(phone, {
        count: 1,
        resetAt,
      });
      return true;
    }

    if (rateLimitData.count >= this.MAX_REQUESTS_PER_WINDOW) {
      this.logger.warn(`Rate limit exceeded for phone: ${phone}`);
      return false;
    }

    rateLimitData.count++;
    this.rateLimitStore.set(phone, rateLimitData);
    return true;
  }

  private cleanupExpiredOTPs(): void {
    const now = new Date();
    for (const [phone, otpData] of this.otpStore.entries()) {
      if (now > otpData.expiresAt) {
        this.otpStore.delete(phone);
      }
    }

    // Clean up rate limit store
    for (const [phone, rateLimitData] of this.rateLimitStore.entries()) {
      if (now > rateLimitData.resetAt) {
        this.rateLimitStore.delete(phone);
      }
    }
  }
}

