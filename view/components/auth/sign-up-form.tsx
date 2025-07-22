import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useTranslation } from 'react-i18next';

export const SignUpForm = () => {
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
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t('auth.labels.username')}</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t('auth.placeholders.username')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.labels.email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t('auth.placeholders.email')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.labels.password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t('auth.prompts.createPassword')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('auth.labels.confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t('auth.placeholders.confirmPassword')}
              required
            />
          </div>

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
      </CardContent>
    </Card>
  );
};
