import { RoomSkeleton } from '@/components/rooms/room-skeleton';
import { RoomView } from '@/components/rooms/room-view';
import { useJoinedRooms } from '@/hooks/use-joined-rooms';

export const HomePage = () => {
  const joinedRooms = useJoinedRooms();
  const room = joinedRooms[0];

  if (!room) {
    return <RoomSkeleton />;
  }

  return <RoomView room={room} />;
};
