import express from 'express';
import { getHealth } from './health.controller';

export const healthRouter = express.Router();

healthRouter.get('/', getHealth);
