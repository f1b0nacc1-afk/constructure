import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RegisterRequest, LoginRequest, AuthResponse } from '@constructure/types';

const prisma = new PrismaClient();

interface JWTPayload {
  userId: string;
  email: string;
}

export default async function authRoutes(fastify: FastifyInstance) {
  // Регистрация
  fastify.post<{ Body: RegisterRequest }>('/register', async (request, reply) => {
    try {
      const { email, password, firstName, lastName } = request.body;

      // Проверяем, существует ли пользователь
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return reply.status(400).send({
          error: 'User with this email already exists'
        });
      }

      // Хешируем пароль
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Создаем пользователя
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=6366f1&color=fff`
        }
      });

      // Генерируем токены
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );

      // Сохраняем refresh token в базе
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
      });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken
      };

      reply.send(response);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Вход
  fastify.post<{ Body: LoginRequest }>('/login', async (request, reply) => {
    try {
      const { email, password } = request.body;

      // Находим пользователя
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return reply.status(401).send({
          error: 'Invalid credentials'
        });
      }

      // Проверяем пароль
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return reply.status(401).send({
          error: 'Invalid credentials'
        });
      }

      // Генерируем токены
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '7d' }
      );

      // Обновляем refresh token в базе
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          refreshToken,
          lastLoginAt: new Date()
        }
      });

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken
      };

      reply.send(response);
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Обновление токена
  fastify.post<{ Body: { refreshToken: string } }>('/refresh', async (request, reply) => {
    try {
      const { refreshToken } = request.body;

      if (!refreshToken) {
        return reply.status(401).send({ error: 'Refresh token required' });
      }

      // Верифицируем refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JWTPayload;

      // Находим пользователя и проверяем токен
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || user.refreshToken !== refreshToken) {
        return reply.status(401).send({ error: 'Invalid refresh token' });
      }

      // Генерируем новый access token
      const newAccessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      );

      reply.send({ accessToken: newAccessToken });
    } catch (error) {
      fastify.log.error(error);
      reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });

  // Выход
  fastify.post('/logout', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ error: 'Authorization header required' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      // Удаляем refresh token из базы
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { refreshToken: null }
      });

      reply.send({ message: 'Logged out successfully' });
    } catch (error) {
      fastify.log.error(error);
      reply.status(401).send({ error: 'Invalid token' });
    }
  });

  // Получение текущего пользователя
  fastify.get('/me', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return reply.status(401).send({ error: 'Authorization header required' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      reply.send({ user });
    } catch (error) {
      fastify.log.error(error);
      reply.status(401).send({ error: 'Invalid token' });
    }
  });
} 