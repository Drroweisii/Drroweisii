import React from 'react';
import { motion } from 'framer-motion';
import { PRIZES } from '../game/prizeConfig';
import { formatDistanceToNow } from '../utils/dateUtils';

interface Transaction {
  type: string;
  amount: number;
  timestamp: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  loading,
  hasMore,
  onLoadMore
}) => {
  if (!transactions.length && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction, index) => {
        const prize = PRIZES.find(p => p.symbol === transaction.type);
        if (!prize) return null;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${prize.color.replace('text-', 'bg-').replace('500', '100')}`}>
                <prize.icon className={`w-5 h-5 ${prize.color}`} />
              </div>
              <div>
                <p className="font-medium">{prize.name}</p>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(transaction.timestamp))}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">+{transaction.amount.toFixed(8)}</p>
              <p className="text-sm text-gray-400">{transaction.type}</p>
            </div>
          </motion.div>
        );
      })}

      {(loading || hasMore) && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;