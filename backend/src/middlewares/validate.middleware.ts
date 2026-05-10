import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const fieldErrors = errors.array().map((err) => ({
      field: (err as any).path || (err as any).param || 'unknown',
      message: err.msg,
    }));

    res.status(422).json({
      success: false,
      errors: fieldErrors,
    });
    return;
  }

  next();
};
