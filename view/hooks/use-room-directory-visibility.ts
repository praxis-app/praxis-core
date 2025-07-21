import { Room, Visibility } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useMatrixClient } from './use-matrix-client';

interface UseRoomDirectoryVisibilityOptions {
  onSuccess?: (visibility: Visibility) => void;
}

export const useRoomDirectoryVisibility = (
  room: Room,
  { onSuccess }: UseRoomDirectoryVisibilityOptions = {},
) => {
  const [visibility, setVisibility] = useState<Visibility>();
  const matrixClient = useMatrixClient();

  useEffect(() => {
    if (!room.roomId || visibility) {
      return;
    }

    const init = async () => {
      const { visibility } = await matrixClient.getRoomDirectoryVisibility(
        room.roomId,
      );
      setVisibility(visibility);
      onSuccess?.(visibility);
    };
    init();
  }, [room.roomId, matrixClient, onSuccess, visibility]);

  return visibility;
};
