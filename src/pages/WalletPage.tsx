import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpToLine, History, RefreshCw } from 'lucide-react';
import useAuthStore from '../store/authStore';
import WalletBalance from '../components/wallet/WalletBalance';
import TransactionHistory from '../components/wallet/TransactionHistory';
import { mockApi } from '../config/api';

const WalletPage: React.FC = () => {
  const { user } = useAuthStore();
  const [prizeHistory, setPrizeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPrizeHistory = async () => {
    try {
      setLoading(true);
      const data = await mockApi.getHistory();
      setPrizeHistory(prev => [...prev, ...data.prizes]);
      setHasMore(data.pagination.currentPage < data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch prize history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizeHistory();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <button 
            onClick={() => {
              setPrizeHistory([]);
              setPage(1);
              fetchPrizeHistory();
            }}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Balances */}
        <section className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Available Balance</h2>
          <WalletBalance balances={user?.walletBalances || {}} />
        </section>

        {/* Quick Actions */}
        <section className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-3 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
              <ArrowDownToLine className="w-5 h-5 text-green-400" />
              <span>Deposit</span>
            </button>
            <button className="flex items-center justify-center space-x-3 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors">
              <ArrowUpToLine className="w-5 h-5 text-red-400" />
              <span>Withdraw</span>
            </button>
          </div>
        </section>

        {/* Transaction History */}
        <section className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Prize History</h2>
            <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
              <History className="w-4 h-4" />
              <span>View All</span>
            </button>
          </div>
          
          <TransactionHistory 
            transactions={prizeHistory}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </section>
      </div>
    </div>
  );
};

export default WalletPage;