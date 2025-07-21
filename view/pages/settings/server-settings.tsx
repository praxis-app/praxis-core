import {
  AdminPanelSettings,
  Close,
  Extension,
  Link,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TopNav from '../../components/nav/top-nav';
import PermissionDenied from '../../components/roles/permission-denied';
import SettingsNavItem from '../../components/settings/settings-nav-item';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';

const ServerSettings = () => {
  const { setIsNavDrawerOpen } = useAppStore((state) => state);

  const { t } = useTranslation();
  const isAboveMd = useAboveBreakpoint('md');
  const navigate = useNavigate();
  const ability = useAbility();

  const canManageSettings = ability.can('manage', 'ServerConfig');
  const canManageRoles = ability.can('manage', 'Role') && canManageSettings;
  const canManageInvites = ability.can('manage', 'Invite') && canManageSettings;
  const canCreateInvites = ability.can('create', 'Invite') && canManageSettings;

  if (!canManageSettings) {
    return (
      <PermissionDenied
        topNavProps={{
          header: t('navigation.serverSettings'),
          onBackClick: () => navigate(NavigationPaths.Home),
        }}
      />
    );
  }

  const handleBackClick = () => {
    if (isAboveMd) {
      navigate(NavigationPaths.Home);
      return;
    }
    setIsNavDrawerOpen(true);
  };

  return (
    <>
      <TopNav
        header={t('navigation.serverSettings')}
        onBackClick={handleBackClick}
        backBtnIcon={<Close />}
      />

      <Box display="flex" flexDirection="column" gap="16px">
        <SettingsNavItem
          Icon={AdminPanelSettings}
          disabled={!canManageRoles}
          onClick={() => navigate(NavigationPaths.Roles)}
          label={t('navigation.roles')}
        />

        <SettingsNavItem
          Icon={Extension}
          onClick={() => navigate(NavigationPaths.Integrations)}
          label={t('settings.labels.integrations')}
        />

        <SettingsNavItem
          Icon={Link}
          disabled={!canManageInvites && !canCreateInvites}
          onClick={() => navigate(NavigationPaths.Invites)}
          label={t('navigation.invites')}
        />
      </Box>
    </>
  );
};

export default ServerSettings;
