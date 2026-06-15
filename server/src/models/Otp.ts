import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  phone: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    phone: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtp>('Otp', OtpSchema);