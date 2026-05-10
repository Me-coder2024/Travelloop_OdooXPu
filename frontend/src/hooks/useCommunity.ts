'use client';
import { useState, useCallback } from 'react';
import api from '@/lib/api';

export function useCommunity() {
  const [posts, setPosts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (page = 1, search?: string) => {
    setLoading(true);
    try {
      const params: any = { page };
      if (search) params.search = search;
      const { data } = await api.get('/community', { params });
      setPosts(data.data.posts);
      setPagination(data.data.pagination);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  const createPost = async (postData: any) => {
    await api.post('/community', postData);
    await fetchPosts();
  };

  const toggleReaction = async (postId: string, type: 'LIKE' | 'SAVE') => {
    await api.post(`/community/${postId}/react`, { type });
    await fetchPosts();
  };

  return { posts, pagination, loading, fetchPosts, createPost, toggleReaction };
}
