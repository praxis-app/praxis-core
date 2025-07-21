import { Outlet } from 'react-router-dom';
import { Layout } from './layout';
import { MatrixProvider } from './matrix-provider';

export const App = () => (
  <MatrixProvider>
    <Layout>
      <Outlet />
    </Layout>
  </MatrixProvider>
);
