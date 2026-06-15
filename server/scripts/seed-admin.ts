import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seedAdmin() {
  const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/betface2face');
  const db = conn.connection.db!;
  
  const existing = await db.collection('users').findOne({ role: 'admin' });
  
  if (existing) {
    console.log('Admin already exists:', (existing as any).phone);
    await mongoose.connection.close();
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123!', 12);
  
  await db.collection('users').insertOne({
    fullName: 'Administrator',
    phone: '+251900000000',
    password: hashedPassword,
    provider: 'admin',
    providerId: 'admin-seed',
    role: 'admin',
    isActive: true,
    walletBalance: 0.00,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('Admin created!');
  console.log('Phone: +251900000000');
  console.log('Password: Admin@123!');
  
  await mongoose.connection.close();
}

seedAdmin().catch(err => console.error('Error:', err));