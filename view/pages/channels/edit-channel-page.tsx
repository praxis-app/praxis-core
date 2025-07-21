import { Close } from '@mui/icons-material';
import { Box, Card, CardContent } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import ChannelFormFields from '../../components/channels/channel-form-fields';
import ConfirmDeleteChannelModal from '../../components/channels/confirm-delete-channel-modal';
import TopNav from '../../components/nav/top-nav';
import DeleteButton from '../../components/shared/delete-button';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import { NavigationPaths } from '../../constants/shared.constants';
import { useAppStore } from '../../store/app.store';
import { UpdateChannelReq } from '../../types/channel.types';

const EditChannelPage = () => {
  const { setToast } = useAppStore((state) => state);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { channelId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, formState, reset, handleSubmit } =
    useForm<UpdateChannelReq>({
      mode: 'onChange',
    });

  const { data, isLoading } = useQuery({
    queryKey: ['channels', channelId],
    queryFn: async () => {
      const result = await api.getChannel(channelId!);
      reset({ name: result.channel.name });
      return result;
    },
    enabled: !!channelId,
  });

  const { mutate: updateChannel, isPending } = useMutation({
    mutationFn: async (values: UpdateChannelReq) => {
      if (!data) {
        return;
      }
      await api.updateChannel(data.channel.id, values);
      navigate(`${NavigationPaths.Channels}/${channelId}`);
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

  if (isLoading) {
    return <ProgressBar />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <TopNav
        header={t('channels.headers.channelSettings')}
        onBackClick={() => navigate(`${NavigationPaths.Channels}/${channelId}`)}
        backBtnIcon={<Close />}
      />

      <Card sx={{ marginBottom: '12px' }}>
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit((fv) => updateChannel(fv))}
          >
            <ChannelFormFields register={register} />

            <Box display="flex" justifyContent="right" gap="16px">
              <PrimaryButton
                type="submit"
                sx={{ borderRadius: '4px' }}
                disabled={isPending || !formState.dirtyFields.name}
              >
                {t('actions.save')}
              </PrimaryButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <DeleteButton onClick={() => setIsConfirmDeleteOpen(true)}>
        {t('channels.actions.deleteChannel')}
      </DeleteButton>

      {!!channelId && (
        <ConfirmDeleteChannelModal
          channelId={channelId}
          isOpen={isConfirmDeleteOpen}
          setIsOpen={setIsConfirmDeleteOpen}
        />
      )}
    </>
  );
};

export default EditChannelPage;
