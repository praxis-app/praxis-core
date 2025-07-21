import { ArrowBack, ChevronRight, Search, Tag } from '@mui/icons-material';
import { Box, Button, IconButton, SxProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserEvents, KeyCodes } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useAboveBreakpoint, useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import { Channel } from '../../types/channel.types';
import ChannelDetailsDrawer from './channel-details-drawer';

interface Props {
  channel: Channel;
}

const ChannelTopNav = ({ channel }: Props) => {
  const { setIsNavDrawerOpen, setToast } = useAppStore((state) => state);
  const [showChannelDetails, setShowChannelDetails] = useState(false);

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const isAboveMd = useAboveBreakpoint('md');
  const ability = useAbility();

  const canManageChannels = ability.can('manage', 'Channel');
  const hasDescription = !!channel.description;

  const isChannelBtnDisabled =
    (!canManageChannels && !hasDescription) || isAboveMd;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KeyCodes.Escape) {
        setIsNavDrawerOpen(true);
      }
    };
    window.addEventListener(BrowserEvents.Keydown, handleKeyDown);
    return () => {
      window.removeEventListener(BrowserEvents.Keydown, handleKeyDown);
    };
  }, [setIsNavDrawerOpen]);

  const iconButtonSx: SxProps = {
    width: 38,
    height: 38,
  };
  const channelNameBtnSx: SxProps = {
    '&:hover': {
      backgroundColor: isChannelBtnDisabled ? 'transparent' : undefined,
      cursor: isChannelBtnDisabled ? 'default' : undefined,
    },
    color: 'text.primary',
    justifyContent: 'flex-start',
    flex: 1,
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
    >
      <Box display="flex" alignItems="center" flex={1}>
        {!isAboveMd && (
          <IconButton
            onClick={() => setIsNavDrawerOpen(true)}
            sx={{ ...iconButtonSx, marginRight: 0.5 }}
            edge="start"
          >
            <ArrowBack />
          </IconButton>
        )}

        <Button
          sx={channelNameBtnSx}
          disableRipple={isChannelBtnDisabled}
          onClick={() => {
            if (!isChannelBtnDisabled) {
              setShowChannelDetails(true);
            }
          }}
        >
          <Tag
            sx={{ marginRight: '0.4ch', color: 'text.secondary' }}
            fontSize={isAboveMd ? 'medium' : 'small'}
          />
          <Typography
            sx={{ userSelect: 'none' }}
            fontWeight={700}
            fontSize="15px"
          >
            {channel.name}
          </Typography>

          {!isChannelBtnDisabled && (
            <ChevronRight
              sx={{ color: 'text.secondary', marginTop: '1px' }}
              fontSize="small"
            />
          )}
        </Button>
      </Box>

      {!isAboveMd && (
        <ChannelDetailsDrawer
          channel={channel}
          isOpen={showChannelDetails}
          setIsOpen={setShowChannelDetails}
        />
      )}

      <IconButton
        sx={iconButtonSx}
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

export default ChannelTopNav;
