import express from 'express';
import { authenticate } from '../auth/middleware/authenticate.middleware';
import { getCurrentUser, isFirstUser } from './users.controller';

export const usersRouter = express.Router();

usersRouter.get('/me', authenticate, getCurrentUser);
usersRouter.get('/is-first', isFirstUser);
