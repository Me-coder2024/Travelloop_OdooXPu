import prisma from '../models/prisma';
import { PackingCategory } from '@prisma/client';
import { tripService } from './trip.service';

export class PackingService {
  async getPackingItems(tripId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    const items = await prisma.packingItem.findMany({
      where: { trip_id: tripId, user_id: userId },
      orderBy: [{ category: 'asc' }, { created_at: 'asc' }],
    });

    // Group by category
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof items>);

    // Calculate progress
    const total = items.length;
    const packed = items.filter((i) => i.is_packed).length;
    const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

    return { items: grouped, total, packed, progress };
  }

  async createItem(tripId: string, userId: string, data: {
    name: string;
    category: PackingCategory;
  }) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.packingItem.create({
      data: {
        trip_id: tripId,
        user_id: userId,
        name: data.name,
        category: data.category,
      },
    });
  }

  async toggleItem(tripId: string, itemId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    const item = await prisma.packingItem.findFirst({
      where: { id: itemId, trip_id: tripId, user_id: userId },
    });

    if (!item) throw { status: 404, message: 'Packing item not found' };

    return prisma.packingItem.update({
      where: { id: itemId },
      data: { is_packed: !item.is_packed },
    });
  }

  async deleteItem(tripId: string, itemId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.packingItem.delete({
      where: { id: itemId, trip_id: tripId },
    });
  }

  async resetAll(tripId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.packingItem.updateMany({
      where: { trip_id: tripId, user_id: userId },
      data: { is_packed: false },
    });
  }
}

export const packingService = new PackingService();
