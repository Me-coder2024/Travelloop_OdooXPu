import prisma from '../models/prisma';
import { tripService } from './trip.service';

export class SectionService {
  async getSections(tripId: string) {
    return prisma.itinerarySection.findMany({
      where: { trip_id: tripId },
      include: {
        activities: {
          include: { activity: true },
          orderBy: { scheduled_time: 'asc' },
        },
      },
      orderBy: { order_index: 'asc' },
    });
  }

  async createSection(tripId: string, userId: string, data: {
    title: string;
    description?: string;
    date_from: Date;
    date_to: Date;
    budget: number;
    order_index: number;
  }) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.itinerarySection.create({
      data: {
        trip_id: tripId,
        title: data.title,
        description: data.description,
        date_from: data.date_from,
        date_to: data.date_to,
        budget: data.budget,
        order_index: data.order_index,
      },
      include: {
        activities: { include: { activity: true } },
      },
    });
  }

  async updateSection(tripId: string, sectionId: string, userId: string, data: Partial<{
    title: string;
    description: string;
    date_from: Date;
    date_to: Date;
    budget: number;
    order_index: number;
  }>) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.itinerarySection.update({
      where: { id: sectionId, trip_id: tripId },
      data,
      include: {
        activities: { include: { activity: true } },
      },
    });
  }

  async deleteSection(tripId: string, sectionId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.itinerarySection.delete({
      where: { id: sectionId, trip_id: tripId },
    });
  }

  async addActivity(tripId: string, sectionId: string, userId: string, data: {
    activity_id?: string;
    custom_name?: string;
    scheduled_time?: string;
    duration_mins?: number;
    cost?: number;
    notes?: string;
  }) {
    await tripService.verifyOwnership(tripId, userId);

    // Verify section belongs to trip
    const section = await prisma.itinerarySection.findFirst({
      where: { id: sectionId, trip_id: tripId },
    });
    if (!section) throw { status: 404, message: 'Section not found' };

    return prisma.sectionActivity.create({
      data: {
        section_id: sectionId,
        activity_id: data.activity_id || null,
        custom_name: data.custom_name,
        scheduled_time: data.scheduled_time ? new Date(`1970-01-01T${data.scheduled_time}`) : null,
        duration_mins: data.duration_mins,
        cost: data.cost || 0,
        notes: data.notes,
      },
      include: { activity: true },
    });
  }

  async removeActivity(tripId: string, sectionId: string, activityId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.sectionActivity.delete({
      where: { id: activityId, section_id: sectionId },
    });
  }
}

export const sectionService = new SectionService();
