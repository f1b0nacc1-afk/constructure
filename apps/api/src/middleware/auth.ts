import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
    };
  }
}

export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.status(401).send({ error: 'Authorization header required' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return reply.status(401).send({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    request.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
}

export function optionalAuth(request: FastifyRequest, reply: FastifyReply, done: () => void) {
  const authHeader = request.headers.authorization;
  
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        request.user = {
          userId: decoded.userId,
          email: decoded.email
        };
      }
    } catch (error) {
      // Игнорируем ошибки для опционального auth
    }
  }
  
  done();
} 