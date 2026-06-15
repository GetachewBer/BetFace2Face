import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import fixtureRoutes from './routes/fixture.routes';
import betRoutes from './routes/bet.routes';
import { authenticate } from './middleware/auth.middleware';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api/bets', authenticate, betRoutes);

const start = async () => {
  await mongoose.connect('mongodb://localhost:27017/betface2face');
  console.log('MongoDB Connected');
  app.listen(5000, () => console.log('Server on :5000'));
};

start();