import { api } from '@/client/api-client';
import { useAppStore } from '@/store/app.store';
import { useQuery } from '@tanstack/react-query';
import { useMeQuery } from './use-me-query';
import { NavigationPaths } from '@/constants/shared.constants';

export const useSignUpData = () => {
  const { isLoggedIn, inviteToken } = useAppStore((state) => state);

  const { data } = useQuery({
    queryKey: ['is-first-user'],
    queryFn: api.isFirstUser,
    enabled: !isLoggedIn,
  });

  const { data: meData } = useMeQuery({
    enabled: isLoggedIn,
  });

  const me = meData?.user;
  const isAnon = !!me && me.anonymous === true;
  const isRegistered = !!me && me.anonymous === false;
  const isFirstUser = !!data?.isFirstUser;
  const isInvited = !!inviteToken;

  const signUpPath =
    isFirstUser || !inviteToken
      ? NavigationPaths.SignUp
      : `${NavigationPaths.SignUp}/${inviteToken}`;

  const getShowSignUp = () => {
    if (isAnon) {
      return true;
    }
    if (isLoggedIn) {
      return false;
    }
    return isFirstUser || isInvited;
  };

  return {
    isAnon,
    isRegistered,
    isInvited: !!inviteToken,
    isFirstUser: data?.isFirstUser,
    showSignUp: getShowSignUp(),
    inviteToken,
    signUpPath,
    me,
  };
};
