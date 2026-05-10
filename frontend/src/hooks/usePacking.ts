'use client';
// Hook for packing checklist with progress tracking
import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function usePacking(tripId: string) {
  const [data, setData] = useState<any>({ items: {}, total: 0, packed: 0, progress: 0 });
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try { const res = await api.get(`/trips/${tripId}/packing`); setData(res.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, [tripId]);

  const addItem = async (itemData: any) => {
    await api.post(`/trips/${tripId}/packing`, itemData);
    await fetchItems();
  };

  const toggleItem = async (itemId: string) => {
    await api.patch(`/trips/${tripId}/packing/${itemId}`);
    await fetchItems();
  };

  const deleteItem = async (itemId: string) => {
    await api.delete(`/trips/${tripId}/packing/${itemId}`);
    await fetchItems();
  };

  const resetAll = async () => {
    await api.post(`/trips/${tripId}/packing/reset`);
    await fetchItems();
  };

  return { ...data, loading, fetchItems, addItem, toggleItem, deleteItem, resetAll };
}
