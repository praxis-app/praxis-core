import { create } from 'zustand';
import { ToastNotification } from '../types/shared.types';
import { LocalStorageKeys } from '../constants/shared.constants';

interface AppState {
  isLoggedIn: boolean;
  isAppLoading: boolean;
  isNavDrawerOpen: boolean;
  inviteToken: string | null;
  toast: ToastNotification | null;
  setIsLoggedIn(isLoggedIn: boolean): void;
  setIsAppLoading(isAppLoading: boolean): void;
  setToast(toast: ToastNotification | null): void;
  setInviteToken(inviteToken: string | null): void;
  setIsNavDrawerOpen(isNavDrawerOpen: boolean): void;
}

export const useAppStore = create<AppState>((set) => ({
  toast: null,
  isLoggedIn: false,
  isAppLoading: true,
  isNavDrawerOpen: false,
  inviteToken: localStorage.getItem(LocalStorageKeys.InviteToken),

  setIsNavDrawerOpen(isNavDrawerOpen) {
    set({ isNavDrawerOpen });
  },
  setIsAppLoading(isAppLoading) {
    set({ isAppLoading });
  },
  setInviteToken(inviteToken) {
    set({ inviteToken });
  },
  setIsLoggedIn(isLoggedIn) {
    set({ isLoggedIn });
  },
  setToast(toast) {
    set({ toast });
  },
}));
