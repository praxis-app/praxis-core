import {
  LinearProgress,
  linearProgressClasses,
  LinearProgressProps,
  styled,
} from '@mui/material';
import { ReactNode } from 'react';
import { useMeQuery } from '../../hooks/user.hooks';

const ProgressBar = styled(LinearProgress)<LinearProgressProps>(
  ({ theme }) => ({
    [`&.${linearProgressClasses.colorPrimary}`]: {
      ...theme.applyStyles('dark', {
        backgroundColor: '#09090b',
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      ...theme.applyStyles('dark', {
        backgroundColor: '#18181b',
      }),
    },
    height: '100vh',
  }),
);

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const { isLoading } = useMeQuery({
    retry: import.meta.env.PROD ? 1 : 0,
  });

  if (isLoading) {
    return <ProgressBar />;
  }

  return <>{children}</>;
};
