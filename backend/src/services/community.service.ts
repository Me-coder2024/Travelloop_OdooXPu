import prisma from '../models/prisma';

export class CommunityService {
  async getPosts(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { is_public: true };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, first_name: true, last_name: true, avatar_url: true } },
          trip: { select: { id: true, name: true, place: true } },
          _count: { select: { reactions: true } },
          reactions: { select: { type: true, user_id: true } },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.communityPost.count({ where }),
    ]);

    return { posts, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createPost(userId: string, data: { title: string; content: string; trip_id?: string; is_public?: boolean }) {
    return prisma.communityPost.create({
      data: { user_id: userId, title: data.title, content: data.content, trip_id: data.trip_id || null, is_public: data.is_public ?? true },
      include: { user: { select: { id: true, username: true, first_name: true, last_name: true, avatar_url: true } } },
    });
  }

  async toggleReaction(postId: string, userId: string, type: 'LIKE' | 'SAVE') {
    const existing = await prisma.postReaction.findUnique({
      where: { post_id_user_id_type: { post_id: postId, user_id: userId, type } },
    });
    if (existing) {
      await prisma.postReaction.delete({ where: { id: existing.id } });
      return { action: 'removed', type };
    }
    await prisma.postReaction.create({ data: { post_id: postId, user_id: userId, type } });
    return { action: 'added', type };
  }
}

export const communityService = new CommunityService();
