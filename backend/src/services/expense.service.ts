import prisma from '../models/prisma';
import { tripService } from './trip.service';

export class ExpenseService {
  async getExpenses(tripId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.expense.findMany({
      where: { trip_id: tripId },
      include: { category: true },
      orderBy: { expense_date: 'desc' },
    });
  }

  async createExpense(tripId: string, userId: string, data: {
    category_id: string;
    description: string;
    quantity: number;
    unit_cost: number;
    amount: number;
    expense_date: Date;
  }) {
    await tripService.verifyOwnership(tripId, userId);

    // Verify category exists
    const category = await prisma.expenseCategory.findUnique({
      where: { id: data.category_id },
    });
    if (!category) throw { status: 404, message: 'Expense category not found' };

    return prisma.expense.create({
      data: {
        trip_id: tripId,
        user_id: userId,
        category_id: data.category_id,
        description: data.description,
        quantity: data.quantity,
        unit_cost: data.unit_cost,
        amount: data.amount,
        expense_date: data.expense_date,
      },
      include: { category: true },
    });
  }

  async updateExpense(tripId: string, expenseId: string, userId: string, data: Partial<{
    category_id: string;
    description: string;
    quantity: number;
    unit_cost: number;
    amount: number;
    expense_date: Date;
    payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  }>) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.expense.update({
      where: { id: expenseId, trip_id: tripId },
      data,
      include: { category: true },
    });
  }

  async deleteExpense(tripId: string, expenseId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.expense.delete({
      where: { id: expenseId, trip_id: tripId },
    });
  }

  // Live aggregate summary for charts (Screen 14 donut chart)
  async getExpenseSummary(tripId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    const byCategory = await prisma.expense.groupBy({
      by: ['category_id'],
      where: { trip_id: tripId },
      _sum: { amount: true },
      _count: true,
    });

    // Get category details
    const categories = await prisma.expenseCategory.findMany();
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    const summary = byCategory.map((item) => {
      const category = categoryMap.get(item.category_id);
      return {
        category_id: item.category_id,
        category_name: category?.name || 'Unknown',
        color_hex: category?.color_hex || '#666',
        icon: category?.icon || '📦',
        total_amount: item._sum.amount,
        count: item._count,
      };
    });

    const totalExpenses = await prisma.expense.aggregate({
      where: { trip_id: tripId },
      _sum: { amount: true },
      _count: true,
    });

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { total_budget: true, name: true },
    });

    return {
      trip_name: trip?.name,
      total_budget: trip?.total_budget,
      total_spent: totalExpenses._sum.amount || 0,
      expense_count: totalExpenses._count || 0,
      by_category: summary,
    };
  }
}

export const expenseService = new ExpenseService();
