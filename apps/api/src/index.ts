import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import websocket from '@fastify/websocket'
import { config } from './config'
import { logger } from './utils/logger'

const fastify = Fastify({
  logger: {
    level: config.LOG_LEVEL,
  },
})

async function start() {
  try {
    // Регистрируем плагины
    await fastify.register(cors, {
      origin: config.CORS_ORIGIN,
      credentials: true,
    })

    await fastify.register(jwt, {
      secret: config.JWT_SECRET,
    })

    await fastify.register(multipart)
    await fastify.register(websocket)

    // Базовый роут для проверки здоровья
    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() }
    })

    // Запускаем сервер
    await fastify.listen({ 
      port: config.PORT, 
      host: config.HOST 
    })

    logger.info(`🚀 Server running on http://${config.HOST}:${config.PORT}`)
  } catch (err) {
    logger.error('❌ Error starting server:', err)
    process.exit(1)
  }
}

start() 