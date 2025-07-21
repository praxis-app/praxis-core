import { Request, Response } from 'express';
import * as healthService from './health.service';

export const getHealth = async (_: Request, res: Response) => {
  const payload = healthService.getHealth();
  res.json(payload);
};
