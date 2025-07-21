import { create } from 'zustand';
import { LocalStorageKeys } from '../constants/shared.constants';

interface AppState {
  isLoggedIn: boolean;
  isAppLoading: boolean;
  inviteToken: string | null;
  setIsLoggedIn(isLoggedIn: boolean): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setInviteToken(inviteToken: string | null): void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoggedIn: false,
  isAppLoading: true,
  inviteToken: localStorage.getItem(LocalStorageKeys.InviteToken),

  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
  setInviteToken(inviteToken) {
    set({ inviteToken });
  },
  setIsLoggedIn(isLoggedIn) {
    set({ isLoggedIn });
  },
}));
