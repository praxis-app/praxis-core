import { Link as MuiLink, SxProps } from '@mui/material';
import { ReactNode } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

interface Props {
  children: ReactNode;
  disabled?: boolean;
  leftSpace?: boolean;
  onClick?: () => void;
  state?: Record<string, unknown>;
  sx?: SxProps;
  to: string;
}

export const Link = ({
  children,
  disabled,
  leftSpace,
  onClick,
  state,
  sx,
  to,
}: Props) => (
  <MuiLink
    component={ReactRouterLink}
    onClick={onClick}
    state={state}
    to={to}
    sx={{
      pointerEvents: disabled ? 'none' : undefined,
      textDecoration: 'none',
      color: 'text.primary',
      ...sx,
    }}
  >
    {leftSpace ? ' ' : ''}
    {children}
  </MuiLink>
);
