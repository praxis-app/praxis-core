import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { createVote, deleteVote, updateVote } from './votes.controller';

export const votesRouter = express.Router({ mergeParams: true });

// All vote routes require authentication
votesRouter.use(authenticate);

// Create a vote for a proposal
votesRouter.post('/:proposalId/votes', createVote);

// Update an existing vote
votesRouter.put('/:proposalId/votes/:voteId', updateVote);

// Delete an existing vote
votesRouter.delete('/:proposalId/votes/:voteId', deleteVote);
