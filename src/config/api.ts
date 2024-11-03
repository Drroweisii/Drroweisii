// Mock API endpoints (no actual server calls)
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  game: {
    spin: '/api/game/spin',
    history: '/api/game/history',
    stats: '/api/game/stats',
  },
  user: {
    profile: '/api/users/profile',
    update: '/api/users/profile',
  },
};

// Mock API functions
export const mockApi = {
  login: async (email: string, password: string) => {
    return {
      token: 'mock-token',
      user: {
        id: '1',
        email,
        username: email.split('@')[0],
        walletBalances: {
          BTC: 0.00123,
          MAJOR: 5.0,
          USDT: 100.0,
          USDC: 100.0,
          STAR: 50.0,
          GBD: 25.0,
          NOT: 10.0
        },
        spinsLeft: 10
      }
    };
  },
  
  register: async (email: string, password: string, username: string) => {
    return {
      token: 'mock-token',
      user: {
        id: '1',
        email,
        username,
        walletBalances: {
          BTC: 0,
          MAJOR: 0,
          USDT: 0,
          USDC: 0,
          STAR: 0,
          GBD: 0,
          NOT: 0
        },
        spinsLeft: 10
      }
    };
  },

  spin: async () => {
    const prizes = ['BTC', 'MAJOR', 'USDT', 'USDC', 'STAR', 'GBD', 'NOT'];
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    const amount = parseFloat((Math.random() * 10).toFixed(8));
    
    return {
      prize: { type: randomPrize, amount },
      spinsLeft: Math.max(0, Math.floor(Math.random() * 10)),
      nextRefreshTime: Date.now() + 5 * 60 * 1000
    };
  },

  getHistory: async () => {
    return {
      prizes: Array.from({ length: 10 }, (_, i) => ({
        type: ['BTC', 'MAJOR', 'USDT', 'USDC', 'STAR', 'GBD', 'NOT'][Math.floor(Math.random() * 7)],
        amount: parseFloat((Math.random() * 10).toFixed(8)),
        timestamp: new Date(Date.now() - i * 3600000).toISOString()
      })),
      pagination: {
        currentPage: 1,
        pages: 1
      }
    };
  }
};

export default endpoints;