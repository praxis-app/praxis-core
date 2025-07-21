import { ClientEvent, KnownMembership, Room, RoomEvent } from 'matrix-js-sdk';
import { useEffect, useState } from 'react';
import { useMatrixClient } from './use-matrix-client';

const getLastEventTs = (room: Room) => {
  const events = room.getLiveTimeline().getEvents();
  return events[events.length - 1].getTs();
};

const sortRoomsByLastEventTs = (rooms: Room[]) =>
  rooms.sort((a, b) => {
    return getLastEventTs(b) - getLastEventTs(a);
  });

const filterJoinedRooms = (rooms: Room[]) => {
  return rooms.filter(
    (room) => room.getMyMembership() === KnownMembership.Join,
  );
};

export const useJoinedRooms = () => {
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const matrixClient = useMatrixClient();

  useEffect(() => {
    const handleRoom = () => {
      const visibleRooms = matrixClient.getVisibleRooms();
      const joinedRooms = filterJoinedRooms(visibleRooms);
      const sortedRooms = sortRoomsByLastEventTs(joinedRooms);
      setJoinedRooms(sortedRooms);
    };
    handleRoom();

    matrixClient.on(ClientEvent.Sync, handleRoom);
    matrixClient.on(RoomEvent.Timeline, handleRoom);

    return () => {
      matrixClient.removeListener(ClientEvent.Sync, handleRoom);
      matrixClient.removeListener(RoomEvent.Timeline, handleRoom);
    };
  }, [matrixClient]);

  return joinedRooms;
};
