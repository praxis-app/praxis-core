import { AddCircle, Settings } from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  PaperProps,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationPaths } from '../../../constants/shared.constants';
import { useAbility } from '../../../hooks/role.hooks';
import { useIsDarkMode } from '../../../hooks/shared.hooks';
import { GRAY } from '../../../styles/theme';
import CreateChannelModal from '../../channels/create-channel-modal';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  handleNavigate(path: string): void;
  setIsNavDrawerOpen(isOpen: boolean): void;
}

const NavDrawerServerMenu = ({
  isOpen,
  setIsOpen,
  setIsNavDrawerOpen,
  handleNavigate,
}: Props) => {
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

  const { t } = useTranslation();
  const ability = useAbility();
  const isDarkMode = useIsDarkMode();

  const canManageChannels = ability.can('manage', 'Channel');
  const canManageSettings = ability.can('manage', 'ServerConfig');

  const bottomDrawerProps: PaperProps = {
    sx: {
      height: 'calc(100% - 68px)',
      bgcolor: isDarkMode ? GRAY['900'] : 'background.paper',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      paddingTop: '12px',
      paddingX: '16px',
    },
  };

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      PaperProps={bottomDrawerProps}
    >
      <List>
        {canManageChannels && (
          <ListItemButton onClick={() => setShowCreateChannelModal(true)}>
            <ListItemIcon>
              <AddCircle />
            </ListItemIcon>
            <ListItemText primary={t('channels.actions.createChannel')} />
          </ListItemButton>
        )}

        {canManageSettings && (
          <ListItemButton
            onClick={() => handleNavigate(NavigationPaths.Settings)}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={t('navigation.serverSettings')} />
          </ListItemButton>
        )}
      </List>

      <CreateChannelModal
        isOpen={showCreateChannelModal}
        setIsOpen={setShowCreateChannelModal}
        onSubmit={() => {
          setIsOpen(false);
          setIsNavDrawerOpen(false);
        }}
      />
    </Drawer>
  );
};

export default NavDrawerServerMenu;
