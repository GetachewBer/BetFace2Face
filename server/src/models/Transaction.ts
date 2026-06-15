import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type:
    | 'deposit'
    | 'withdrawal'
    | 'bet_placed'
    | 'bet_cancelled'
    | 'winnings'
    | 'loss'
    | 'refund'
    | 'commission';
  amount: number;
  balanceAfter: number;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'deposit',
        'withdrawal',
        'bet_placed',
        'bet_cancelled',
        'winnings',
        'loss',
        'refund',
        'commission',
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    reference: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);