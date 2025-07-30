import { RouteObject } from 'react-router-dom';
import { ChannelPage } from '../pages/channels/channel-page';

export const channelsRouter: RouteObject = {
  path: '/channels',
  children: [
    {
      path: ':channelId',
      element: <ChannelPage />,
    },
    {
      path: ':channelId/edit',
      element: <div>TODO: Add edit channel page</div>,
    },
  ],
};
