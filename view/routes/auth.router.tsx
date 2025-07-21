import { RouteObject } from 'react-router-dom';
import Login from '../pages/auth/login';
import SignUp from '../pages/auth/sign-up';

export const authRouter: RouteObject = {
  path: '/auth',
  children: [
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'signup',
      element: <SignUp />,
    },
    {
      path: 'signup/:token',
      element: <SignUp />,
    },
  ],
};
