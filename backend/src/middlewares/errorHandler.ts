import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  // Never expose stack traces in production
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: err.stack,
  });
};
