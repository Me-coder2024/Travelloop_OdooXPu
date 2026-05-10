import { Request, Response, NextFunction } from 'express';
export const apiVersion = (_req: Request, res: Response, next: NextFunction) => { res.setHeader('X-API-Version', '1.0.0'); res.setHeader('X-Powered-By', 'Traveloop'); next(); };
