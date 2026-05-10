import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated, sendError, sendUnauthorized } from '../utils/response';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.cookie('access_token', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendCreated(res, result.user, 'Registration successful');
  } catch (err: any) {
    if (err.field) return res.status(err.status || 409).json({ success: false, errors: [{ field: err.field, message: err.message }] });
    sendError(res, err.message || 'Registration failed', err.status || 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.cookie('access_token', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendSuccess(res, result.user, 200, 'Login successful');
  } catch (err: any) {
    sendUnauthorized(res, err.message || 'Invalid credentials');
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) return sendUnauthorized(res, 'Refresh token required');
    const tokens = await authService.refresh(refreshToken);
    res.cookie('access_token', tokens.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', tokens.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    sendSuccess(res, { message: 'Tokens refreshed' });
  } catch (err: any) {
    sendUnauthorized(res, err.message || 'Invalid refresh token');
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  sendSuccess(res, null, 200, 'Logged out successfully');
};
