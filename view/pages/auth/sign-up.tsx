import { SignUpForm } from '@/components/auth/sign-up-form';
import { TopNav } from '@/components/nav/top-nav';

export const SignUp = () => {
  return (
    <>
      <TopNav />

      <div className="flex h-full flex-col items-center justify-center p-3 pt-4 md:p-20">
        <SignUpForm />
      </div>
    </>
  );
};
