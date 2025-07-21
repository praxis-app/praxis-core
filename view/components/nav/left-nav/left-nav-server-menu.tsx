import { AddCircle, Settings } from '@mui/icons-material';
import { Menu, MenuItem, SvgIconProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { NavigationPaths } from '../../../constants/shared.constants';
import { useAbility } from '../../../hooks/role.hooks';

interface Props {
  anchorEl: HTMLElement | null;
  setAnchorEl(el: HTMLElement | null): void;
  setShowCreateChannelModal(isOpen: boolean): void;
}

const LeftNavServerMenu = ({
  anchorEl,
  setAnchorEl,
  setShowCreateChannelModal,
}: Props) => {
  const { t } = useTranslation();
  const ability = useAbility();
  const navigate = useNavigate();

  const menuItemIconProps: SvgIconProps = {
    sx: { marginRight: 1 },
    fontSize: 'small',
  };

  const handleCreateChannelBtnClick = () => {
    setShowCreateChannelModal(true);
    setAnchorEl(null);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      onClick={() => setAnchorEl(null)}
      onClose={() => setAnchorEl(null)}
      open={!!anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      transformOrigin={{ horizontal: -18, vertical: -15 }}
      keepMounted
    >
      {ability.can('manage', 'ServerConfig') && (
        <MenuItem onClick={() => navigate(NavigationPaths.Settings)}>
          <Settings {...menuItemIconProps} />
          {t('navigation.serverSettings')}
        </MenuItem>
      )}

      {ability.can('manage', 'Channel') && (
        <MenuItem onClick={handleCreateChannelBtnClick}>
          <AddCircle {...menuItemIconProps} />
          {t('channels.actions.createChannel')}
        </MenuItem>
      )}
    </Menu>
  );
};

export default LeftNavServerMenu;
