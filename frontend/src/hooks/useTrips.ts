'use client';
// Hook for trip CRUD operations
import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useTrips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchTrips = useCallback(async (status?: string) => {
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const { data } = await api.get('/trips', { params });
      setTrips(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchTrip = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const createTrip = async (tripData: any) => {
    const { data } = await api.post('/trips', tripData);
    return data.data;
  };

  const updateTrip = async (id: string, tripData: any) => {
    const { data } = await api.patch(`/trips/${id}`, tripData);
    return data.data;
  };

  const deleteTrip = async (id: string) => {
    await api.delete(`/trips/${id}`);
  };

  return { trips, trip, loading, fetchTrips, fetchTrip, createTrip, updateTrip, deleteTrip };
}
