import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { api } from '../client/api-client';
import { useAppStore } from '../store/app.store';
import { Invite } from '../types/invite.types';

export const useDeleteInviteMutation = (inviteId: string) => {
  const { setToast } = useAppStore((state) => state);

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.deleteInvite(inviteId);

      queryClient.setQueryData<{ invites: Invite[] }>(
        ['invites'],
        (oldData) => {
          if (!oldData) {
            return { invites: [] };
          }
          return {
            invites: oldData.invites.filter((invite) => invite.id !== inviteId),
          };
        },
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
};
