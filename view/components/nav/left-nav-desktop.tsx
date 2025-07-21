import { useJoinedRooms } from '@/hooks/use-joined-rooms';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAddCircle, MdExpandMore, MdSettings } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import appIconImg from '../../assets/images/app-icon.png';
import {
  CreateRoomForm,
  RoomFormSubmitButton,
} from '../rooms/create-room-form';
import RoomListItem from '../rooms/room-list-item';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  const [showRoomFormDialog, setShowRoomFormDialog] = useState(false);

  const { t } = useTranslation();
  const { roomId } = useParams();

  const rooms = useJoinedRooms();
  const activeRoomId = roomId ?? rooms[0]?.roomId;

  return (
    <div className="dark:bg-card bg-secondary flex h-full w-[240px] flex-col border-r border-[--color-border]">
      <Dialog open={showRoomFormDialog} onOpenChange={setShowRoomFormDialog}>
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 flex h-[55px] w-full cursor-pointer justify-between border-b border-[--color-border] pr-3 pl-4 select-none focus:outline-none">
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

            <MdExpandMore className="size-[1.4rem] self-center" />
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} className="w-52">
            <DialogTrigger asChild>
              <DropdownMenuItem className="text-md">
                <MdAddCircle className="text-foreground size-5" />
                {t('rooms.actions.create')}
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rooms.prompts.createRoom')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {t('rooms.prompts.startConversation')}
          </DialogDescription>
          <CreateRoomForm
            submitButton={(props) => (
              <DialogFooter>
                <RoomFormSubmitButton {...props} />
              </DialogFooter>
            )}
            onSubmit={() => setShowRoomFormDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <div className="flex flex-1 flex-col overflow-y-scroll py-2 select-none">
        {rooms.map((room) => (
          <RoomListItem
            key={room.roomId}
            activeRoomId={activeRoomId}
            room={room}
          />
        ))}
      </div>

      <div className="flex h-[60px] items-center justify-between border-t border-[--color-border] px-1.5">
        <LeftNavUserMenu />

        <Button
          onClick={() => toast(t('prompts.inDev'))}
          variant="ghost"
          size="icon"
        >
          <MdSettings className="text-muted-foreground size-6" />
        </Button>
      </div>
    </div>
  );
};
