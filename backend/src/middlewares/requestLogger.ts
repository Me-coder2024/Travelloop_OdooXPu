import { Request, Response, NextFunction } from 'express';
export const requestLogger = (req: Request, _res: Response, next: NextFunction) => { const start = Date.now(); _res.on('finish', () => { console.log([req.method, req.originalUrl, _res.statusCode, Date.now()-start+'ms'].join(' ')); }); next(); };
