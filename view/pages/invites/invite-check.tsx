import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../client/api-client';
import ProgressBar from '../../components/shared/progress-bar';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '../../constants/shared.constants';
import { useAppStore } from '../../store/app.store';

const InviteCheck = () => {
  const { isLoggedIn, setInviteToken } = useAppStore((state) => state);

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
    return <Typography>{t('invites.prompts.inviteRequired')}</Typography>;
  }
  if (error) {
    return <Typography>{t('invites.prompts.expiredOrInvalid')}</Typography>;
  }

  return <ProgressBar />;
};

export default InviteCheck;
