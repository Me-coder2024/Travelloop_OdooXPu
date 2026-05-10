import { Request, Response } from 'express';
import { packingService } from '../services/packing.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getPackingItems = async (req: Request, res: Response) => {
  try {
    const data = await packingService.getPackingItems(req.params.id, req.user!.userId);
    sendSuccess(res, data);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const createPackingItem = async (req: Request, res: Response) => {
  try {
    const item = await packingService.createItem(req.params.id, req.user!.userId, req.body);
    sendCreated(res, item);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const togglePackingItem = async (req: Request, res: Response) => {
  try {
    const item = await packingService.toggleItem(req.params.id, req.params.itemId, req.user!.userId);
    sendSuccess(res, item, 200, 'Item toggled');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const deletePackingItem = async (req: Request, res: Response) => {
  try {
    await packingService.deleteItem(req.params.id, req.params.itemId, req.user!.userId);
    sendSuccess(res, null, 200, 'Item deleted');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const resetPacking = async (req: Request, res: Response) => {
  try {
    await packingService.resetAll(req.params.id, req.user!.userId);
    sendSuccess(res, null, 200, 'Packing reset');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};
