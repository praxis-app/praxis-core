import { ExitToApp } from '@mui/icons-material';
import { Menu, MenuItem, SvgIconProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrentUser } from '../../../types/user.types';
import UserAvatar from '../../users/user-avatar';

interface Props {
  setIsLogOutModalOpen: (value: boolean) => void;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  me: CurrentUser;
}

const NavDrawerUserMenu = ({
  setIsLogOutModalOpen,
  anchorEl,
  handleClose,
  me,
}: Props) => {
  const { t } = useTranslation();

  const menuItemIconProps: SvgIconProps = {
    fontSize: 'small',
    sx: {
      marginRight: 1,
    },
  };

  return (
    <Menu
      anchorEl={anchorEl}
      onClick={handleClose}
      onClose={handleClose}
      open={Boolean(anchorEl)}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      transformOrigin={{
        horizontal: 'right',
        vertical: -4,
      }}
      keepMounted
    >
      <MenuItem sx={{ gap: 1 }}>
        <UserAvatar
          userId={me.id}
          userName={me.name}
          sx={{ fontSize: '10px' }}
          size={20}
        />
        <Typography>{me.name}</Typography>
      </MenuItem>

      <MenuItem onClick={() => setIsLogOutModalOpen(true)}>
        <ExitToApp {...menuItemIconProps} />
        {t('users.actions.logOut')}
      </MenuItem>
    </Menu>
  );
};

export default NavDrawerUserMenu;
