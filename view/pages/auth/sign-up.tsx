import { SignUpForm } from '@/components/auth/sign-up-form';
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

export const SignUp = () => {
  const { t } = useTranslation();

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
              {t('auth.prompts.enterDetails')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />

            <div className="text-muted-foreground text-center text-sm">
              {t('auth.prompts.alreadyHaveAccount')}{' '}
              <Link
                to={NavigationPaths.Login}
                className="text-primary font-medium hover:underline"
              >
                {t('auth.actions.signIn')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
