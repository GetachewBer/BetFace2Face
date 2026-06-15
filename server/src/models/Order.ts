import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  selection: 'home' | 'away';
  amount: number;
  matchedAmount: number;
  remainingAmount: number;
  odds: number;
  status: 'open' | 'partially_matched' | 'matched' | 'cancelled' | 'settled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    selection: {
      type: String,
      enum: ['home', 'away'],
      required: [true, 'Selection is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [10, 'Minimum bet is 10 ETB'],
    },
    matchedAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: function () {
        return this.amount;
      },
    },
    odds: {
      type: Number,
      default: 2.0,
    },
    status: {
      type: String,
      enum: ['open', 'partially_matched', 'matched', 'cancelled', 'settled'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);