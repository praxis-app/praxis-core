import { ExpandMore, Settings } from '@mui/icons-material';
import { Box, Button, IconButton, SxProps, Typography } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import appIconImg from '../../../assets/images/app-icon.png';
import { NavigationPaths } from '../../../constants/shared.constants';
import { useAbility } from '../../../hooks/role.hooks';
import { useIsDarkMode } from '../../../hooks/shared.hooks';
import { useSignUpData } from '../../../hooks/user.hooks';
import { useAppStore } from '../../../store/app.store';
import { GRAY } from '../../../styles/theme';
import { CurrentUser } from '../../../types/user.types';
import ConfirmLogoutModal from '../../auth/confirm-logout-modal';
import ChannelList from '../../channels/channel-list';
import CreateChannelModal from '../../channels/create-channel-modal';
import LazyLoadImage from '../../images/lazy-load-image';
import UserAvatar from '../../users/user-avatar';
import LeftNavServerMenu from './left-nav-server-menu';
import LeftNavUserMenu from './left-nav-user-menu';

interface Props {
  me?: CurrentUser;
}

/** Left panel navigation for desktop */
const LeftNav = ({ me }: Props) => {
  const { setToast } = useAppStore((state) => state);

  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [serverMenuEl, setServerMenuEl] = useState<HTMLElement | null>(null);
  const [userMenuEl, setUserMenuEl] = useState<HTMLElement | null>(null);
  const [isLogOutModalOpen, setIsLogOutModalOpen] = useState(false);

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();
  const ability = useAbility();

  const { signUpPath } = useSignUpData();

  const canManageSettings = ability.can('manage', 'ServerConfig');
  const canManageChannels = ability.can('manage', 'Channel');
  const isServerMenuBtnDisabled = !canManageSettings && !canManageChannels;

  const menuButtonSx: SxProps = {
    cursor: 'pointer',
    userSelect: 'none',
    height: '55px',
    borderBottom: '1px solid',
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50],
    color: 'text.primary',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '12px',
    borderRadius: 0,
    width: '100%',
    '&:disabled': {
      color: 'text.primary',
    },
  };
  const onlineBadge: SxProps = {
    bgcolor: '#50a361',
    border: '2.5px solid',
    borderColor: 'background.paper',
    borderRadius: 9999,
    height: 15,
    width: 15,
    position: 'absolute',
    top: 20,
    right: -5,
  };

  const handleServerMenuBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    setServerMenuEl(event.currentTarget);
  };

  const handleUserMenuBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    setUserMenuEl(event.currentTarget);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="240px"
      bgcolor="background.paper"
      borderRight="1px solid"
      borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
    >
      <Button
        onClick={handleServerMenuBtnClick}
        disabled={isServerMenuBtnDisabled}
        sx={menuButtonSx}
      >
        <Box display="flex" gap="8px">
          <LazyLoadImage
            alt={t('labels.appIcon')}
            width="25px"
            height="auto"
            src={appIconImg}
            skipAnimation
          />
          <Typography fontWeight={700} fontSize="16px">
            {t('brand')}
          </Typography>
        </Box>

        {!isServerMenuBtnDisabled && <ExpandMore sx={{ fontSize: '22px' }} />}
      </Button>

      <LeftNavServerMenu
        anchorEl={serverMenuEl}
        setAnchorEl={setServerMenuEl}
        setShowCreateChannelModal={setShowCreateChannelModal}
      />

      <CreateChannelModal
        isOpen={showCreateChannelModal}
        setIsOpen={setShowCreateChannelModal}
      />

      <ChannelList me={me} />

      <Box
        borderTop="1px solid"
        borderColor={isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}
        minHeight="58px"
        padding={0.8}
      >
        {me ? (
          <Box display="flex" justifyContent="space-between">
            <Button
              sx={{
                gap: '8px',
                minWidth: '115px',
                justifyContent: 'start',
                color: 'text.primary',
              }}
              onClick={handleUserMenuBtnClick}
            >
              <Box position="relative">
                <UserAvatar
                  userId={me.id}
                  userName={me.name}
                  sx={{ fontSize: '14px', alignSelf: 'center' }}
                  size={30}
                />
                <Box sx={onlineBadge} />
              </Box>
              <Box textAlign="left" alignSelf="center">
                <Box lineHeight={1.25} fontSize="14px">
                  {me.name}
                </Box>
                <Box color="text.secondary" lineHeight={1.25} fontSize="12px">
                  {t('users.labels.online')}
                </Box>
              </Box>
            </Button>

            <IconButton
              sx={{ height: '40px', alignSelf: 'center' }}
              onClick={() =>
                setToast({ title: t('prompts.inDev'), status: 'info' })
              }
            >
              <Settings sx={{ color: 'text.secondary' }} />
            </IconButton>

            <LeftNavUserMenu
              me={me}
              anchorEl={userMenuEl}
              setAnchorEl={setUserMenuEl}
              setIsLogOutModalOpen={setIsLogOutModalOpen}
            />

            <ConfirmLogoutModal
              isOpen={isLogOutModalOpen}
              setIsOpen={setIsLogOutModalOpen}
            />
          </Box>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="98%"
            gap="8px"
          >
            <Button
              sx={{ color: 'text.primary' }}
              onClick={() => navigate(NavigationPaths.Login)}
            >
              {t('users.actions.logIn')}
            </Button>
            <Button
              sx={{ color: 'text.primary' }}
              onClick={() => navigate(signUpPath)}
            >
              {t('users.actions.signUp')}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LeftNav;
