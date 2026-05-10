import prisma from '../models/prisma';
import { tripService } from './trip.service';

export class StopService {
  async getStops(tripId: string) {
    return prisma.tripStop.findMany({
      where: { trip_id: tripId },
      include: { city: true },
      orderBy: { order_index: 'asc' },
    });
  }

  async createStop(tripId: string, userId: string, data: {
    city_id: string;
    order_index: number;
    arrival_date: Date;
    departure_date: Date;
    notes?: string;
  }) {
    await tripService.verifyOwnership(tripId, userId);

    // Verify city exists
    const city = await prisma.city.findUnique({ where: { id: data.city_id } });
    if (!city) throw { status: 404, message: 'City not found' };

    return prisma.tripStop.create({
      data: {
        trip_id: tripId,
        city_id: data.city_id,
        order_index: data.order_index,
        arrival_date: data.arrival_date,
        departure_date: data.departure_date,
        notes: data.notes,
      },
      include: { city: true },
    });
  }

  async updateStop(tripId: string, stopId: string, userId: string, data: Partial<{
    city_id: string;
    order_index: number;
    arrival_date: Date;
    departure_date: Date;
    notes: string;
  }>) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.tripStop.update({
      where: { id: stopId, trip_id: tripId },
      data,
      include: { city: true },
    });
  }

  async deleteStop(tripId: string, stopId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.tripStop.delete({
      where: { id: stopId, trip_id: tripId },
    });
  }

  async reorderStops(tripId: string, userId: string, stopIds: string[]) {
    await tripService.verifyOwnership(tripId, userId);

    const updates = stopIds.map((id, index) =>
      prisma.tripStop.update({
        where: { id },
        data: { order_index: index },
      })
    );

    return prisma.$transaction(updates);
  }
}

export const stopService = new StopService();
