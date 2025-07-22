import { api } from '@/client/api-client';
import {
  LocalStorageKeys,
  NavigationPaths,
} from '@/constants/shared.constants';
import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as zod from 'zod';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

const loginFormSchema = zod.object({
  email: zod
    .email({
      message: t('auth.errors.invalidEmail'),
    })
    .max(EMAIL_MAX_LENGTH, {
      message: t('auth.errors.longEmail'),
    }),
  password: zod
    .string()
    .min(PASSWORD_MIN_LENGTH, {
      message: t('auth.errors.passwordTooShort'),
    })
    .max(PASSWORD_MAX_LENGTH, {
      message: t('auth.errors.passwordTooLong'),
    }),
});

export const LoginForm = () => {
  const form = useForm<zod.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: api.login,
    onSuccess({ access_token }) {
      localStorage.setItem(LocalStorageKeys.AccessToken, access_token);
      navigate(NavigationPaths.Home);
    },
    onError(error: AxiosError) {
      const errorMessage =
        (error.response?.data as string) || t('errors.somethingWentWrong');

      toast(errorMessage);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t('auth.actions.signIn')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth.prompts.enterCredentials')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((fv) => login(fv))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.labels.email')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('auth.placeholders.email')}
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.labels.password')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('auth.prompts.createPassword')}
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoginPending}>
              {t('auth.actions.signIn')}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t('auth.prompts.dontHaveAccount')}{' '}
              <a
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                {t('auth.actions.createAccount')}
              </a>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
