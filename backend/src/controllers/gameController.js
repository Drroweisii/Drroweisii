import User from '../models/User.js';
import Prize from '../models/Prize.js';

const PRIZES = {
  BTC: { min: 0.0001, max: 0.001, weight: 5 },
  MAJOR: { min: 1, max: 10, weight: 10 },
  USDT: { min: 1, max: 100, weight: 20 },
  USDC: { min: 1, max: 100, weight: 20 },
  STAR: { min: 10, max: 100, weight: 15 },
  GBD: { min: 1, max: 50, weight: 15 },
  NOT: { min: 1, max: 20, weight: 15 }
};

const SPIN_COOLDOWN = 5 * 60 * 1000; // 5 minutes
const MAX_SPINS = 10;

const getRandomPrize = () => {
  const weights = Object.entries(PRIZES).map(([_, value]) => value.weight);
  const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [type, config] of Object.entries(PRIZES)) {
    random -= config.weight;
    if (random <= 0) {
      const { min, max } = config;
      const amount = Number((Math.random() * (max - min) + min).toFixed(8));
      return { type, amount };
    }
  }
  
  // Fallback to NOT token if something goes wrong
  return { type: 'NOT', amount: PRIZES.NOT.min };
};

export const spin = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check spin availability
    if (user.spinsLeft <= 0) {
      const timeElapsed = Date.now() - user.lastSpinTime.getTime();
      if (timeElapsed < SPIN_COOLDOWN) {
        return res.status(400).json({
          message: 'No spins left',
          recoveryTime: SPIN_COOLDOWN - timeElapsed,
          nextRefreshTime: new Date(user.lastSpinTime.getTime() + SPIN_COOLDOWN)
        });
      }
      user.spinsLeft = MAX_SPINS;
    }

    // Generate prize
    const { type, amount } = getRandomPrize();

    // Create prize record
    const prize = new Prize({
      type,
      amount,
      userId: user._id
    });
    await prize.save();

    // Update user's wallet and spin count
    user.walletBalances[type] += amount;
    user.spinsLeft -= 1;
    user.lastSpinTime = new Date();
    await user.save();

    res.json({
      prize: { type, amount },
      spinsLeft: user.spinsLeft,
      walletBalances: user.walletBalances,
      nextRefreshTime: new Date(user.lastSpinTime.getTime() + SPIN_COOLDOWN)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPrizeHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const prizes = await Prize.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Prize.countDocuments({ userId: req.user.userId });

    res.json({
      prizes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSpinStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const timeElapsed = Date.now() - user.lastSpinTime.getTime();
    const nextRefreshTime = new Date(user.lastSpinTime.getTime() + SPIN_COOLDOWN);

    res.json({
      spinsLeft: user.spinsLeft,
      maxSpins: MAX_SPINS,
      nextRefreshTime,
      canSpin: user.spinsLeft > 0 || timeElapsed >= SPIN_COOLDOWN
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};