import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['BTC', 'MAJOR', 'USDT', 'USDC', 'STAR', 'GBD', 'NOT']
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Prize', prizeSchema);