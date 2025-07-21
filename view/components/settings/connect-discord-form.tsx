import {
  Alert,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { api } from '../../client/api-client';
import PrimaryButton from '../../components/shared/primary-button';
import { useAppStore } from '../../store/app.store';
import {
  ConnectDiscordBotReq,
  ServerConfig,
} from '../../types/server-config.types';
import Modal from '../shared/modal';

const DISCORD_OAUTH_URL =
  'https://discord.com/oauth2/authorize?permissions=0&integration_type=0&scope=bot+applications.commands';

interface Props {
  serverConfig: ServerConfig;
}

const ConnectDiscordForm = ({ serverConfig }: Props) => {
  const { setToast } = useAppStore((state) => state);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<ConnectDiscordBotReq>({
    mode: 'onChange',
    defaultValues: {
      botClientId: serverConfig.botClientId || '',
      botApiUrl: serverConfig.botApiUrl || '',
    },
  });

  const isConnected = Boolean(
    serverConfig.botClientId && serverConfig.botApiUrl,
  );

  const { mutate: connectBot, isPending: isConnecting } = useMutation({
    mutationFn: async (values: ConnectDiscordBotReq) => {
      await api.connectDiscordBot(values);

      queryClient.setQueryData<{ serverConfig: ServerConfig }>(
        ['serverConfig'],
        (oldData) => {
          return {
            serverConfig: {
              ...oldData?.serverConfig,
              botClientId: values.botClientId,
              botApiUrl: values.botApiUrl,
            },
          };
        },
      );

      reset({
        botClientId: values.botClientId,
        botApiUrl: values.botApiUrl,
      });

      window.open(
        `${DISCORD_OAUTH_URL}&client_id=${values.botClientId}`,
        '_blank',
      );
    },
    onError(error: AxiosError) {
      const errorMessage =
        (error.response?.data as string) || t('errors.somethingWentWrong');

      setToast({
        title: errorMessage,
        status: 'error',
      });
    },
  });

  const { mutate: disconnectBot, isPending: isDisconnecting } = useMutation({
    mutationFn: async () => {
      await api.disconnectDiscordBot();

      queryClient.setQueryData<{ serverConfig: ServerConfig }>(
        ['serverConfig'],
        (oldData) => {
          return {
            serverConfig: {
              ...oldData?.serverConfig,
              botClientId: null,
              botApiUrl: null,
            },
          };
        },
      );

      reset({
        botClientId: '',
        botApiUrl: '',
      });

      setToast({
        title: t('settings.messages.discordDisconnected'),
        status: 'success',
      });
    },
    onError(error: AxiosError) {
      const errorMessage =
        (error.response?.data as string) || t('errors.somethingWentWrong');

      setToast({
        title: errorMessage,
        status: 'error',
      });
    },
  });

  const handleDisconnect = () => {
    setShowDisconnectModal(false);
    disconnectBot();
  };

  return (
    <>
      {isConnected ? (
        <Box mb={2.5}>
          <Alert
            severity="success"
            sx={{ '& .MuiAlert-icon .MuiSvgIcon-root': { fill: '#66bb6a' } }}
            action={
              <Button
                sx={{ color: 'inherit' }}
                onClick={() => setShowDisconnectModal(true)}
                disabled={isDisconnecting}
              >
                {t('settings.actions.disconnect')}
              </Button>
            }
          >
            <AlertTitle>{t('settings.messages.discordConnected')}</AlertTitle>
            {t('settings.messages.discordBotActive')}
          </Alert>
        </Box>
      ) : (
        <Box mb={2.5}>
          <Alert
            severity="info"
            sx={{ '& .MuiAlert-icon .MuiSvgIcon-root': { fill: '#29b5f6' } }}
          >
            {t('settings.messages.discordNotConnected')}
          </Alert>
        </Box>
      )}

      <form onSubmit={handleSubmit((fv) => connectBot(fv))}>
        <FormGroup sx={{ marginBottom: 1.5 }}>
          <FormControl sx={{ marginBottom: 2 }}>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 1 }}>
              {t('settings.labels.discordClientId')}
            </FormLabel>
            <OutlinedInput
              autoComplete="off"
              placeholder={t('settings.placeholders.discordClientId')}
              disabled={isConnected}
              {...register('botClientId')}
            />
            <Typography variant="caption" color="text.secondary" mt={0.5}>
              {t('settings.help.discordClientId')}
            </Typography>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ fontWeight: 500, paddingBottom: 1 }}>
              {t('settings.labels.discordBotApiUrl')}
            </FormLabel>
            <OutlinedInput
              autoComplete="off"
              placeholder={t('settings.placeholders.discordBotApiUrl')}
              disabled={isConnected}
              {...register('botApiUrl')}
            />
            <Typography variant="caption" color="text.secondary" mt={0.5}>
              {t('settings.help.discordBotApiUrl')}
            </Typography>
          </FormControl>
        </FormGroup>

        {!isConnected && (
          <Box display="flex" justifyContent="end">
            <PrimaryButton
              disabled={isConnecting}
              sx={{ marginTop: 1.5 }}
              type="submit"
            >
              {t('settings.actions.connectDiscord')}
            </PrimaryButton>
          </Box>
        )}
      </form>

      <Modal
        open={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        title={t('settings.dialogs.disconnectDiscord.title')}
      >
        <Typography marginBottom={3}>
          {t('settings.dialogs.disconnectDiscord.message')}
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            onClick={() => setShowDisconnectModal(false)}
            variant="contained"
          >
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleDisconnect} variant="contained">
            {t('settings.actions.disconnect')}
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ConnectDiscordForm;
