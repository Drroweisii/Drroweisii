import express from 'express';
import { spin, getPrizeHistory, getSpinStats } from '../controllers/gameController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/spin', auth, spin);
router.get('/history', auth, getPrizeHistory);
router.get('/stats', auth, getSpinStats);

export default router;