import { Request, Response } from 'express';
import prisma from '../models/prisma';
import { sendSuccess, sendError } from '../utils/response';

export const getCities = async (req: Request, res: Response) => {
  try {
    const { search, country, region } = req.query;
    const where: any = {};
    if (search) where.name = { contains: search as string, mode: 'insensitive' };
    if (country) where.country = { contains: country as string, mode: 'insensitive' };
    if (region) where.region = { contains: region as string, mode: 'insensitive' };
    const cities = await prisma.city.findMany({ where, orderBy: { popularity_score: 'desc' }, include: { _count: { select: { activities: true } } } });
    sendSuccess(res, cities);
  } catch (err: any) { sendError(res, err.message, 500); }
};

export const getCityActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activityCatalog.findMany({ where: { city_id: req.params.id as string }, orderBy: { name: 'asc' } });
    sendSuccess(res, activities);
  } catch (err: any) { sendError(res, err.message, 500); }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const { category, city_id, maxCost, search } = req.query;
    const where: any = {};
    if (category) where.category = category as string;
    if (city_id) where.city_id = city_id as string;
    if (maxCost) where.avg_cost = { lte: parseFloat(maxCost as string) };
    if (search) where.name = { contains: search as string, mode: 'insensitive' };
    const activities = await prisma.activityCatalog.findMany({ where, include: { city: { select: { name: true, country: true } } }, orderBy: { name: 'asc' } });
    sendSuccess(res, activities);
  } catch (err: any) { sendError(res, err.message, 500); }
};
