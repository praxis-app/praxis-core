import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import { NavigationPaths } from '../../constants/shared.constants';
import { Channel } from '../../types/channel.types';
import Modal from '../shared/modal';

interface Props {
  isOpen: boolean;
  setIsOpen(isOpen: boolean): void;
  channelId: string;
}

const ConfirmDeleteChannelModal = ({ channelId, isOpen, setIsOpen }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteChannel, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      await api.deleteChannel(channelId);

      queryClient.setQueryData<{ channels: Channel[] }>(
        ['channels'],
        (oldData) => {
          if (!oldData) {
            return { channels: [] };
          }
          return {
            channels: oldData.channels.filter(
              (channel) => channel.id !== channelId,
            ),
          };
        },
      );
    },
  });

  const handleDeleteBtnClick = async () => {
    await navigate(NavigationPaths.Home);
    deleteChannel();
  };

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Typography marginBottom={3}>
        {t('prompts.deleteItem', { itemType: 'channel' })}
      </Typography>

      <Box display="flex" gap={1}>
        <Button variant="contained" onClick={() => setIsOpen(false)}>
          {t('actions.cancel')}
        </Button>
        <Button
          variant="contained"
          sx={{ color: '#f44336' }}
          onClick={handleDeleteBtnClick}
          disabled={isDeletePending}
        >
          {t('actions.delete')}
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmDeleteChannelModal;
