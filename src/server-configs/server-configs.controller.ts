import { Request, Response } from 'express';
import * as serverConfigsService from './server-configs.service';

export const getServerConfig = async (_req: Request, res: Response) => {
  const serverConfig = await serverConfigsService.getServerConfig();
  res.json({ serverConfig });
};

export const updateServerConfig = async (req: Request, res: Response) => {
  const result = await serverConfigsService.updateServerConfig(req.body);
  res.json(result);
};

export const connectBot = async (req: Request, res: Response) => {
  const result = await serverConfigsService.connectBot(req.body);
  res.json(result);
};

export const disconnectBot = async (_req: Request, res: Response) => {
  const result = await serverConfigsService.disconnectBot();
  res.json(result);
};

export const checkBotConnection = async (_req: Request, res: Response) => {
  const isConnected = await serverConfigsService.checkBotConnection();
  res.json({ isConnected });
};
