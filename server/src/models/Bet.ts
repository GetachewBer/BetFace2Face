import mongoose, { Schema, Document } from 'mongoose';

export interface IBet extends Document {
  user: mongoose.Types.ObjectId;
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  selectedTeam: string;
  amount: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost';
  matchDate: Date;
  league: string;
}

const betSchema = new Schema<IBet>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fixtureId: { type: Number, required: true },
  homeTeam: String,
  awayTeam: String,
  selectedTeam: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  potentialWin: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
  matchDate: Date,
  league: String,
}, { timestamps: true });

betSchema.index({ user: 1, fixtureId: 1 });
betSchema.index({ status: 1 });

export default mongoose.model<IBet>('Bet', betSchema);