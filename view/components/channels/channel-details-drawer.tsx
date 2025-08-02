import { useIsDesktop } from '@/hooks/use-is-desktop';
import { Channel } from '@/types/channel.types';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdTag } from 'react-icons/md';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Separator } from '../ui/separator';

interface Props {
  channel: Channel;
  trigger: ReactNode;
}

export const ChannelDetailsDrawer = ({ channel, trigger }: Props) => {
  const [showDeleteChannelDialog, setShowDeleteChannelDialog] = useState(false);

  const { t } = useTranslation();
  const isDesktop = useIsDesktop();

  return (
    <Drawer>
      {isDesktop ? trigger : <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent className="flex min-h-[calc(100vh-55px)] flex-col items-start rounded-t-2xl border-0">
        <DrawerHeader className="w-full pt-5 pb-6">
          <DrawerTitle className="flex items-center justify-center gap-0.5 text-center text-[1.3rem]">
            <MdTag className="mt-0.5 size-6" />
            <div className="tracking-[0.015rem]">{channel.name}</div>
          </DrawerTitle>
          <DrawerDescription>{channel.description}</DrawerDescription>
        </DrawerHeader>

        <Separator />

        {/* <ChannelSettingsSheet
          trigger={
            <Button
              className="text-primary mx-auto mt-6 h-[3.2rem] w-[92%] justify-between"
              variant="secondary"
              size="lg"
            >
              <div className="flex items-center gap-3">
                <MdSettings className="text-muted-foreground size-6.5" />
                <div>{t('channels.labels.settings')}</div>
              </div>

              <MdChevronRight className="text-muted-foreground size-5.5" />
            </Button>
          }
          channel={channel}
        /> */}

        <Dialog
          open={showDeleteChannelDialog}
          onOpenChange={setShowDeleteChannelDialog}
        >
          <DialogTrigger asChild>
            <Button
              className="text-destructive mx-auto mt-6 h-[3.2rem] w-[92%] justify-start gap-3"
              variant="secondary"
              size="lg"
            >
              <BiTrash className="size-5" />
              {t('channels.actions.delete')}
            </Button>
          </DialogTrigger>
        </Dialog>
      </DrawerContent>
    </Drawer>
  );
};
