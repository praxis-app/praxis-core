import { getRoomState } from '@/lib/room.utilts';
import { Room, RoomStateEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useEventEmitter } from './use-event-emitter';

interface UseRoomStateOptions<T> {
  onUpdate?: (value: T) => void;
  getValue: (room: Room) => T;
}

export function useRoomState<T>(
  room: Room,
  { onUpdate, getValue }: UseRoomStateOptions<T>,
) {
  const [value, setValue] = useState(getValue(room));
  const roomState = getRoomState(room);

  useEventEmitter(roomState, RoomStateEvent.Update, () => {
    const newValue = getValue(room);
    setValue(newValue);
    onUpdate?.(newValue);
  });

  useEffect(() => {
    setValue(getValue(room));
  }, [room, getValue]);

  return value;
}
