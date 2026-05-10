import prisma from '../models/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

export class AuthService {
  async register(data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    country?: string;
    additional_info?: string;
    avatar_url?: string;
  }) {
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === data.username) {
        throw { status: 409, field: 'username', message: 'Username already taken' };
      }
      throw { status: 409, field: 'email', message: 'Email already registered' };
    }

    const password_hash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password_hash,
        phone: data.phone,
        city: data.city,
        country: data.country,
        additional_info: data.additional_info,
        avatar_url: data.avatar_url,
      },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        city: true,
        country: true,
        avatar_url: true,
        role: true,
        created_at: true,
      },
    });

    const tokens = this.generateTokens(user.id, user.role);
    return { user, ...tokens };
  }

  async login(username: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
        is_active: true,
      },
    });

    if (!user) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    const tokens = this.generateTokens(user.id, user.role);

    const { password_hash, ...safeUser } = user;
    return { user: safeUser, ...tokens };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId, is_active: true },
      select: { id: true, role: true },
    });

    if (!user) {
      throw { status: 401, message: 'User not found or deactivated' };
    }

    return this.generateTokens(user.id, user.role);
  }

  private generateTokens(userId: string, role: string) {
    const accessToken = generateAccessToken({ userId, role });
    const refreshToken = generateRefreshToken({ userId, role });
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
