import prisma from '../models/prisma';

export class AdminService {
  async getStats() {
    const [totalUsers, totalTrips, totalExpenses, activeTrips, tripsByStatus, expensesByCategory, recentTrips] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.expense.aggregate({ _sum: { amount: true }, _count: true }),
      prisma.trip.count({ where: { status: 'ONGOING' } }),
      prisma.trip.groupBy({ by: ['status'], _count: true }),
      prisma.expense.groupBy({
        by: ['category_id'],
        _sum: { amount: true },
        _count: true,
      }),
      prisma.trip.findMany({ take: 10, orderBy: { created_at: 'desc' }, select: { id: true, name: true, place: true, status: true, created_at: true } }),
    ]);

    const categories = await prisma.expenseCategory.findMany();
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    return {
      overview: { totalUsers, totalTrips, activeTrips, totalRevenue: totalExpenses._sum.amount || 0, totalExpenseCount: totalExpenses._count },
      tripsByStatus: tripsByStatus.map((t) => ({ status: t.status, count: t._count })),
      expensesByCategory: expensesByCategory.map((e) => ({
        category: categoryMap.get(e.category_id)?.name || 'Unknown',
        color: categoryMap.get(e.category_id)?.color_hex || '#666',
        total: e._sum.amount,
        count: e._count,
      })),
      recentTrips,
    };
  }

  async getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip, take: limit, orderBy: { created_at: 'desc' },
        select: { id: true, username: true, first_name: true, last_name: true, email: true, role: true, is_active: true, created_at: true, _count: { select: { trips: true } } },
      }),
      prisma.user.count(),
    ]);
    return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateUser(userId: string, data: { role?: 'USER' | 'ADMIN'; is_active?: boolean }) {
    return prisma.user.update({ where: { id: userId }, data, select: { id: true, username: true, role: true, is_active: true } });
  }
}

export const adminService = new AdminService();
