import { LoginForm } from '@/components/auth/login-form';
import { TopNav } from '@/components/nav/top-nav';

export const LoginPage = () => {
  return (
    <>
      <TopNav />

      <div className="flex h-full flex-col items-center justify-center p-4 md:p-20">
        <LoginForm />
      </div>
    </>
  );
};
