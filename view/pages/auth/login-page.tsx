import { LoginForm } from '@/components/auth/login-form';
import { TopNav } from '@/components/nav/top-nav';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NavigationPaths } from '@/constants/shared.constants';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <TopNav />

      <div className="flex h-full flex-col items-center justify-center p-4 md:p-18">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              {t('auth.actions.signIn')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.prompts.enterCredentials')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            <div className="text-muted-foreground text-center text-sm">
              {t('auth.prompts.dontHaveAccount')}{' '}
              <Link
                to={NavigationPaths.SignUp}
                className="text-primary font-medium hover:underline"
              >
                {t('auth.prompts.createAccount')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
