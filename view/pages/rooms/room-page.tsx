import { RoomSkeleton } from '@/components/rooms/room-skeleton';
import { RoomView } from '@/components/rooms/room-view';
import { useRoom } from '@/hooks/use-room';
import { useParams } from 'react-router-dom';

export const RoomPage = () => {
  const { roomId } = useParams();
  const room = useRoom(roomId);

  if (!room) {
    return <RoomSkeleton />;
  }

  return <RoomView room={room} />;
};
