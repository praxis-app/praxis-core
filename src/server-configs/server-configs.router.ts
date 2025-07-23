import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { can } from '../roles/middleware/can.middleware';
import * as serverConfigsController from './server-configs.controller';

export const serverConfigsRouter = express.Router();

serverConfigsRouter
  .use(authenticate)
  .get(
    '/',
    can('read', 'ServerConfig'),
    serverConfigsController.getServerConfig,
  )
  .put(
    '/',
    can('update', 'ServerConfig'),
    serverConfigsController.updateServerConfig,
  );
