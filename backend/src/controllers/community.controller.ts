import { Request, Response } from 'express';
import { communityService } from '../services/community.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const data = await communityService.getPosts(page, limit, search);
    sendSuccess(res, data);
  } catch (err: any) { sendError(res, err.message, 500); }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await communityService.createPost(req.user!.userId, req.body);
    sendCreated(res, post);
  } catch (err: any) { sendError(res, err.message, 500); }
};

export const reactToPost = async (req: Request, res: Response) => {
  try {
    const result = await communityService.toggleReaction(req.params.id, req.user!.userId, req.body.type);
    sendSuccess(res, result);
  } catch (err: any) { sendError(res, err.message, 500); }
};
