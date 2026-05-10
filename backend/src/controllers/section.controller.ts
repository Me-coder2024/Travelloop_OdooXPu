import { Request, Response } from 'express';
import { sectionService } from '../services/section.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getSections = async (req: Request, res: Response) => {
  try {
    const sections = await sectionService.getSections(req.params.id);
    sendSuccess(res, sections);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const createSection = async (req: Request, res: Response) => {
  try {
    const section = await sectionService.createSection(req.params.id, req.user!.userId, req.body);
    sendCreated(res, section);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const updateSection = async (req: Request, res: Response) => {
  try {
    const section = await sectionService.updateSection(req.params.id, req.params.sId, req.user!.userId, req.body);
    sendSuccess(res, section, 200, 'Section updated');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    await sectionService.deleteSection(req.params.id, req.params.sId, req.user!.userId);
    sendSuccess(res, null, 200, 'Section deleted');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const addActivity = async (req: Request, res: Response) => {
  try {
    const activity = await sectionService.addActivity(req.params.id, req.params.sId, req.user!.userId, req.body);
    sendCreated(res, activity);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const removeActivity = async (req: Request, res: Response) => {
  try {
    await sectionService.removeActivity(req.params.id, req.params.sId, req.params.aId, req.user!.userId);
    sendSuccess(res, null, 200, 'Activity removed');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};
