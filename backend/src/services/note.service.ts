import prisma from '../models/prisma';
import { tripService } from './trip.service';

export class NoteService {
  async getNotes(tripId: string, userId: string, filter?: { stop_id?: string }) {
    await tripService.verifyOwnership(tripId, userId);

    const where: any = { trip_id: tripId, user_id: userId };
    if (filter?.stop_id) where.stop_id = filter.stop_id;

    return prisma.tripNote.findMany({
      where,
      include: {
        stop: { include: { city: true } },
      },
      orderBy: { note_date: 'desc' },
    });
  }

  async createNote(tripId: string, userId: string, data: {
    title: string;
    content: string;
    note_date: Date;
    stop_id?: string;
  }) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.tripNote.create({
      data: {
        trip_id: tripId,
        user_id: userId,
        title: data.title,
        content: data.content,
        note_date: data.note_date,
        stop_id: data.stop_id || null,
      },
      include: {
        stop: { include: { city: true } },
      },
    });
  }

  async updateNote(tripId: string, noteId: string, userId: string, data: Partial<{
    title: string;
    content: string;
    note_date: Date;
    stop_id: string;
  }>) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.tripNote.update({
      where: { id: noteId, trip_id: tripId },
      data,
      include: {
        stop: { include: { city: true } },
      },
    });
  }

  async deleteNote(tripId: string, noteId: string, userId: string) {
    await tripService.verifyOwnership(tripId, userId);

    return prisma.tripNote.delete({
      where: { id: noteId, trip_id: tripId },
    });
  }
}

export const noteService = new NoteService();
