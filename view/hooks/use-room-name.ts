import { Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useEventEmitter } from './use-event-emitter';

const EMPTY_ROOM_NAME = 'Empty room';

const getRoomName = (room?: Room) => room?.name || '';

interface UseRoomNameOptions {
  onSuccess?: (name: string) => void;
}

export function useRoomName(
  room: Room,
  { onSuccess }: UseRoomNameOptions = {},
) {
  const [roomName, setRoomName] = useState(getRoomName(room));

  useEventEmitter(room, RoomEvent.Name, () => {
    setRoomName(getRoomName(room));
    onSuccess?.(getRoomName(room));
  });

  useEffect(() => {
    setRoomName(getRoomName(room));
  }, [room]);

  if (roomName === EMPTY_ROOM_NAME) {
    return '';
  }

  return roomName;
}
