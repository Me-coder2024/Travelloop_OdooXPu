'use client';
// Hook for expense CRUD and budget summary
import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useExpenses(tripId: string) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get(`/trips/${tripId}/expenses`); setExpenses(data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, [tripId]);

  const fetchSummary = useCallback(async () => {
    try { const { data } = await api.get(`/trips/${tripId}/expenses/summary`); setSummary(data.data); }
    catch (e) { console.error(e); }
  }, [tripId]);

  const createExpense = async (expenseData: any) => {
    const { data } = await api.post(`/trips/${tripId}/expenses`, expenseData);
    await fetchExpenses(); await fetchSummary();
    return data.data;
  };

  const updateExpense = async (eId: string, expenseData: any) => {
    const { data } = await api.patch(`/trips/${tripId}/expenses/${eId}`, expenseData);
    await fetchExpenses(); await fetchSummary();
    return data.data;
  };

  return { expenses, summary, loading, fetchExpenses, fetchSummary, createExpense, updateExpense };
}
