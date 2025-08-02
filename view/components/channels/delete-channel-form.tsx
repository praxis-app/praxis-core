import { api } from '@/client/api-client';
import { NavigationPaths } from '@/constants/shared.constants';
import { Channel } from '@/types/channel.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface DeleteChannelFormSubmitButtonProps {
  isSubmitting: boolean;
}

interface DeleteChannelFormProps {
  channel: Channel;
  submitButton: (props: DeleteChannelFormSubmitButtonProps) => ReactNode;
  onSubmit?(): void;
}

export const DeleteChannelFormSubmitButton = ({
  isSubmitting,
}: DeleteChannelFormSubmitButtonProps) => {
  const { t } = useTranslation();
  return (
    <Button type="submit" variant="destructive" disabled={isSubmitting}>
      {isSubmitting ? t('actions.deleting') : t('actions.delete')}
    </Button>
  );
};

export const DeleteChannelForm = ({
  channel,
  submitButton,
  onSubmit,
}: DeleteChannelFormProps) => {
  const { channelId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteChannel, isPending } = useMutation({
    mutationFn: async () => {
      await api.deleteChannel(channel.id);

      queryClient.setQueryData<{ channels: Channel[] }>(
        ['channels'],
        (oldData) => {
          if (!oldData) {
            return { channels: [] };
          }
          return {
            channels: oldData.channels.filter((c) => c.id !== channel.id),
          };
        },
      );

      onSubmit?.();

      if (channelId === channel.id) {
        navigate(NavigationPaths.Home);
      }
    },
    onError(error: AxiosError) {
      const errorMessage =
        (error.response?.data as string) || t('errors.somethingWentWrong');
      toast(errorMessage);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        deleteChannel();
      }}
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">#{channel.name}</p>
        <div className="flex justify-end">
          {submitButton({ isSubmitting: isPending })}
        </div>
      </div>
    </form>
  );
};
