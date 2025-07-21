// TODO: Add remaining layout and functionality - below is a WIP

import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
  SxProps,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../client/api-client';
import TopNav from '../../components/nav/top-nav';
import PrimaryButton from '../../components/shared/primary-button';
import ProgressBar from '../../components/shared/progress-bar';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '../../constants/shared.constants';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';
import { LoginReq } from '../../types/auth.types';

const Login = () => {
  const { isLoggedIn, setIsLoggedIn, setToast } = useAppStore((state) => state);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { t } = useTranslation();

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: api.login,
    onSuccess({ access_token }) {
      localStorage.setItem(LocalStorageKeys.AccessToken, access_token);
      navigate(NavigationPaths.Home);
      setIsRedirecting(true);
      setIsLoggedIn(true);
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

  const { register, formState, handleSubmit } = useForm<LoginReq>({
    mode: 'onChange',
  });
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();

  const inputBaseSx: SxProps = {
    '&:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 100px ${isDarkMode ? GRAY['750'] : GRAY['100']} inset`,
      WebkitTextFillColor: isDarkMode ? GRAY['100'] : GRAY['950'],
    },
  };
  const showPasswordIconSx: SxProps = {
    color: isDarkMode ? GRAY['300'] : GRAY['800'],
  };

  const renderShowPassword = () => (
    <InputAdornment position="end" sx={{ marginRight: 0.5 }}>
      <IconButton
        onClick={() => setShowPassword(!showPassword)}
        onMouseDown={(e) => e.preventDefault()}
        onMouseUp={(e) => e.preventDefault()}
        edge="end"
      >
        {showPassword ? (
          <VisibilityOff sx={showPasswordIconSx} />
        ) : (
          <Visibility sx={showPasswordIconSx} />
        )}
      </IconButton>
    </InputAdornment>
  );

  if (isRedirecting) {
    return <ProgressBar />;
  }

  if (isLoggedIn) {
    return <Typography>{t('users.prompts.alreadyLoggedIn')}</Typography>;
  }

  return (
    <>
      <TopNav />

      <Card>
        <CardHeader
          subheader={t('users.headers.signIn')}
          subheaderTypographyProps={{
            sx: { fontWeight: 500 },
          }}
          sx={{ paddingBottom: 0, paddingTop: 1.8 }}
        />

        <CardContent>
          <form onSubmit={handleSubmit((fv) => login(fv))}>
            <FormGroup sx={{ gap: 1.5, paddingBottom: 3 }}>
              <FormControl>
                <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                  {t('users.form.email')}
                </FormLabel>
                <OutlinedInput
                  autoComplete="off"
                  inputProps={{ sx: inputBaseSx }}
                  {...register('email')}
                />
                {!!formState.errors.email && (
                  <Typography color="error" fontSize="small" paddingTop={0.5}>
                    {formState.errors.email.message}
                  </Typography>
                )}
              </FormControl>

              <FormControl>
                <FormLabel sx={{ fontWeight: 500, paddingBottom: 0.5 }}>
                  {t('users.form.password')}
                </FormLabel>
                <OutlinedInput
                  autoComplete="off"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={renderShowPassword()}
                  inputProps={{
                    sx: {
                      borderTopRightRadius: '0 !important',
                      borderBottomRightRadius: '0 !important',
                      ...inputBaseSx,
                    },
                  }}
                  {...register('password')}
                />
                {!!formState.errors.password && (
                  <Typography color="error" fontSize="small" paddingTop={0.5}>
                    {formState.errors.password.message}
                  </Typography>
                )}
              </FormControl>
            </FormGroup>

            <PrimaryButton
              type="submit"
              sx={{ height: 45 }}
              disabled={isLoginPending}
              isLoading={isLoginPending}
              fullWidth
            >
              {t('users.actions.logIn')}
            </PrimaryButton>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Login;
