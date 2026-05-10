import { Request, Response } from 'express';
import { tripService } from '../services/trip.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getTrips = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as any;
    const trips = await tripService.getTrips(req.user!.userId, status);
    sendSuccess(res, trips);
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const trip = await tripService.getTripById(req.params.id as string, req.user!.userId);
    sendSuccess(res, trip);
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const createTrip = async (req: Request, res: Response) => {
  try {
    const trip = await tripService.createTrip(req.user!.userId, req.body);
    sendCreated(res, trip);
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const updateTrip = async (req: Request, res: Response) => {
  try {
    const trip = await tripService.updateTrip(req.params.id as string, req.user!.userId, req.body);
    sendSuccess(res, trip, 200, 'Trip updated');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};

export const deleteTrip = async (req: Request, res: Response) => {
  try {
    await tripService.deleteTrip(req.params.id as string, req.user!.userId);
    sendSuccess(res, null, 200, 'Trip deleted');
  } catch (err: any) {
    sendError(res, err.message, err.status || 500);
  }
};
