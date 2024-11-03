import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const SpinCounter: React.FC = () => {
  const { spinsLeft, maxSpins, recoveryTime, resetSpins } = useGameStore();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (recoveryTime && spinsLeft === 0) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, recoveryTime - now);

        if (remaining <= 0) {
          resetSpins();
          setTimeLeft('');
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [recoveryTime, spinsLeft, resetSpins]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-2"
    >
      <motion.div 
        className="flex items-center justify-center space-x-2 bg-[#1a1a1a] px-6 py-3 rounded-full border border-[#7dff00]/30"
        animate={{ scale: spinsLeft === 0 ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-lg font-semibold text-[#7dff00]">Lucky Draw:</span>
        <div className="flex items-center space-x-1">
          <span className="text-lg font-bold text-[#7dff00]">{spinsLeft}</span>
          <span className="text-gray-500">/</span>
          <span className="text-lg font-bold text-gray-500">{maxSpins}</span>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {timeLeft && spinsLeft === 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center space-x-2 text-[#7dff00]"
          >
            <span className="text-sm">Recovering</span>
            <span className="text-sm font-medium">{timeLeft}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpinCounter;