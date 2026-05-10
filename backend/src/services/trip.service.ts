import prisma from '../models/prisma';
import { TripStatus } from '@prisma/client';

export class TripService {
  async getTrips(userId: string, status?: TripStatus) {
    const where: any = { user_id: userId };
    if (status) where.status = status;

    return prisma.trip.findMany({
      where,
      include: {
        stops: { include: { city: true }, orderBy: { order_index: 'asc' } },
        _count: { select: { sections: true, expenses: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getTripById(tripId: string, userId?: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        user: {
          select: { id: true, username: true, first_name: true, last_name: true, avatar_url: true },
        },
        stops: {
          include: { city: true },
          orderBy: { order_index: 'asc' },
        },
        sections: {
          include: {
            activities: { include: { activity: true } },
          },
          orderBy: { order_index: 'asc' },
        },
        _count: { select: { expenses: true, packing_items: true, notes: true } },
      },
    });

    if (!trip) throw { status: 404, message: 'Trip not found' };

    // If userId provided, check ownership (for edit operations)
    if (userId && trip.user_id !== userId) {
      throw { status: 403, message: 'Not authorized to access this trip' };
    }

    return trip;
  }

  async createTrip(userId: string, data: {
    name: string;
    place: string;
    cover_image_url?: string;
    description?: string;
    start_date: Date;
    end_date: Date;
    total_budget?: number;
  }) {
    return prisma.trip.create({
      data: {
        user_id: userId,
        name: data.name,
        place: data.place,
        cover_image_url: data.cover_image_url,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        total_budget: data.total_budget,
      },
      include: {
        stops: true,
        sections: true,
      },
    });
  }

  async updateTrip(tripId: string, userId: string, data: Partial<{
    name: string;
    place: string;
    cover_image_url: string;
    description: string;
    start_date: Date;
    end_date: Date;
    status: TripStatus;
    is_public: boolean;
    total_budget: number;
  }>) {
    // Verify ownership
    await this.verifyOwnership(tripId, userId);

    return prisma.trip.update({
      where: { id: tripId },
      data,
      include: {
        stops: { include: { city: true }, orderBy: { order_index: 'asc' } },
        sections: { orderBy: { order_index: 'asc' } },
      },
    });
  }

  async deleteTrip(tripId: string, userId: string) {
    await this.verifyOwnership(tripId, userId);
    return prisma.trip.delete({ where: { id: tripId } });
  }

  async verifyOwnership(tripId: string, userId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { user_id: true },
    });

    if (!trip) throw { status: 404, message: 'Trip not found' };
    if (trip.user_id !== userId) {
      throw { status: 403, message: 'Not authorized to modify this trip' };
    }

    return trip;
  }
}

export const tripService = new TripService();
