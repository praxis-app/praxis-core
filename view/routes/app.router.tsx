import { ErrorPage } from '@/pages/error-page';
import { HomePage } from '@/pages/home-page';
import { InviteCheck } from '@/pages/invites/invite-check';
import { PageNotFound } from '@/pages/page-not-found';
import { createBrowserRouter } from 'react-router-dom';
import { App } from '../components/app/app';
import { authRouter } from './auth.router';
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
      authRouter,
      settingsRouter,
    ],
  },
]);
