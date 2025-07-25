import { NavigationPaths } from '@/constants/shared.constants';
import { useSignUpData } from '@/hooks/use-sign-up-data';
import { useAppStore } from '@/store/app.store';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronRight } from 'react-icons/lu';
import { MdExitToApp, MdPersonAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { UserAvatar } from '../users/user-avatar';
import { NavDrawer } from './nav-drawer';
import { NavDropdown } from './nav-dropdown';

interface Props {
  trigger: ReactNode;
}

export const NavSheet = ({ trigger }: Props) => {
  const { isLoggedIn, isNavSheetOpen, setIsNavSheetOpen } = useAppStore();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { me, signUpPath, showSignUp } = useSignUpData();

  return (
    <Sheet open={isNavSheetOpen} onOpenChange={setIsNavSheetOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="left"
        className="bg-accent dark:bg-background min-w-[100%] border-r-0 px-0 pt-4"
        onEscapeKeyDown={(e) => e.preventDefault()}
        hideCloseButton
      >
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center justify-between pr-6">
            <NavDrawer
              trigger={
                <div className="flex cursor-pointer items-center gap-2 self-center px-6 font-medium tracking-[0.02em]">
                  <img
                    src={appIconImg}
                    alt={t('brand')}
                    className="size-9 self-center"
                  />
                  {t('brand')}
                  {isLoggedIn && (
                    <LuChevronRight className="mt-0.5 ml-0.5 size-4" />
                  )}
                </div>
              }
            />
            {me && (
              <NavDropdown
                trigger={
                  <UserAvatar
                    name={me.name}
                    userId={me.id}
                    className="size-9"
                    fallbackClassName="text-[1.05rem]"
                  />
                }
              />
            )}
          </SheetTitle>
          <VisuallyHidden>
            <SheetDescription>
              {t('navigation.descriptions.navSheet')}
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        <div className="bg-background dark:bg-card flex h-full w-full flex-col gap-6 overflow-y-auto rounded-t-2xl px-2 pt-6 pb-12">
          {/* TODO: List channels */}
          {/* TODO: Add divider between channels and login */}

          {(showSignUp || !isLoggedIn) && (
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-base font-light"
                onClick={() => {
                  navigate(signUpPath);
                  setIsNavSheetOpen(false);
                }}
              >
                <MdPersonAdd className="mr-1 size-6" />
                {t('auth.actions.signUp')}
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start text-base font-light"
                onClick={() => {
                  navigate(NavigationPaths.Login);
                  setIsNavSheetOpen(false);
                }}
              >
                <MdExitToApp className="mr-1 size-6" />
                {t('auth.actions.logIn')}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
