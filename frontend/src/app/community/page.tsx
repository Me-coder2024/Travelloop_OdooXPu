'use client';
import { useEffect, useState } from 'react';
import { useCommunity } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Heart, Bookmark, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityPage() {
  const { posts, loading, fetchPosts, toggleReaction, createPost } = useCommunity();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<any>(null);
  const [showNew, setShowNew] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => { fetchPosts(1, search || undefined); }, [fetchPosts, search]);

  const handleCreate = async () => {
    if (!newPost.title || !newPost.content) return;
    await createPost(newPost);
    setNewPost({ title: '', content: '' });
    setShowNew(false);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' }}>Community</h1>
        {user && <Button onClick={() => setShowNew(true)}>New Post</Button>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SearchBar
          value={search} onChange={setSearch}
          placeholder="Search posts..."
          groupByOptions={['All', 'Author', 'Date']}
          groupBy="All" onGroupByChange={() => {}}
          filterOptions={['All', 'My Posts', 'Most Liked']}
          activeFilter={activeFilter} onFilterChange={setActiveFilter}
          sortOptions={['Newest', 'Oldest', 'Most Liked']}
          sortBy={sortBy} onSortChange={setSortBy}
        />
      </div>

      {showNew && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-6">
          <input type="text" placeholder="Post title..." value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full px-3 py-2 mb-3 rounded-lg border border-[var(--color-border)] text-sm" />
          <textarea rows={4} placeholder="Share your travel experience..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full px-3 py-2 mb-3 rounded-lg border border-[var(--color-border)] text-sm" />
          <div className="flex gap-2">
            <Button onClick={handleCreate}>Publish</Button>
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? [1,2,3].map(i => <Skeleton key={i} className="h-32" />)
          : posts.length === 0 ? <EmptyState title="No posts yet" description="Be the first to share!" actionLabel="Create Post" onAction={() => setShowNew(true)} />
          : posts.map((post: any, i: number) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(post)} className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${selected?.id === post.id ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {post.user.avatar_url ? <img src={post.user.avatar_url} alt="" className="h-full w-full object-cover" /> : <User className="h-4 w-4 text-[var(--color-text-muted)]" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{post.user.first_name} {post.user.last_name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{post.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-4 mt-3">
                <button onClick={(e) => { e.stopPropagation(); toggleReaction(post.id, 'LIKE'); }} className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-red-500">
                  <Heart className={`h-4 w-4 ${post.reactions?.some((r: any) => r.type === 'LIKE' && r.user_id === user?.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {post.reactions?.filter((r: any) => r.type === 'LIKE').length || 0}
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleReaction(post.id, 'SAVE'); }} className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-blue-500">
                  <Bookmark className={`h-4 w-4 ${post.reactions?.some((r: any) => r.type === 'SAVE' && r.user_id === user?.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                </button>
                <span className="text-xs text-[var(--color-text-muted)]">{post.view_count} views</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right panel - detail */}
        <div className="hidden lg:block">
          {selected ? (
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-2">{selected.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">{selected.content}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-4">By {selected.user.first_name} {selected.user.last_name} · {new Date(selected.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-sm text-[var(--color-text-muted)]">Select a post to see details</div>
          )}
        </div>
      </div>
    </div>
  );
}
