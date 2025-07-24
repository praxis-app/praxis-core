import { NavigationPaths } from '@/constants/shared.constants';
import { cn } from '@/lib/shared.utils';
import { useAppStore } from '@/store/app.store';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAddCircle, MdExpandMore, MdSettings } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import appIconImg from '../../assets/images/app-icon.png';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import LeftNavUserMenu from './left-nav-user-menu';

export const LeftNavDesktop = () => {
  const { isLoggedIn } = useAppStore();
  const [showRoomFormDialog, setShowRoomFormDialog] = useState(false);

  const { t } = useTranslation();

  return (
    <div className="dark:bg-card bg-secondary flex h-full w-[240px] flex-col border-r border-[--color-border]">
      <Dialog open={showRoomFormDialog} onOpenChange={setShowRoomFormDialog}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              ' flex h-[55px] w-full  justify-between border-b border-[--color-border] pr-3 pl-4 select-none focus:outline-none',
              isLoggedIn &&
                'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 cursor-pointer',
            )}
            disabled={!isLoggedIn}
          >
            <div className="flex items-center gap-2">
              <img
                src={appIconImg}
                alt={t('brand')}
                className="size-[1.55rem] self-center"
              />
              <div className="self-center text-base/tight font-medium tracking-[0.02em]">
                {t('brand')}
              </div>
            </div>

            {isLoggedIn && (
              <MdExpandMore className="size-[1.4rem] self-center" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} className="w-52">
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-md">
                <MdAddCircle className="text-foreground size-5" />
                {t('channels.actions.create')}
              </DropdownMenuItem>
            </DialogTrigger>

            <Link to={NavigationPaths.Settings}>
              <DropdownMenuItem className="text-md">
                <MdSettings className="text-foreground size-5" />
                {t('navigation.headers.serverSettings')}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('channels.prompts.createChannel')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {t('channels.prompts.startConversation')}
          </DialogDescription>
          {/* TODO: Add create channel form */}
          {/* <CreateRoomForm
            submitButton={(props) => (
              <DialogFooter>
                <RoomFormSubmitButton {...props} />
              </DialogFooter>
            )}
            onSubmit={() => setShowRoomFormDialog(false)}
          /> */}
        </DialogContent>
      </Dialog>

      <div className="flex flex-1 flex-col overflow-y-scroll py-2 select-none">
        {/* TODO: Add channels list */}
        {/* {rooms.map((room) => (
          <RoomListItem
            key={room.roomId}
            activeRoomId={activeRoomId}
            room={room}
          />
        ))} */}
      </div>

      <div className="flex h-[60px] items-center justify-between border-t border-[--color-border] px-1.5">
        <LeftNavUserMenu />

        {isLoggedIn ? (
          <Button
            onClick={() => toast(t('prompts.inDev'))}
            variant="ghost"
            size="icon"
          >
            <MdSettings className="text-muted-foreground size-6" />
          </Button>
        ) : (
          // TODO: Add sign up button after implementing invites
          <Link to={NavigationPaths.Login} className="w-full">
            <Button variant="ghost" className="w-full">
              {t('auth.actions.logIn')}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
