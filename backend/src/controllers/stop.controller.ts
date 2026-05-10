import { Request, Response } from 'express';
import { stopService } from '../services/stop.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getStops = async (req: Request, res: Response) => {
  try {
    const stops = await stopService.getStops(req.params.id);
    sendSuccess(res, stops);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const createStop = async (req: Request, res: Response) => {
  try {
    const stop = await stopService.createStop(req.params.id, req.user!.userId, req.body);
    sendCreated(res, stop);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const updateStop = async (req: Request, res: Response) => {
  try {
    const stop = await stopService.updateStop(req.params.id, req.params.stopId, req.user!.userId, req.body);
    sendSuccess(res, stop, 200, 'Stop updated');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const deleteStop = async (req: Request, res: Response) => {
  try {
    await stopService.deleteStop(req.params.id, req.params.stopId, req.user!.userId);
    sendSuccess(res, null, 200, 'Stop deleted');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};
