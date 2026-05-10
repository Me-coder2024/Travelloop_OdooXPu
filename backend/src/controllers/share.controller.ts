import { Request, Response } from 'express';
import { shareService } from '../services/share.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getSharedTrip = async (req: Request, res: Response) => {
  try {
    const trip = await shareService.getSharedTrip(req.params.shareToken);
    sendSuccess(res, trip);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const shareTrip = async (req: Request, res: Response) => {
  try {
    const share = await shareService.shareTrip(req.params.id, req.user!.userId, req.body);
    sendCreated(res, share);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};
