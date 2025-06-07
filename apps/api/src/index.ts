import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import websocket from '@fastify/websocket'
import { config } from './config'
import { logger } from './utils/logger'
import authRoutes from './routes/auth'

const fastify = Fastify({
  logger: {
    level: config.LOG_LEVEL,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  },
})

// Регистрируем плагины
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: config.FRONTEND_URL,
    credentials: true
  })

  // WebSocket поддержка
  await fastify.register(websocket)

  // Маршруты аутентификации
  await fastify.register(authRoutes, { prefix: '/api/auth' })
}

// Базовый маршрут для проверки здоровья
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Запуск сервера
async function start() {
  try {
    await registerPlugins()
    
    await fastify.listen({
      port: config.PORT,
      host: config.HOST
    })
    
    logger.info(`🚀 Server running on http://${config.HOST}:${config.PORT}`)
  } catch (error) {
    logger.error('Error starting server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...')
  await fastify.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...')
  await fastify.close()
  process.exit(0)
})

start() 