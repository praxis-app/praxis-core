import { SignUpForm } from '@/components/auth/sign-up-form';
import { TopNav } from '@/components/nav/top-nav';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export const SignUp = () => {
  const { t } = useTranslation();

  return (
    <>
      <TopNav />

      <div className="flex h-full flex-col items-center justify-center p-3 pt-4 md:p-20">
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
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
