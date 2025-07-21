import { Box, Button } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import { useAppStore } from '../../store/app.store';
import { Channel, CreateChannelReq } from '../../types/channel.types';
import Modal from '../shared/modal';
import PrimaryButton from '../shared/primary-button';
import ChannelFormFields from './channel-form-fields';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  onSubmit?(): void;
}

const CreateChannelModal = ({ isOpen, setIsOpen, onSubmit }: Props) => {
  const { setToast } = useAppStore((state) => state);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createChannel, isPending } = useMutation({
    mutationFn: async (values: CreateChannelReq) => {
      const { channel } = await api.createChannel(values);

      queryClient.setQueryData<{ channels: Channel[] }>(
        ['channels'],
        (oldData) => {
          if (!oldData) {
            return { channels: [] };
          }
          return { channels: [...oldData.channels, channel] };
        },
      );

      setIsOpen(false);
      onSubmit?.();

      navigate(`/channels/${channel.id}`);
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

  const { register, formState, handleSubmit } = useForm<CreateChannelReq>({
    mode: 'onChange',
  });

  const { t } = useTranslation();

  return (
    <Modal
      title={t('channels.actions.createChannel')}
      onClose={() => setIsOpen(false)}
      open={isOpen}
    >
      <form onSubmit={handleSubmit((fv) => createChannel(fv))}>
        <ChannelFormFields register={register} />

        <Box display="flex" justifyContent="right" gap="16px">
          <Button
            variant="text"
            sx={{ color: 'text.primary' }}
            onClick={() => setIsOpen(false)}
          >
            {t('actions.cancel')}
          </Button>
          <PrimaryButton
            type="submit"
            sx={{ borderRadius: '4px' }}
            disabled={isPending || !formState.dirtyFields.name}
          >
            {t('actions.create')}
          </PrimaryButton>
        </Box>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
