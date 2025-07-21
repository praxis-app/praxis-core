import { Request, Response, NextFunction } from 'express';

export const validateConnectBot = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { botClientId, botApiUrl } = req.body;
  if (!botClientId || !botApiUrl) {
    res.status(400).send('Bot client ID and API URL are required');
    return;
  }

  if (typeof botClientId !== 'string' || typeof botApiUrl !== 'string') {
    res.status(400).send('Bot client ID and API URL must be strings');
    return;
  }

  if (botClientId.length < 18 || botClientId.length > 19) {
    res.status(400).send('Bot client ID must be 18 or 19 characters long');
    return;
  }

  next();
};
