import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Room } from 'matrix-js-sdk';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { RoomSettingsForm } from './room-settings-form/room-settings-form';
import { useRoomSettingsForm } from './room-settings-form/use-room-settings-form';

interface Props {
  trigger: ReactNode;
  room: Room;
}

const RoomSettingsSheet = ({ trigger, room }: Props) => {
  const [showRoomSettingsSheet, setShowRoomSettingsSheet] = useState(false);
  const { form, handleSubmit, hasUnsupportedJoinRule } = useRoomSettingsForm(
    room,
    { onSuccess: () => setShowRoomSettingsSheet(false) },
  );

  const { t } = useTranslation();

  return (
    <Sheet open={showRoomSettingsSheet} onOpenChange={setShowRoomSettingsSheet}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="mt-14 min-w-[100%] rounded-t-2xl border-0 px-0 pt-3.5"
        hideCloseButton
      >
        <div className="flex justify-between px-2 pb-3.5">
          <Button
            onClick={() => setShowRoomSettingsSheet(false)}
            variant="ghost"
            size="icon"
          >
            <MdClose className="size-6" />
          </Button>

          <SheetHeader className="self-center">
            <SheetTitle className="text-md mb-0 font-medium">
              {t('rooms.labels.settings')}
            </SheetTitle>
            <VisuallyHidden>
              <SheetDescription>
                {t('rooms.descriptions.settings')}
              </SheetDescription>
            </VisuallyHidden>
          </SheetHeader>

          <Button
            onClick={() => form.handleSubmit(handleSubmit)()}
            disabled={form.formState.isSubmitting}
            variant="ghost"
          >
            {t('actions.save')}
          </Button>
        </div>

        <Separator className="mb-7" />

        <RoomSettingsForm
          form={form}
          handleSubmit={handleSubmit}
          hasUnsupportedJoinRule={hasUnsupportedJoinRule}
        />
      </SheetContent>
    </Sheet>
  );
};

export default RoomSettingsSheet;
