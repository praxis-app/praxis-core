import { TopNav } from '@/components/nav/top-nav';
import { RoomSettingsForm } from '@/components/rooms/room-settings-form/room-settings-form';
import { useRoomSettingsForm } from '@/components/rooms/room-settings-form/use-room-settings-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NavigationPaths } from '@/constants/shared.constants';
import { useRoom } from '@/hooks/use-room';
import { Room } from 'matrix-js-sdk';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

interface RoomSettingsFormContainerProps {
  room: Room;
}

const RoomSettingsFormContainer = ({
  room,
}: RoomSettingsFormContainerProps) => {
  const navigate = useNavigate();
  const { form, handleSubmit, hasUnsupportedJoinRule } = useRoomSettingsForm(
    room,
    {
      onSuccess: () => navigate(`${NavigationPaths.Rooms}/${room.roomId}`),
    },
  );

  return (
    <RoomSettingsForm
      form={form}
      handleSubmit={handleSubmit}
      hasUnsupportedJoinRule={hasUnsupportedJoinRule}
    />
  );
};

export const RoomSettings = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { t } = useTranslation();

  const room = useRoom(roomId);

  if (!room) {
    return null;
  }

  return (
    <>
      <TopNav
        onBackClick={() => navigate(`${NavigationPaths.Rooms}/${room.roomId}`)}
        backBtnIcon={<MdClose className="size-6" />}
        header={t('rooms.labels.settings')}
      />

      <div className="flex h-full flex-col items-center justify-center p-12">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="hidden space-y-1">
            <CardTitle className="text-xl font-bold">
              {t('rooms.labels.settings')}
            </CardTitle>
            <CardDescription>
              {t('rooms.descriptions.settings')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RoomSettingsFormContainer room={room} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
