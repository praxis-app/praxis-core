import { Request, Response } from 'express';
import * as invitesService from './invites.service';

export const getInvite = async (req: Request, res: Response) => {
  const invite = await invitesService.getValidInvite(req.params.token);
  res.json({ invite });
};

export const getInvites = async (_: Request, res: Response) => {
  const invites = await invitesService.getValidInvites();
  res.json({ invites });
};

export const createInvite = async (req: Request, res: Response) => {
  const invite = await invitesService.createInvite(req.body, res.locals.user);
  res.json({ invite });
};

export const deleteInvite = async (req: Request, res: Response) => {
  const result = await invitesService.deleteInvite(req.params.inviteId);
  res.json(result);
};
