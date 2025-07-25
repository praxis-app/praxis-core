import { api } from '@/client/api-client';
import { NavigationPaths } from '@/constants/shared.constants';
import { useMeQuery } from '@/hooks/use-me-query';
import { useAppStore } from '@/store/app.store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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

export const LeftNavUserMenu = () => {
  const { isLoggedIn, setIsLoggedIn } = useAppStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logOut, isPending: isLogoutPending } = useMutation({
    mutationFn: api.logOut,
    onSuccess: async () => {
      await navigate(NavigationPaths.Home);
      setShowLogoutDialog(false);
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
        <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 mr-1 flex h-11.5 w-full cursor-pointer items-center justify-start gap-2 rounded-[4px] px-2 text-left select-none focus:outline-none">
          <UserAvatar
            className="size-8"
            fallbackClassName="text-sm"
            name={me.name}
            userId={me.id}
            isOnline={true}
            showOnlineStatus
          />
          <div className="flex flex-col pt-[0.16rem]">
            <div className="text-[0.81rem]/tight">{me.name}</div>
            <div className="text-muted-foreground text-[0.7rem]/[0.9rem] font-light">
              {t('users.presence.online')}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-52"
          align="start"
          alignOffset={10}
          side="top"
          sideOffset={18}
        >
          <DropdownMenuItem
            className="text-md"
            onClick={() => toast(t('prompts.inDev'))}
          >
            <UserAvatar
              name={me.name}
              userId={me.id}
              className="size-5"
              fallbackClassName="text-[0.65rem]"
              isOnline={true}
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
