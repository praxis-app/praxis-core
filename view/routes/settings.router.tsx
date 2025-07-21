import { RouteObject } from 'react-router-dom';
import InvitesPage from '../pages/invites/invites-page';
import EditRolePage from '../pages/settings/edit-role-page';
import Integrations from '../pages/settings/integrations';
import ServerRoles from '../pages/settings/server-roles';
import ServerSettings from '../pages/settings/server-settings';

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
      path: 'integrations',
      element: <Integrations />,
    },
    {
      path: 'roles',
      children: [
        {
          index: true,
          element: <ServerRoles />,
        },
        {
          path: ':roleId/edit',
          element: <EditRolePage />,
        },
      ],
    },
  ],
};
