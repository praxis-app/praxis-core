import { useMeQuery } from '@/hooks/use-me-query';
import { ReactNode } from 'react';
import { ChannelSkeleton } from '../channels/channel-skeleton';

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const { isLoading } = useMeQuery({
    retry: import.meta.env.PROD ? 1 : 0,
  });

  if (isLoading) {
    return <ChannelSkeleton />;
  }

  return <>{children}</>;
};
