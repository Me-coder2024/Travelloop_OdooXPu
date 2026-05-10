// Rate limiting - auth 10/15min, API 100/min
import { RateLimiterMemory } from 'rate-limiter-flexible';
// Rate limiting - auth 10/15min, API 100/min
import { Request, Response, NextFunction } from 'express';

// Auth endpoints: 10 requests per 15 minutes
const authLimiter = new RateLimiterMemory({
  points: 10,
  duration: 15 * 60, // 15 minutes
  keyPrefix: 'auth',
});

// General API: 100 requests per minute
const apiLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60, // 1 minute
  keyPrefix: 'api',
});

export const authRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.ip || 'unknown';
    await authLimiter.consume(key);
    next();
  } catch {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.',
    });
  }
};

export const apiRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.ip || 'unknown';
    await apiLimiter.consume(key);
    next();
  } catch {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }
};
