import { useAppStore } from '@/store/app.store';

export const useMatrixClient = () => {
  const { matrixClient } = useAppStore();
  if (!matrixClient) {
    throw new Error('useMatrixClient must be inside MatrixProvider');
  }
  return matrixClient;
};
