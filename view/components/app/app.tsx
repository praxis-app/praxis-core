import { Outlet } from 'react-router-dom';
import { Layout } from './layout';

export const App = () => (
  <Layout>
    <Outlet />
  </Layout>
);
