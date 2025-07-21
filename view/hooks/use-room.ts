import { ClientEvent, Room } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useMatrixClient } from './use-matrix-client';

// 120 seconds timeout
const TIMEOUT = 120 * 1000;

export const useRoom = (roomId?: string) => {
  const [room, setRoom] = useState<Room | null>(null);
  const matrixClient = useMatrixClient();

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const waitForRoom = (roomId: string) =>
      new Promise<Room>((resolve) => {
        // Check if room already exists
        const existingRoom = matrixClient.getRoom(roomId);
        if (existingRoom) {
          resolve(existingRoom);
          return;
        }

        // Wait for room to arrive via sync
        const onRoom = (room: Room) => {
          if (room.roomId === roomId) {
            matrixClient.off(ClientEvent.Room, onRoom);
            setRoom(room);
            resolve(room);
          }
        };

        matrixClient.on(ClientEvent.Room, onRoom);

        // Set a timeout to prevent infinite waiting
        setTimeout(() => {
          matrixClient.off(ClientEvent.Room, onRoom);
          throw new Error(`Timeout waiting for room ${roomId}`);
        }, TIMEOUT);
      });

    const init = async () => {
      const room = await waitForRoom(roomId);
      setRoom(room);
    };

    init();
  }, [roomId, matrixClient]);

  return room;
};
