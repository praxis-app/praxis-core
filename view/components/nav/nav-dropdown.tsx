import { NavigationPaths } from '@/constants/shared.constants';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdExitToApp } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LogOutDialogContent from '../auth/log-out-dialog-content';
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
  displayName: string;
}

export const NavDropdown = ({ trigger, displayName }: Props) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  // TODO: Add remaining logout logic
  const handleLogout = async () => {
    localStorage.clear();
    setShowLogoutDialog(false);
    navigate(NavigationPaths.Home);
  };

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
            {/* TODO: Replace with actual user data */}
            <UserAvatar
              name={'displayName'}
              userId={'userId'}
              className="size-5"
              fallbackClassName="text-[0.7rem]"
            />
            {displayName}
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
        setShowLogoutDialog={setShowLogoutDialog}
        handleLogout={handleLogout}
      />
    </Dialog>
  );
};
