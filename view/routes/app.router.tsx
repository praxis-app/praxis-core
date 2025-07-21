import { createBrowserRouter } from 'react-router-dom';
import { App } from '../components/app/app';
import { ErrorPage } from '../pages/error-page';
import { HealthPage } from '../pages/health-page';
import { HomePage } from '../pages/home-page';
import InviteCheck from '../pages/invites/invite-check';
import { PageNotFound } from '../pages/page-not-found';
import { authRouter } from './auth.router';
import { channelsRouter } from './channels.router';
import { settingsRouter } from './settings.router';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
      {
        path: 'i/:token',
        element: <InviteCheck />,
      },
      {
        path: 'health',
        element: <HealthPage />,
      },
      channelsRouter,
      settingsRouter,
      authRouter,
    ],
  },
]);
