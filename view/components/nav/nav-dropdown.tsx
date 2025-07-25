import { api } from '@/client/api-client';
import { NavigationPaths } from '@/constants/shared.constants';
import { useMeQuery } from '@/hooks/use-me-query';
import { useAppStore } from '@/store/app.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdExitToApp } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogOutDialogContent } from '../auth/log-out-dialog-content';
import { Dialog, DialogTrigger } from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  trigger: ReactNode;
}

export const NavDropdown = ({ trigger }: Props) => {
  const { isLoggedIn, setIsLoggedIn, setIsNavSheetOpen } = useAppStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate: logOut, isPending: isLogoutPending } = useMutation({
    mutationFn: api.logOut,
    onSuccess: async () => {
      await navigate(NavigationPaths.Home);
      setShowLogoutDialog(false);
      setIsNavSheetOpen(false);
      setIsLoggedIn(false);
      queryClient.clear();
    },
  });

  const { data: meData } = useMeQuery({
    enabled: isLoggedIn,
  });
  const me = meData?.user;
  if (!me) {
    return null;
  }

  return (
    <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={12}
          className="mr-2.5 flex flex-col gap-2 p-3"
        >
          <DropdownMenuItem
            className="text-md"
            onClick={() => toast(t('prompts.inDev'))}
          >
            <UserAvatar
              name={me.name}
              userId={me.id}
              className="size-5"
              fallbackClassName="text-[0.7rem]"
            />
            {me.name}
          </DropdownMenuItem>

          <DialogTrigger asChild>
            <DropdownMenuItem className="text-md">
              <MdExitToApp className="text-foreground size-5" />
              {t('auth.actions.logOut')}
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogOutDialogContent
        handleLogout={logOut}
        isPending={isLogoutPending}
        setShowLogoutDialog={setShowLogoutDialog}
      />
    </Dialog>
  );
};
