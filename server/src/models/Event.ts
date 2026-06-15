import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  league: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  startTime: Date;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  externalId?: string;
  totalBetsHome: number;
  totalBetsAway: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    league: {
      type: String,
      required: [true, 'League name is required'],
      trim: true,
    },
    sport: {
      type: String,
      default: 'Soccer',
      trim: true,
    },
    homeTeam: {
      type: String,
      required: [true, 'Home team is required'],
      trim: true,
    },
    awayTeam: {
      type: String,
      required: [true, 'Away team is required'],
      trim: true,
    },
    homeTeamLogo: {
      type: String,
      default: null,
    },
    awayTeamLogo: {
      type: String,
      default: null,
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    homeScore: {
      type: Number,
      default: null,
    },
    awayScore: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    externalId: {
      type: String,
      default: null,
    },
    totalBetsHome: {
      type: Number,
      default: 0,
    },
    totalBetsAway: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);