import {
  Button,
  ButtonProps,
  CircularProgress,
  SxProps,
  useTheme,
} from '@mui/material';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { BLURPLE, GRAY } from '../../styles/theme';

interface Props extends ButtonProps {
  isLoading?: boolean;
  sx?: SxProps;
}

const PrimaryButton = ({ isLoading, children, sx, ...props }: Props) => {
  const isDarkMode = useIsDarkMode();
  const theme = useTheme();

  const buttonStyles: SxProps = {
    backgroundColor: BLURPLE['500'],
    '&:active': {
      backgroundColor: BLURPLE['500'],
    },
    '&:hover': {
      backgroundColor: BLURPLE['400'],
    },
    '&:disabled': {
      backgroundColor: isDarkMode ? BLURPLE['700'] : GRAY['100'],
      color: isDarkMode ? GRAY['400'] : undefined,
    },
    color: theme.palette.common.white,
    fontWeight: 500,
    letterSpacing: '0.2px',
    borderRadius: 9999,
    padding: '0 15px',
    minWidth: 85,
    height: 38,
    ...sx,
  };

  return (
    <Button sx={buttonStyles} {...props}>
      {isLoading && (
        <CircularProgress
          size={10}
          color="inherit"
          sx={{ marginRight: 0.75 }}
        />
      )}
      {children}
    </Button>
  );
};

export default PrimaryButton;
