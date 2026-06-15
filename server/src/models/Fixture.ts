import mongoose, { Schema, Document } from 'mongoose';

export interface IFixture extends Document {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  date: Date;
  league: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
}

const fixtureSchema = new Schema<IFixture>({
  fixtureId: { type: Number, required: true, unique: true },
  homeTeam: String,
  awayTeam: String,
  homeLogo: String,
  awayLogo: String,
  date: Date,
  league: String,
  status: { type: String, default: 'SCHEDULED' },
  homeScore: { type: Number, default: null },
  awayScore: { type: Number, default: null },
}, { timestamps: true });

export default mongoose.model<IFixture>('Fixture', fixtureSchema);