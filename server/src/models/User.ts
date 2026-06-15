import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  fullName: string;
  phone?: string;
  email?: string;
  password: string;
  provider: string;
  providerId: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  walletBalance: number;
  refreshToken?: string;
  comparePassword(c: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String, required: true, select: false },
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  avatar: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
  walletBalance: { type: Number, default: 0.00 },
  refreshToken: { type: String, select: false },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(c: string) {
  return bcrypt.compare(c, this.password);
};

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({ userId: this._id }, process.env.JWT_REFRESH_SECRET || 'refresh', { expiresIn: '30d' });
};

export default mongoose.model<IUser>('User', userSchema);