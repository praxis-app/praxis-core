import { useAppStore } from '@/store/app.store';
import { indexedDBWorkerFactory } from '@/store/workers/indexed-db-worker.factory';
import {
  ClientEvent,
  createClient,
  IndexedDBStore,
  MemoryStore,
  SyncState,
} from 'matrix-js-sdk';
import { ReactNode, useEffect } from 'react';
import { RoomSkeleton } from '../rooms/room-skeleton';

const isIndexedDBSupported = () => {
  try {
    return 'indexedDB' in window;
  } catch {
    return false;
  }
};

const getStore = () => {
  if (!isIndexedDBSupported()) {
    return new MemoryStore({
      localStorage: window.localStorage,
    });
  }
  return new IndexedDBStore({
    indexedDB: window.indexedDB,
    dbName: 'praxis-matrix-client-web-sync',
    localStorage: window.localStorage,
    workerFactory: indexedDBWorkerFactory,
  });
};

interface Props {
  children: ReactNode;
}

export function MatrixProvider({ children }: Props) {
  const { matrixClient, setMatrixClient } = useAppStore();

  useEffect(() => {
    if (matrixClient) {
      return;
    }
    const accessToken = localStorage.getItem('access_token') ?? undefined;
    const userId = localStorage.getItem('user_id') ?? undefined;
    const deviceId = localStorage.getItem('device_id') ?? undefined;

    const initClient = async () => {
      const store = getStore();

      let client = createClient({
        baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
        accessToken,
        deviceId,
        userId,
        store,
      });
      if (!accessToken || !userId) {
        const { access_token, user_id, device_id } =
          await client.registerGuest();

        localStorage.setItem('access_token', access_token!);
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('device_id', device_id!);

        client = createClient({
          baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
          accessToken: access_token,
          userId: user_id,
          deviceId: device_id,
          store,
        });
      }

      // Initialize the store before starting the client
      await store.startup();

      const isGuest = localStorage.getItem('device_id') === 'guest_device';
      if (isGuest) {
        // Join public rooms if the user is a guest
        const { chunk } = await client.publicRooms();
        if (chunk.length) {
          for (const { room_id, guest_can_join } of chunk) {
            if (guest_can_join) {
              await client.joinRoom(room_id);
            }
          }
        }
        client.setGuest(true);
      }

      await client.startClient({
        initialSyncLimit: 20,
      });

      // Make client available once it's ready
      client.on(ClientEvent.Sync, (state) => {
        if (state === SyncState.Prepared) {
          setMatrixClient(client);
        }
      });
    };

    initClient();
  }, [matrixClient, setMatrixClient]);

  if (!matrixClient) {
    return <RoomSkeleton />;
  }

  return children;
}
