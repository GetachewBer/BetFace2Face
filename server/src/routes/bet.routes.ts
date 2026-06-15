import { Router } from 'express';
import { placeBet, getMyBets, cancelBet } from '../controllers/bet.controller';

const router = Router();
router.post('/', placeBet);
router.get('/my', getMyBets);
router.delete('/:betId', cancelBet);
export default router;