import { BrowserEvents, KeyCodes } from '@/constants/shared.constants';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { useAppStore } from '@/store/app.store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import { MdSearch } from 'react-icons/md';
import { toast } from 'sonner';
import { NavSheet } from '../nav/nav-sheet';
import { Button } from '../ui/button';

// interface Props {
//   channel: any;
// }

export const ChannelTopNav = () => {
  const { isNavSheetOpen, setIsNavSheetOpen } = useAppStore();

  const { t } = useTranslation();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KeyCodes.Escape) {
        if (isNavSheetOpen) {
          setIsNavSheetOpen(false);
        } else {
          setIsNavSheetOpen(true);
        }
      }
    };
    window.addEventListener(BrowserEvents.Keydown, handleKeyDown);
    return () => {
      window.removeEventListener(BrowserEvents.Keydown, handleKeyDown);
    };
  }, [isNavSheetOpen, setIsNavSheetOpen]);

  return (
    <header className="flex h-[55px] items-center justify-between border-b border-[--color-border] px-2 md:pl-6">
      <div className="mr-1 flex flex-1 items-center gap-2.5">
        {!isDesktop && (
          <NavSheet
            trigger={
              <Button variant="ghost" size="icon">
                <LuArrowLeft className="size-6" />
              </Button>
            }
          />
        )}

        {/* <RoomDetailsDrawer
          room={room}
          trigger={
            <div className="flex flex-1 items-center text-[15px] font-medium select-none">
              {roomName}
              {!isDesktop && (
                <MdChevronRight className="text-muted-foreground mt-[0.07rem] size-5" />
              )}
            </div>
          }
        /> */}
      </div>

      <Button
        onClick={() => toast(t('prompts.inDev'))}
        variant="ghost"
        size="icon"
      >
        <MdSearch className="size-6" />
      </Button>
    </header>
  );
};
