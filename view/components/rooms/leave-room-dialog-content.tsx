import { NavigationPaths } from '@/constants/shared.constants';
import { useJoinedRooms } from '@/hooks/use-joined-rooms';
import { useMatrixClient } from '@/hooks/use-matrix-client';
import { Room } from 'matrix-js-sdk';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface Props {
  room: Room;
  setShowLeaveRoomDialog(show: boolean): void;
}

export const LeaveRoomDialogContent = ({
  room,
  setShowLeaveRoomDialog,
}: Props) => {
  const { t } = useTranslation();
  const matrixClient = useMatrixClient();
  const navigate = useNavigate();

  const { roomId } = useParams();
  const rooms = useJoinedRooms();

  const handleLeaveRoom = async () => {
    await matrixClient.leave(room.roomId);
    matrixClient.store.removeRoom(room.roomId);
    setShowLeaveRoomDialog(false);

    // Only navigate if the user is currently on the room's page
    const activeRoomId = roomId ?? rooms[0]?.roomId;
    if (activeRoomId === room.roomId) {
      navigate(NavigationPaths.Home);
    }
  };

  return (
    <DialogContent>
      <DialogHeader className="pb-0.5">
        <DialogTitle className="text-center">
          {t('rooms.headers.leaveRoom')}
        </DialogTitle>
      </DialogHeader>

      <DialogDescription className="pb-2">
        {t('rooms.prompts.leaveRoom', { roomName: room.name })}
      </DialogDescription>

      <DialogFooter className="flex w-full flex-row gap-2 self-center">
        <Button
          variant="outline"
          onClick={() => setShowLeaveRoomDialog(false)}
          className="flex-1"
        >
          {t('actions.cancel')}
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={handleLeaveRoom}
        >
          {t('rooms.actions.leave')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
