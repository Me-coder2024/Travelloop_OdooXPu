import { Request, Response } from 'express';
import { expenseService } from '../services/expense.service';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await expenseService.getExpenses(req.params.id as string, req.user!.userId);
    sendSuccess(res, expenses);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const expense = await expenseService.createExpense(req.params.id as string, req.user!.userId, req.body);
    sendCreated(res, expense);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id as string, req.params.eId as string, req.user!.userId, req.body);
    sendSuccess(res, expense, 200, 'Expense updated');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    await expenseService.deleteExpense(req.params.id as string, req.params.eId as string, req.user!.userId);
    sendSuccess(res, null, 200, 'Expense deleted');
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};

export const getExpenseSummary = async (req: Request, res: Response) => {
  try {
    const summary = await expenseService.getExpenseSummary(req.params.id as string, req.user!.userId);
    sendSuccess(res, summary);
  } catch (err: any) { sendError(res, err.message, err.status || 500); }
};
