import { ErrorPage } from '@/pages/error-page';
import { HomePage } from '@/pages/home-page';
import { PageNotFound } from '@/pages/page-not-found';
import { createBrowserRouter } from 'react-router-dom';
import { App } from '../components/app/app';
import { authRouter } from './auth.router';
import { roomRouter } from './room.router';

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
      authRouter,
      roomRouter,
    ],
  },
]);
