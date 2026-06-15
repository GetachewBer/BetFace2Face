import mongoose, { Schema, Document } from 'mongoose';

export interface ITrade extends Document {
  event: mongoose.Types.ObjectId;
  homeUser: mongoose.Types.ObjectId;
  awayUser: mongoose.Types.ObjectId;
  homeOrder: mongoose.Types.ObjectId;
  awayOrder: mongoose.Types.ObjectId;
  amount: number;
  winner?: 'home' | 'away' | 'draw';
  commission: number;
  homePayout?: number;
  awayPayout?: number;
  status: 'pending' | 'settled' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const TradeSchema = new Schema<ITrade>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    homeUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    awayUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    homeOrder: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    awayOrder: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [10, 'Minimum trade is 10 ETB'],
    },
    winner: {
      type: String,
      enum: ['home', 'away', 'draw'],
      default: null,
    },
    commission: {
      type: Number,
      default: 0,
    },
    homePayout: {
      type: Number,
      default: null,
    },
    awayPayout: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'settled', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITrade>('Trade', TradeSchema);