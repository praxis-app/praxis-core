import { useJoinedRooms } from '@/hooks/use-joined-rooms';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LuChevronRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import appIconImg from '../../assets/images/app-icon.png';
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
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NavSheet = ({ trigger, open, setOpen }: Props) => {
  const matrixClient = useMatrixClient();

  const userId = matrixClient.getUserId();
  const user = matrixClient.getUser(userId ?? '');
  const displayName = user?.displayName ?? userId ?? '';
  const joinedRooms = useJoinedRooms();

  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="left"
        className="bg-accent dark:bg-background min-w-[100%] border-r-0 px-0 pt-4"
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
                  <LuChevronRight className="mt-0.5 ml-0.5 size-4" />
                </div>
              }
            />
            <NavDropdown
              trigger={
                <UserAvatar
                  name={displayName}
                  userId={userId}
                  className="size-9"
                  fallbackClassName="text-[1.05rem]"
                />
              }
              displayName={displayName}
            />
          </SheetTitle>
          <VisuallyHidden>
            <SheetDescription>
              {t('navigation.descriptions.navSheet')}
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>

        <div className="bg-background dark:bg-card flex h-full w-full flex-col gap-6 overflow-y-auto rounded-t-2xl p-7 pb-12">
          {joinedRooms.map((room) => (
            <Link
              key={room.roomId}
              to={`/rooms/${room.roomId}`}
              onClick={() => setOpen(false)}
            >
              <div>{room.name}</div>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
