import { api } from '@/client/api-client';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { ChannelSkeleton } from '@/components/channels/channel-skeleton';
import { TopNav } from '@/components/nav/top-nav';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '@/constants/shared.constants';
import { useSignUpData } from '@/hooks/use-sign-up-data';
import { useAppStore } from '@/store/app.store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const SignUp = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isLoggedIn, setInviteToken } = useAppStore();

  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  const { isFirstUser, isAnon, isRegistered, me } = useSignUpData();

  const { isLoading: isInviteLoading, error: inviteError } = useQuery({
    queryKey: ['invites', token],
    queryFn: async () => {
      const { invite } = await api.getInvite(token!);
      localStorage.setItem(LocalStorageKeys.InviteToken, invite.token);
      setInviteToken(invite.token);
      return invite;
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (me && !isAnon) {
      navigate(NavigationPaths.Home);
      setIsRedirecting(true);
    }
  }, [me, navigate, setIsRedirecting, isAnon]);

  if (inviteError) {
    return <p>{t('invites.prompts.expiredOrInvalid')}</p>;
  }

  if (isRedirecting || isRegistered || isInviteLoading) {
    return <ChannelSkeleton />;
  }

  if (isLoggedIn && !isAnon) {
    return (
      <>
        <TopNav />
        <p>{t('auth.prompts.alreadyRegistered')}</p>
      </>
    );
  }

  if (!token && !isFirstUser && !isAnon) {
    return (
      <>
        <TopNav />
        <p>{t('invites.prompts.inviteRequired')}</p>
      </>
    );
  }

  return (
    <>
      <TopNav />

      <div className="flex h-full flex-col items-center justify-center p-3 pt-4 md:p-18">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              {t('auth.actions.createAccount')}
            </CardTitle>
            <CardDescription className="text-center">
              {isAnon
                ? t('auth.prompts.upgradeAccount')
                : t('auth.prompts.enterDetails')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm setIsRedirecting={setIsRedirecting} />

            {!isAnon && (
              <div className="text-muted-foreground text-center text-sm">
                {t('auth.prompts.alreadyHaveAccount')}{' '}
                <Link
                  to={NavigationPaths.Login}
                  className="text-primary font-medium hover:underline"
                >
                  {t('auth.actions.signIn')}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
