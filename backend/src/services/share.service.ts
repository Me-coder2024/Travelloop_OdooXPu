import prisma from '../models/prisma';

export class ShareService {
  async getSharedTrip(shareToken: string) {
    const trip = await prisma.trip.findUnique({
      where: { share_token: shareToken },
      include: {
        user: { select: { id: true, username: true, first_name: true, last_name: true, avatar_url: true } },
        stops: { include: { city: true }, orderBy: { order_index: 'asc' } },
        sections: { include: { activities: { include: { activity: true } } }, orderBy: { order_index: 'asc' } },
        expenses: { include: { category: true } },
      },
    });
    if (!trip || !trip.is_public) throw { status: 404, message: 'Shared trip not found' };
    return trip;
  }

  async shareTrip(tripId: string, userId: string, data: { shared_with_email: string; permission?: 'VIEW' | 'EDIT' }) {
    const trip = await prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip || trip.user_id !== userId) throw { status: 403, message: 'Not authorized' };
    // Make trip public if not already
    if (!trip.is_public) {
      await prisma.trip.update({ where: { id: tripId }, data: { is_public: true } });
    }
    return prisma.tripShare.create({
      data: { trip_id: tripId, shared_by: userId, shared_with_email: data.shared_with_email, permission: data.permission || 'VIEW' },
    });
  }
}

export const shareService = new ShareService();
