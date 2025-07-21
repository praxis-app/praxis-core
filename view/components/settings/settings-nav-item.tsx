import { ChevronRight, SvgIconComponent } from '@mui/icons-material';
import { Box, Button, ButtonProps, SxProps } from '@mui/material';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { GRAY } from '../../styles/theme';

interface Props extends ButtonProps {
  Icon: SvgIconComponent;
  label: string;
}

const SettingsNavItem = ({
  Icon,
  sx,
  disabled,
  label,
  ...buttonProps
}: Props) => {
  const isDarkMode = useIsDarkMode();

  const buttonSx: ButtonProps['sx'] = {
    boxShadow: isDarkMode
      ? 'none'
      : '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);',
    backgroundColor: isDarkMode
      ? 'rgba(255, 255, 255, 0.045)'
      : 'background.paper',
    border: isDarkMode ? 'none' : `1px solid ${GRAY[100]}`,
    color: 'text.primary',
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    userSelect: 'none',
    ...sx,
  };
  const buttonIconSx: SxProps = {
    color: disabled ? 'text.disabled' : 'text.secondary',
  };

  return (
    <Button sx={buttonSx} disabled={disabled} {...buttonProps}>
      <Box display="flex" gap={1.5}>
        <Icon sx={buttonIconSx} />
        {label}
      </Box>
      <ChevronRight sx={buttonIconSx} />
    </Button>
  );
};

export default SettingsNavItem;
