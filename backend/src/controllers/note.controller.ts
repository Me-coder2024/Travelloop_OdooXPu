import { Request, Response } from 'express';
import { noteService } from '../services/note.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getNotes = async (req: Request, res: Response) => {
  try {
    const filter = req.query.stop_id ? { stop_id: req.query.stop_id as string } : undefined;
    const notes = await noteService.getNotes(req.params.id as string, req.user!.userId, filter);
    sendSuccess(res, notes);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const note = await noteService.createNote(req.params.id as string, req.user!.userId, req.body);
    sendCreated(res, note);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const note = await noteService.updateNote(req.params.id as string, req.params.nId as string, req.user!.userId, req.body);
    sendSuccess(res, note, 200, 'Note updated');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    await noteService.deleteNote(req.params.id as string, req.params.nId as string, req.user!.userId);
    sendSuccess(res, null, 200, 'Note deleted');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};
