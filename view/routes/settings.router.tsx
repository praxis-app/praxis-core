import { ServerRoles } from '@/pages/settings/server-roles';
import { ServerSettings } from '@/pages/settings/server-settings';
import { RouteObject } from 'react-router-dom';
import { InvitesPage } from '../pages/invites/invites-page';

export const settingsRouter: RouteObject = {
  path: '/settings',
  children: [
    {
      index: true,
      element: <ServerSettings />,
    },
    {
      path: 'invites',
      element: <InvitesPage />,
    },
    {
      path: 'roles',
      element: <ServerRoles />,
    },
  ],
};
