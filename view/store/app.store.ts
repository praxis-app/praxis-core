import { MatrixClient } from 'matrix-js-sdk';
import { create } from 'zustand';

interface AppState {
  matrixClient: MatrixClient | null;
  setMatrixClient(matrixClient: MatrixClient | null): void;
}

export const useAppStore = create<AppState>((set) => ({
  matrixClient: null,
  setMatrixClient(matrixClient) {
    set({ matrixClient });
  },
}));
