import crypto from 'crypto';

class OTPService {
  generate(): string {
    const buffer = crypto.randomBytes(4);
    const num = buffer.readUInt32BE(0) % 1000000;
    return num.toString().padStart(6, '0');
  }

  getExpiry(): Date {
    return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  }

  isExpired(expiry: Date): boolean {
    return new Date() > expiry;
  }
}

export const otpService = new OTPService();