import { NextFunction, Request, Response } from 'express';

export const isRegistered = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user } = res.locals;

  if (user.anonymous) {
    res.status(403).send('Forbidden');
    return;
  }

  next();
};
