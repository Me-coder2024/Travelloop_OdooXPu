import { Request, Response } from 'express';
import prisma from '../models/prisma';
import { sendSuccess, sendError } from '../utils/response';

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, username: true, first_name: true, last_name: true, email: true, phone: true, city: true, country: true, additional_info: true, avatar_url: true, role: true, created_at: true },
    });
    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, user);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to get user', 500);
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, phone, city, country, additional_info, avatar_url } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { first_name, last_name, phone, city, country, additional_info, avatar_url },
      select: { id: true, username: true, first_name: true, last_name: true, email: true, phone: true, city: true, country: true, additional_info: true, avatar_url: true, role: true },
    });
    sendSuccess(res, user, 200, 'Profile updated');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update profile', 500);
  }
};
