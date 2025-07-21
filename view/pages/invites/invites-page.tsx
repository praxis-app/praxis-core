import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import InviteCard from '../../components/invites/invite-card';
import InviteRow from '../../components/invites/invite-row';
import TopNav from '../../components/nav/top-nav';
import PermissionDenied from '../../components/roles/permission-denied';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths, Time } from '../../constants/shared.constants';
import { useAbility } from '../../hooks/role.hooks';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { Invite } from '../../types/invite.types';

const MAX_USES_OPTIONS = [1, 5, 10, 25, 50, 100];

interface FormValues {
  expiresAt: string;
  maxUses: string;
}

const InvitesPage = () => {
  const { isLoggedIn } = useAppStore((state) => state);

  const { t } = useTranslation();
  const isAboveMd = useAboveBreakpoint('md');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const ability = useAbility();

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: { expiresAt: '', maxUses: '' },
    mode: 'onChange',
  });

  const getFormattedExpiresAt = (expiresAt: string) => {
    if (expiresAt === '') {
      return;
    }
    return new Date(Date.now() + Number(expiresAt) * 1000);
  };

  const { mutate: createInvite, isPending: isCreatePending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const { invite } = await api.createInvite({
        expiresAt: getFormattedExpiresAt(data.expiresAt),
        maxUses: Number(data.maxUses) || undefined,
      });

      queryClient.setQueryData<{ invites: Invite[] }>(
        ['invites'],
        (oldData) => {
          if (!oldData) {
            return { invites: [] };
          }
          return { invites: [invite, ...oldData.invites] };
        },
      );
    },
    onSuccess: () => reset(),
  });

  const {
    data: invitesData,
    isLoading: isInvitesLoading,
    error: invitesError,
  } = useQuery({
    queryKey: ['invites'],
    queryFn: api.getInvites,
    enabled: isLoggedIn,
  });

  const expiresAtOptions = [
    {
      message: t('invites.form.expiresAtOptions.oneDay'),
      value: Time.Day,
    },
    {
      message: t('invites.form.expiresAtOptions.sevenDays'),
      value: Time.Week,
    },
    {
      message: t('invites.form.expiresAtOptions.oneMonth'),
      value: Time.Month,
    },
    {
      message: t('invites.form.expiresAtOptions.never'),
      value: '',
    },
  ];

  const showInvitesTable =
    invitesData && !!invitesData.invites.length && isAboveMd;
  const showInviteCards = invitesData && !isAboveMd;

  const canManageInvites = ability.can('manage', 'Invite');
  const canCreateInvites = ability.can('create', 'Invite');

  if (!isLoggedIn || (!canManageInvites && !canCreateInvites)) {
    return (
      <PermissionDenied
        topNavProps={{
          header: t('invites.headers.serverInvites'),
          onBackClick: () => navigate(NavigationPaths.Settings),
        }}
      />
    );
  }

  if (isInvitesLoading) {
    return <ProgressBar />;
  }

  return (
    <>
      <TopNav
        header={t('invites.headers.serverInvites')}
        onBackClick={() => navigate(NavigationPaths.Settings)}
      />

      {canCreateInvites && (
        <Card sx={{ marginBottom: '12px' }}>
          <CardContent>
            <form onSubmit={handleSubmit((fv) => createInvite(fv))}>
              <FormGroup sx={{ marginBottom: 1.5 }}>
                <FormControl variant="standard" sx={{ marginBottom: 1 }}>
                  <InputLabel>{t('invites.form.labels.expiresAt')}</InputLabel>

                  <Controller
                    control={control}
                    name="expiresAt"
                    render={({ field }) => (
                      <Select {...field}>
                        {expiresAtOptions.map((option) => (
                          <MenuItem value={option.value} key={option.value}>
                            {option.message}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>

                <FormControl variant="standard">
                  <InputLabel>{t('invites.form.labels.maxUses')}</InputLabel>

                  <Controller
                    control={control}
                    name="maxUses"
                    render={({ field }) => (
                      <Select {...field}>
                        {MAX_USES_OPTIONS.map((option) => (
                          <MenuItem value={option} key={option}>
                            {t('invites.form.maxUsesOptions.xUses', {
                              count: option,
                            })}
                          </MenuItem>
                        ))}
                        <MenuItem value={''}>
                          {t('invites.form.maxUsesOptions.noLimit')}
                        </MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </FormGroup>

              <Box display="flex" justifyContent="end">
                <PrimaryButton
                  sx={{ marginTop: 1.5 }}
                  disabled={isCreatePending}
                  type="submit"
                >
                  {t('invites.actions.generateLink')}
                </PrimaryButton>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {showInviteCards && (
        <Box display="flex" flexDirection="column" gap="12px">
          {invitesData.invites.map((invite) => (
            <InviteCard key={invite.id} invite={invite} />
          ))}
        </Box>
      )}

      {showInvitesTable && (
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('invites.columnNames.inviter')}</TableCell>
                <TableCell>{t('invites.columnNames.code')}</TableCell>
                <TableCell>{t('invites.columnNames.uses')}</TableCell>
                <TableCell>{t('invites.columnNames.expires')}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invitesData.invites.map((invite) => (
                <InviteRow key={invite.id} invite={invite} />
              ))}

              {/* TODO: Decide whether or not to remove */}
              {invitesData.invites.length === 0 && (
                <TableRow sx={{ td: { border: 0 } }}>
                  <TableCell colSpan={5}>
                    <Typography>{t('invites.prompts.noInvites')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {invitesError && (
        <Typography>{t('errors.somethingWentWrong')}</Typography>
      )}
    </>
  );
};

export default InvitesPage;
