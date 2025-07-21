import { RoomSettings } from '@/pages/rooms/room-settings';
import { RouteObject } from 'react-router-dom';
import { RoomPage } from '../pages/rooms/room-page';

export const roomRouter: RouteObject = {
  path: '/rooms',
  children: [
    {
      path: ':roomId',
      element: <RoomPage />,
    },
    {
      path: ':roomId/settings',
      element: <RoomSettings />,
    },
  ],
};
