import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

const useAuthStore = create<AuthState & {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateBalance: (currency: string, amount: number) => void;
  updateSpins: (spins: number) => void;
}>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  updateBalance: (currency, amount) => set((state) => ({
    user: state.user ? {
      ...state.user,
      walletBalances: {
        ...state.user.walletBalances,
        [currency]: (state.user.walletBalances[currency] || 0) + amount
      }
    } : null
  })),
  updateSpins: (spins) => set((state) => ({
    user: state.user ? {
      ...state.user,
      spinsLeft: spins
    } : null
  }))
}));

export default useAuthStore;