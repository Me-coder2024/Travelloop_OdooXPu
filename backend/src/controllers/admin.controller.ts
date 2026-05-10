import { Request, Response } from 'express';
import { adminService } from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/response';

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await adminService.getStats();
    sendSuccess(res, stats);
  } catch (err: any) { sendError(res, err.message, 500); }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await adminService.getUsers(page, limit);
    sendSuccess(res, data);
  } catch (err: any) { sendError(res, err.message, 500); }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    sendSuccess(res, user, 200, 'User updated');
  } catch (err: any) { sendError(res, err.message, 500); }
};
