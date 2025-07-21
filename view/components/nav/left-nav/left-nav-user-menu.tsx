import { ExitToApp, PersonAdd } from '@mui/icons-material';
import { Menu, MenuItem, SvgIconProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSignUpData } from '../../../hooks/user.hooks';
import { useAppStore } from '../../../store/app.store';
import { CurrentUser } from '../../../types/user.types';
import UserAvatar from '../../users/user-avatar';

interface Props {
  me: CurrentUser;
  anchorEl: HTMLElement | null;
  setAnchorEl(el: HTMLElement | null): void;
  setIsLogOutModalOpen(isOpen: boolean): void;
}

const LeftNavUserMenu = ({
  me,
  anchorEl,
  setAnchorEl,
  setIsLogOutModalOpen,
}: Props) => {
  const { setToast } = useAppStore((state) => state);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUpPath } = useSignUpData();

  const menuItemIconProps: SvgIconProps = {
    sx: { marginRight: 1 },
    fontSize: 'small',
  };

  return (
    <Menu
      anchorEl={anchorEl}
      onClick={() => setAnchorEl(null)}
      onClose={() => setAnchorEl(null)}
      open={!!anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
      transformOrigin={{
        horizontal: -22,
        vertical: me.anonymous ? 158 : 122.5,
      }}
      slotProps={{ paper: { sx: { minWidth: '185px' } } }}
      keepMounted
    >
      <MenuItem
        sx={{ gap: 1 }}
        onClick={() =>
          setToast({
            title: t('prompts.inDev'),
            status: 'info',
          })
        }
      >
        <UserAvatar
          userId={me.id}
          userName={me.name}
          sx={{ fontSize: '10px' }}
          size={20}
        />
        <Typography>{me.name}</Typography>
      </MenuItem>

      {me.anonymous && (
        <MenuItem onClick={() => navigate(signUpPath)}>
          <PersonAdd {...menuItemIconProps} />
          {t('users.actions.signUp')}
        </MenuItem>
      )}

      <MenuItem onClick={() => setIsLogOutModalOpen(true)}>
        <ExitToApp {...menuItemIconProps} />
        {t('users.actions.logOut')}
      </MenuItem>
    </Menu>
  );
};

export default LeftNavUserMenu;
