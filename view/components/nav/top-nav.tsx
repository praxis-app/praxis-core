import { ArrowBack, Search } from '@mui/icons-material';
import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { ReactNode, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BrowserEvents,
  KeyCodes,
  NavigationPaths,
} from '../../constants/shared.constants';
import { useAboveBreakpoint, useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';

export interface TopNavProps {
  header?: string;
  onBackClick?: () => void;
  backBtnIcon?: ReactNode;
}

const TopNav = ({ header, onBackClick, backBtnIcon }: TopNavProps) => {
  const { setIsNavDrawerOpen, setToast } = useAppStore((state) => state);

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const isAboveMd = useAboveBreakpoint('md');
  const navigate = useNavigate();

  const headerSx: SxProps = {
    color: isDarkMode ? 'white' : 'black',
    cursor: header ? 'default' : 'pointer',
    fontSize: header ? '17px' : '18px',
    fontWeight: header ? 600 : 700,
    paddingLeft: 0.5,
  };
  const buttonSx: SxProps = {
    width: 38,
    height: 38,
  };

  const handleBackClick = useCallback(() => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    if (isAboveMd) {
      navigate(NavigationPaths.Home);
      return;
    }
    // Show nav drawer as default behavior
    setIsNavDrawerOpen(true);
  }, [isAboveMd, navigate, onBackClick, setIsNavDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KeyCodes.Escape) {
        handleBackClick();
      }
    };
    window.addEventListener(BrowserEvents.Keydown, handleKeyDown);
    return () => {
      window.removeEventListener(BrowserEvents.Keydown, handleKeyDown);
    };
  }, [handleBackClick]);

  const handleHeaderClick = () => {
    if (!header) {
      navigate('/');
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottom={`1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}`}
      bgcolor="background.paper"
      paddingRight={2.4}
      paddingLeft={2.5}
      height="55px"
      position="fixed"
      width="100%"
      zIndex={1}
      top={0}
      left={0}
    >
      <Box display="flex" alignItems="center">
        <IconButton
          onClick={handleBackClick}
          sx={{ ...buttonSx, marginRight: 0.5 }}
          edge="start"
        >
          {backBtnIcon || <ArrowBack />}
        </IconButton>

        <Typography variant="h1" sx={headerSx} onClick={handleHeaderClick}>
          {header || t('brand')}
        </Typography>
      </Box>

      <IconButton
        sx={buttonSx}
        aria-label={t('labels.menu')}
        onClick={() => setToast({ status: 'info', title: t('prompts.inDev') })}
        size="large"
        edge="end"
      >
        <Search />
      </IconButton>
    </Box>
  );
};

export default TopNav;
