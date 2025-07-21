import {
  Card,
  CardContent as MuiCardContent,
  styled,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/nav/top-nav';
import PermissionDenied from '../../components/roles/permission-denied';
import Role from '../../components/roles/role';
import RoleForm from '../../components/roles/role-form';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';

const CardContent = styled(MuiCardContent)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,

  padding: 10,
  '&:last-child': {
    paddingBottom: 10,
  },
}));

const ServerRoles = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['roles'],
    queryFn: api.getRoles,
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const ability = useAbility();

  if (!ability.can('manage', 'Role')) {
    return (
      <PermissionDenied
        topNavProps={{
          header: t('roles.headers.serverRoles'),
          onBackClick: () => navigate(NavigationPaths.Settings),
        }}
      />
    );
  }

  if (isPending) {
    return <ProgressBar />;
  }

  return (
    <>
      <TopNav
        header={t('roles.headers.serverRoles')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />

      <RoleForm />

      {data && (
        <Card sx={{ marginTop: '16px' }}>
          <CardContent>
            {data.roles.map((role) => (
              <Role key={role.id} role={role} />
            ))}
          </CardContent>
        </Card>
      )}

      {error && <Typography>{t('errors.somethingWentWrong')}</Typography>}
    </>
  );
};

export default ServerRoles;
