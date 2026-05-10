'use client';
import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useNotes(tripId: string) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async (stopId?: string) => {
    setLoading(true);
    try {
      const params = stopId ? { stop_id: stopId } : {};
      const { data } = await api.get(`/trips/${tripId}/notes`, { params });
      setNotes(data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [tripId]);

  const createNote = async (noteData: any) => {
    const { data } = await api.post(`/trips/${tripId}/notes`, noteData);
    await fetchNotes(); return data.data;
  };

  const updateNote = async (nId: string, noteData: any) => {
    await api.patch(`/trips/${tripId}/notes/${nId}`, noteData);
    await fetchNotes();
  };

  const deleteNote = async (nId: string) => {
    await api.delete(`/trips/${tripId}/notes/${nId}`);
    await fetchNotes();
  };

  return { notes, loading, fetchNotes, createNote, updateNote, deleteNote };
}
