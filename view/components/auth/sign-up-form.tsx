import { t } from '@/lib/shared.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

const NAME_REGEX = /^[A-Za-z0-9 ]+$/;
const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 15;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

const signUpFormSchema = zod
  .object({
    username: zod
      .string()
      .min(NAME_MIN_LENGTH, {
        message: t('auth.errors.shortName'),
      })
      .max(NAME_MAX_LENGTH, {
        message: t('auth.errors.longName'),
      })
      .regex(NAME_REGEX, {
        message: t('auth.errors.invalidName'),
      }),
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
    confirmPassword: zod
      .string()
      .min(PASSWORD_MIN_LENGTH, {
        message: t('auth.errors.passwordTooShort'),
      })
      .max(PASSWORD_MAX_LENGTH, {
        message: t('auth.errors.passwordTooLong'),
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('auth.errors.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  });

export const SignUpForm = () => {
  const form = useForm<zod.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: zod.infer<typeof signUpFormSchema>) => {
    console.log(data);
  };

  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t('auth.actions.createAccount')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth.prompts.enterDetails')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.labels.username')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t('auth.placeholders.username')}
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.labels.confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t('auth.placeholders.confirmPassword')}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {t('auth.actions.createAccount')}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t('auth.prompts.alreadyHaveAccount')}{' '}
              <a
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                {t('auth.actions.signIn')}
              </a>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
