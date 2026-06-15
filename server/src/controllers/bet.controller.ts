import { Request, Response } from 'express';
import Bet from '../models/Bet';
import User from '../models/User';

export const placeBet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fixtureId, homeTeam, awayTeam, selectedTeam, amount, matchDate, league } = req.body;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    if (user.walletBalance < amount) {
      res.status(400).json({ success: false, message: 'Insufficient balance' });
      return;
    }

    // Check if user has pending bets on this match for a DIFFERENT team
    const existingBet = await Bet.findOne({ user: userId, fixtureId, status: 'pending' });
    if (existingBet && existingBet.selectedTeam !== selectedTeam) {
      res.status(400).json({ 
        success: false, 
        message: `You already bet on ${existingBet.selectedTeam}. Cancel it first to switch teams.` 
      });
      return;
    }

    // Allow: same team (add more) OR no existing bet

    user.walletBalance -= amount;
    await user.save();

    const bet = await Bet.create({
      user: userId, fixtureId, homeTeam, awayTeam, selectedTeam,
      amount, potentialWin: amount * 2, matchDate, league, status: 'pending',
    });

    res.status(201).json({ success: true, data: { bet, newBalance: user.walletBalance } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

// Cancel a pending bet
export const cancelBet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { betId } = req.params;
    const userId = req.body.userId;

    const bet = await Bet.findOne({ _id: betId, user: userId, status: 'pending' });
    if (!bet) { res.status(404).json({ success: false, message: 'Bet not found or already settled' }); return; }

    // Refund
    const user = await User.findById(userId);
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return; }
    
    user.walletBalance += bet.amount;
    await user.save();

    bet.status = 'cancelled';
    await bet.save();

    res.json({ success: true, message: 'Bet cancelled', newBalance: user.walletBalance });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const getMyBets = async (req: Request, res: Response): Promise<void> => {
  const bets = await Bet.find({ user: req.body.userId }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: bets });
};