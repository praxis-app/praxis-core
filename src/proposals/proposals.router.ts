// TODO: Guard routes with permission checks

import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { createProposal } from './proposals.controller';

export const proposalsRouter = express.Router({
  mergeParams: true,
});

proposalsRouter.use(authenticate).post('/', createProposal);
