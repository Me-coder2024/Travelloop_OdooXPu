import { Router } from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as trip from '../controllers/trip.controller';
import * as stop from '../controllers/stop.controller';
import * as section from '../controllers/section.controller';
import * as expense from '../controllers/expense.controller';
import * as packing from '../controllers/packing.controller';
import * as note from '../controllers/note.controller';
import * as share from '../controllers/share.controller';

const router = Router();

// Trip CRUD
router.get('/', authMiddleware, trip.getTrips);
router.post('/', authMiddleware, [
  body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Trip name must be 3-200 characters'),
  body('place').trim().notEmpty().withMessage('Place is required'),
  body('start_date').isISO8601().withMessage('Valid start date required'),
  body('end_date').isISO8601().withMessage('Valid end date required'),
], validate, trip.createTrip);
router.get('/:id', authMiddleware, trip.getTripById);
router.patch('/:id', authMiddleware, trip.updateTrip);
router.delete('/:id', authMiddleware, trip.deleteTrip);

// Stops
router.get('/:id/stops', authMiddleware, stop.getStops);
router.post('/:id/stops', authMiddleware, stop.createStop);
router.patch('/:id/stops/:stopId', authMiddleware, stop.updateStop);
router.delete('/:id/stops/:stopId', authMiddleware, stop.deleteStop);

// Sections
router.get('/:id/sections', authMiddleware, section.getSections);
router.post('/:id/sections', authMiddleware, [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('date_from').isISO8601().withMessage('Valid start date required'),
  body('date_to').isISO8601().withMessage('Valid end date required'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
], validate, section.createSection);
router.patch('/:id/sections/:sId', authMiddleware, section.updateSection);
router.delete('/:id/sections/:sId', authMiddleware, section.deleteSection);
router.post('/:id/sections/:sId/activities', authMiddleware, section.addActivity);
router.delete('/:id/sections/:sId/activities/:aId', authMiddleware, section.removeActivity);

// Expenses
router.get('/:id/expenses', authMiddleware, expense.getExpenses);
router.post('/:id/expenses', authMiddleware, [
  body('category_id').isUUID().withMessage('Valid category ID required'),
  body('description').trim().notEmpty().withMessage('Description required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be positive integer'),
  body('unit_cost').isFloat({ min: 0 }).withMessage('Unit cost must be positive'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
], validate, expense.createExpense);
router.patch('/:id/expenses/:eId', authMiddleware, expense.updateExpense);
router.delete('/:id/expenses/:eId', authMiddleware, expense.deleteExpense);
router.get('/:id/expenses/summary', authMiddleware, expense.getExpenseSummary);

// Packing
router.get('/:id/packing', authMiddleware, packing.getPackingItems);
router.post('/:id/packing', authMiddleware, packing.createPackingItem);
router.patch('/:id/packing/:itemId', authMiddleware, packing.togglePackingItem);
router.delete('/:id/packing/:itemId', authMiddleware, packing.deletePackingItem);
router.post('/:id/packing/reset', authMiddleware, packing.resetPacking);

// Notes
router.get('/:id/notes', authMiddleware, note.getNotes);
router.post('/:id/notes', authMiddleware, [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be 1-5000 characters'),
], validate, note.createNote);
router.patch('/:id/notes/:nId', authMiddleware, note.updateNote);
router.delete('/:id/notes/:nId', authMiddleware, note.deleteNote);

// Share
router.post('/:id/share', authMiddleware, share.shareTrip);

export default router;
