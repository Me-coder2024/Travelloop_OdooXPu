import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(100),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(100),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain an uppercase letter').regex(/[0-9]/, 'Must contain a digit'),
  phone: z.string().optional(),
  city: z.string().min(2).max(100).optional().or(z.literal('')),
  country: z.string().min(2).max(100).optional().or(z.literal('')),
  additional_info: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
});

export const tripSchema = z.object({
  name: z.string().min(3, 'Trip name must be at least 3 characters').max(200),
  place: z.string().min(1, 'Place is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  description: z.string().optional(),
  total_budget: z.coerce.number().min(0).optional(),
});

export const sectionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().optional(),
  date_from: z.string().min(1, 'Start date required'),
  date_to: z.string().min(1, 'End date required'),
  budget: z.coerce.number().min(0, 'Budget must be positive'),
});

export const expenseSchema = z.object({
  category_id: z.string().uuid('Select a category'),
  description: z.string().min(1, 'Description required'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unit_cost: z.coerce.number().min(0, 'Unit cost must be positive'),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  expense_date: z.string().min(1, 'Date required'),
});

export const noteSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(1, 'Content is required').max(5000),
  note_date: z.string().min(1, 'Date required'),
  stop_id: z.string().optional(),
});

export const packingItemSchema = z.object({
  name: z.string().min(1, 'Item name required'),
  category: z.enum(['DOCUMENTS', 'CLOTHING', 'ELECTRONICS', 'OTHER']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type TripInput = z.infer<typeof tripSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type PackingItemInput = z.infer<typeof packingItemSchema>;
