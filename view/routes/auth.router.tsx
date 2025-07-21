import { RouteObject } from 'react-router-dom';
import { LoginPage } from '../pages/auth/login-page';

export const authRouter: RouteObject = {
  path: '/auth',
  children: [
    {
      path: 'login',
      element: <LoginPage />,
    },
  ],
};
