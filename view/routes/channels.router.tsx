import { RouteObject } from 'react-router-dom';
import { ChannelPage } from '../pages/channels/channel-page';
import EditChannelPage from '../pages/channels/edit-channel-page';

export const channelsRouter: RouteObject = {
  path: '/channels',
  children: [
    {
      path: ':channelId',
      element: <ChannelPage />,
    },
    {
      path: ':channelId/edit',
      element: <EditChannelPage />,
    },
  ],
};
