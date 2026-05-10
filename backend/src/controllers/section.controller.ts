import { Request, Response } from 'express';
import { sectionService } from '../services/section.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getSections = async (req: Request, res: Response) => {
  try {
    const sections = await sectionService.getSections(req.params.id as string);
    sendSuccess(res, sections);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const createSection = async (req: Request, res: Response) => {
  try {
    const section = await sectionService.createSection(req.params.id as string, req.user!.userId, req.body);
    sendCreated(res, section);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const updateSection = async (req: Request, res: Response) => {
  try {
    const section = await sectionService.updateSection(req.params.id as string, req.params.sId as string, req.user!.userId, req.body);
    sendSuccess(res, section, 200, 'Section updated');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const deleteSection = async (req: Request, res: Response) => {
  try {
    await sectionService.deleteSection(req.params.id as string, req.params.sId as string, req.user!.userId);
    sendSuccess(res, null, 200, 'Section deleted');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const addActivity = async (req: Request, res: Response) => {
  try {
    const activity = await sectionService.addActivity(req.params.id as string, req.params.sId as string, req.user!.userId, req.body);
    sendCreated(res, activity);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const removeActivity = async (req: Request, res: Response) => {
  try {
    await sectionService.removeActivity(req.params.id as string, req.params.sId as string, req.params.aId as string, req.user!.userId);
    sendSuccess(res, null, 200, 'Activity removed');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};
