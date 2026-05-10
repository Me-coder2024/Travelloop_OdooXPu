'use client';
// Hook for itinerary sections management
import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useSections(tripId: string) {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get(`/trips/${tripId}/sections`); setSections(data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, [tripId]);

  const createSection = async (sectionData: any) => {
    const { data } = await api.post(`/trips/${tripId}/sections`, sectionData);
    await fetchSections();
    return data.data;
  };

  const updateSection = async (sId: string, sectionData: any) => {
    const { data } = await api.patch(`/trips/${tripId}/sections/${sId}`, sectionData);
    await fetchSections();
    return data.data;
  };

  const deleteSection = async (sId: string) => {
    await api.delete(`/trips/${tripId}/sections/${sId}`);
    await fetchSections();
  };

  const addActivity = async (sId: string, actData: any) => {
    const { data } = await api.post(`/trips/${tripId}/sections/${sId}/activities`, actData);
    await fetchSections();
    return data.data;
  };

  return { sections, loading, fetchSections, createSection, updateSection, deleteSection, addActivity };
}
