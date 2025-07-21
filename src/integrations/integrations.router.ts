import express from 'express';
import { getHealth } from '../health/health.controller';
import {
  createProposal,
  deleteProposal,
  getProposal,
} from '../proposals/proposals.controller';
import {
  getServerConfig,
  updateServerConfig,
} from '../server-configs/server-configs.controller';
import { createVote, deleteVote, updateVote } from '../votes/votes.controller';
import { authIntegration } from './auth-integration.middleware';

const integrationsRouter = express.Router();
const proposalsIntegrationRouter = express.Router();
const votesIntegrationRouter = express.Router();
const serverConfigsIntegrationRouter = express.Router();

proposalsIntegrationRouter
  .get('/', getProposal)
  .post('/', createProposal)
  .delete('/:proposalId', deleteProposal);

votesIntegrationRouter
  .post('/', createVote)
  .put('/:voteId', updateVote)
  .delete('/:voteId', deleteVote);

serverConfigsIntegrationRouter
  .get('/', getServerConfig)
  .put('/', updateServerConfig);

integrationsRouter
  .use(authIntegration)
  .use('/proposals', proposalsIntegrationRouter)
  .use('/votes', votesIntegrationRouter)
  .use('/server-configs', serverConfigsIntegrationRouter)
  .get('/health', getHealth);

export default integrationsRouter;
