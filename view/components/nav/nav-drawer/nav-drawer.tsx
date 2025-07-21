import { ChevronRight, ExitToApp, PersonAdd, Tag } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import appIconImg from '../../../assets/images/app-icon.png';
import { api } from '../../../client/api-client';
import { GENERAL_CHANNEL_NAME } from '../../../constants/channel.constants';
import { NavigationPaths } from '../../../constants/shared.constants';
import { useAbility } from '../../../hooks/role.hooks';
import { useAboveBreakpoint, useIsDarkMode } from '../../../hooks/shared.hooks';
import { useMeQuery, useSignUpData } from '../../../hooks/user.hooks';
import { useAppStore } from '../../../store/app.store';
import { GRAY } from '../../../styles/theme';
import ConfirmLogoutModal from '../../auth/confirm-logout-modal';
import LazyLoadImage from '../../images/lazy-load-image';
import UserAvatar from '../../users/user-avatar';
import NavDrawerServerMenu from './nav-drawer-server-menu';
import NavDrawerUserMenu from './nav-drawer-user-menu';

const NavDrawer = () => {
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);

  const { isNavDrawerOpen, setIsNavDrawerOpen, isLoggedIn } = useAppStore(
    (state) => state,
  );

  const { t } = useTranslation();
  const navigate = useNavigate();
  const ability = useAbility();
  const isDarkMode = useIsDarkMode();
  const isAboveMd = useAboveBreakpoint('md');

  const { data: meData, isLoading: isMeLoading } = useMeQuery({
    enabled: !isAboveMd && isLoggedIn,
  });

  const { signUpPath, showSignUp, isAnon } = useSignUpData();

  const me = meData?.user;
  const isRegistered = !!me && !isAnon;

  const canManageChannels = ability.can('manage', 'Channel');
  const canManageSettings = ability.can('manage', 'ServerConfig');
  const isServerBtnDisabled = !canManageSettings && !canManageChannels;

  const { data: channelsData, isLoading: isChannalsLoading } = useQuery({
    queryKey: ['channels'],
    queryFn: api.getChannels,
    enabled: !isAboveMd && isRegistered,
  });

  const { data: generalChannelData } = useQuery({
    queryKey: ['channels', GENERAL_CHANNEL_NAME],
    queryFn: () => api.getGeneralChannel(),
    enabled: !isMeLoading && !isRegistered,
  });

  const leftDrawerSx: SxProps = {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(25px)',
    },
  };

  const handleNavigate = async (path: string) => {
    setIsServerMenuOpen(false);
    setIsNavDrawerOpen(false);
    navigate(path);
  };

  const handleMenuButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  if (isAboveMd) {
    return null;
  }

  return (
    <>
      <Drawer
        anchor="left"
        open={isNavDrawerOpen}
        onClose={() => {
          setIsServerMenuOpen(false);
          setIsNavDrawerOpen(false);
        }}
        PaperProps={{
          sx: {
            width: '100%',
            bgcolor: isDarkMode ? GRAY['900'] : GRAY['50'],
          },
        }}
        sx={leftDrawerSx}
      >
        <Box
          display="flex"
          alignItems="center"
          paddingLeft={1}
          height="55px"
          justifyContent="space-between"
          paddingX="16px"
          paddingTop="12px"
        >
          <Button
            sx={{
              gap: '8px',
              borderRadius: '8px',
              alignItems: 'center',
              color: 'text.primary',
              '&:disabled': { color: 'text.primary' },
            }}
            disabled={isServerBtnDisabled}
            onClick={() => setIsServerMenuOpen(true)}
          >
            <LazyLoadImage
              alt="App icon"
              width="35px"
              height="auto"
              src={appIconImg}
              sx={{ cursor: 'pointer' }}
              skipAnimation
            />
            <Typography fontWeight={700} fontSize="18px">
              {t('brand')}
            </Typography>

            {!isServerBtnDisabled && (
              <ChevronRight
                sx={{ color: 'text.secondary', marginTop: '2px' }}
                fontSize="small"
              />
            )}
          </Button>

          {me && (
            <>
              <IconButton onClick={handleMenuButtonClick}>
                <UserAvatar
                  userId={me.id}
                  userName={me.name}
                  sx={{ fontSize: '16px' }}
                  size={35}
                />
              </IconButton>

              <NavDrawerUserMenu
                anchorEl={menuAnchorEl}
                handleClose={handleClose}
                setIsLogOutModalOpen={setIsLogOutModalOpen}
                me={me}
              />
            </>
          )}
        </Box>

        <Box
          paddingTop="8px"
          bgcolor={isDarkMode ? GRAY['800'] : 'background.paper'}
          sx={{ borderTopRightRadius: '16px', borderTopLeftRadius: '16px' }}
          marginTop="12px"
          height="100%"
        >
          {!isChannalsLoading && channelsData && (
            <List>
              {channelsData.channels.map((channel) => (
                <ListItemButton
                  key={channel.id}
                  onClick={() =>
                    handleNavigate(`${NavigationPaths.Channels}/${channel.id}`)
                  }
                >
                  <ListItemIcon sx={{ minWidth: '33px' }}>
                    <Tag />
                  </ListItemIcon>
                  <ListItemText primary={channel.name} />
                </ListItemButton>
              ))}
            </List>
          )}

          {/* Show general channel for unregistered users */}
          {!isRegistered && generalChannelData && (
            <List>
              <ListItemButton
                onClick={() => handleNavigate(NavigationPaths.Home)}
              >
                <ListItemIcon sx={{ minWidth: '33px' }}>
                  <Tag />
                </ListItemIcon>
                <ListItemText primary={generalChannelData.channel.name} />
              </ListItemButton>
            </List>
          )}

          {(showSignUp || !isLoggedIn) && (
            <List>
              <Divider sx={{ marginX: '16px', marginBottom: '16px' }} />

              {showSignUp && (
                <ListItemButton onClick={() => handleNavigate(signUpPath)}>
                  <ListItemIcon>
                    <PersonAdd />
                  </ListItemIcon>
                  <ListItemText primary={t('users.actions.signUp')} />
                </ListItemButton>
              )}

              {!isLoggedIn && (
                <ListItemButton
                  onClick={() => handleNavigate(NavigationPaths.Login)}
                >
                  <ListItemIcon>
                    <ExitToApp />
                  </ListItemIcon>
                  <ListItemText primary={t('users.actions.logIn')} />
                </ListItemButton>
              )}
            </List>
          )}
        </Box>

        <ConfirmLogoutModal
          isOpen={isLogOutModalOpen}
          setIsOpen={setIsLogOutModalOpen}
        />
      </Drawer>

      <NavDrawerServerMenu
        isOpen={isServerMenuOpen}
        setIsOpen={setIsServerMenuOpen}
        setIsNavDrawerOpen={setIsNavDrawerOpen}
        handleNavigate={handleNavigate}
      />
    </>
  );
};

export default NavDrawer;
