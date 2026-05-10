import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.middleware';
import { authRateLimit } from '../middlewares/rateLimiter';
import * as auth from '../controllers/auth.controller';

const router = Router();

router.post('/register', authRateLimit, [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('first_name').trim().isLength({ min: 2, max: 100 }).withMessage('First name must be 2-100 characters'),
  body('last_name').trim().isLength({ min: 2, max: 100 }).withMessage('Last name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/).withMessage('Password must be 8+ chars with 1 uppercase and 1 digit'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone format'),
  body('city').optional().isLength({ min: 2, max: 100 }).withMessage('City must be 2-100 characters'),
  body('country').optional().isLength({ min: 2, max: 100 }).withMessage('Country must be 2-100 characters'),
], validate, auth.register);

router.post('/login', authRateLimit, [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, auth.login);

router.post('/refresh', auth.refresh);
router.post('/logout', auth.logout);

export default router;
