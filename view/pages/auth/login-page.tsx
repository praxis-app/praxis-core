import { LoginForm } from '@/components/auth/login-form';
import { TopNav } from '@/components/nav/top-nav';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <TopNav />

      <div className="flex h-full flex-col items-center justify-center p-4 md:p-20">
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
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
