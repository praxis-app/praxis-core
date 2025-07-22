import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAddCircle } from 'react-icons/md';
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

interface Props {
  trigger: ReactNode;
}

export const NavDrawer = ({ trigger }: Props) => {
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [showRoomFormDialog, setShowRoomFormDialog] = useState(false);
  const { t } = useTranslation();

  return (
    <Drawer open={showNavDrawer} onOpenChange={setShowNavDrawer}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="flex min-h-[calc(100%-68px)] flex-col items-start rounded-t-2xl border-0">
        <VisuallyHidden>
          <DrawerHeader>
            <DrawerTitle>{t('navigation.titles.navDrawer')}</DrawerTitle>
            <DrawerDescription>
              {t('navigation.descriptions.navDrawer')}
            </DrawerDescription>
          </DrawerHeader>
        </VisuallyHidden>

        <div className="flex flex-col gap-4 p-4">
          <Dialog
            open={showRoomFormDialog}
            onOpenChange={setShowRoomFormDialog}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-md flex items-center gap-6 font-normal"
              >
                <MdAddCircle className="size-6" />
                {t('channels.actions.create')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('channels.prompts.createChannel')}</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-center">
                {/* TODO: Replace with more fitting description */}
                {t('channels.prompts.startConversation')}
              </DialogDescription>
              {/* <CreateRoomForm
                submitButton={(props) => (
                  <DialogFooter>
                    <RoomFormSubmitButton {...props} />
                  </DialogFooter>
                )}
                onSubmit={() => {
                  setShowNavDrawer(false);
                  setShowRoomFormDialog(false);
                }}
              /> */}
            </DialogContent>
          </Dialog>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
