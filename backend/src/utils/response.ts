// Standardized API response helpers
import { Response } from 'express';

interface FieldError {
  field: string;
  message: string;
}

export const sendSuccess = (
  res: Response,
  data: unknown,
  statusCode = 200,
  message = 'Success'
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = (
  res: Response,
  data: unknown,
  message = 'Created successfully'
) => {
  return sendSuccess(res, data, 201, message);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const sendValidationError = (
  res: Response,
  errors: FieldError[]
) => {
  return res.status(422).json({
    success: false,
    errors,
  });
};

export const sendNotFound = (res: Response, entity = 'Resource') => {
  return sendError(res, `${entity} not found`, 404);
};

export const sendUnauthorized = (res: Response, message = 'Unauthorized') => {
  return sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message = 'Forbidden') => {
  return sendError(res, message, 403);
};
