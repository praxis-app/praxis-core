import { ChannelSkeleton } from '@/components/channels/channel-skeleton';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '../../constants/shared.constants';
import { useAppStore } from '../../store/app.store';

export const InviteCheck = () => {
  const { isLoggedIn, setInviteToken } = useAppStore();

  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(NavigationPaths.Home);
      return;
    }
  }, [isLoggedIn, navigate]);

  const { error } = useQuery({
    queryKey: ['invites', token],
    queryFn: async () => {
      const { invite } = await api.getInvite(token!);
      localStorage.setItem(LocalStorageKeys.InviteToken, invite.token);
      setInviteToken(invite.token);

      await navigate(NavigationPaths.Home);
      return invite;
    },
    enabled: !!token,
  });

  if (!token) {
    return <p>{t('invites.prompts.inviteRequired')}</p>;
  }
  if (error) {
    return <p>{t('invites.prompts.expiredOrInvalid')}</p>;
  }

  return <ChannelSkeleton />;
};
