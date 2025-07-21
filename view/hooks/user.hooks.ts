import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { api } from '../client/api-client';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '../constants/shared.constants';
import { useAppStore } from '../store/app.store';
import { CurrentUser } from '../types/user.types';

export const useMeQuery = (
  options?: Omit<UseQueryOptions<{ user: CurrentUser }>, 'queryKey'>,
) => {
  const { setIsAppLoading, setIsLoggedIn } = useAppStore((state) => state);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const me = await api.getCurrentUser();
        setIsLoggedIn(true);
        return me;
      } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
          localStorage.removeItem(LocalStorageKeys.AccessToken);
          setIsLoggedIn(false);
        }
        throw error;
      } finally {
        setIsAppLoading(false);
      }
    },
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    ...options,
  });
};

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
