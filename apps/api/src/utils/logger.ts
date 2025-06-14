import * as winston from 'winston'
import { config } from '../config'

// Упрощенный формат для консоли
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, service, stack }) => {
    let log = `[${timestamp}] ${level} [${service}]: ${message}`
    if (stack) {
      log += `\n${stack}`
    }
    return log
  })
)

// Только консольный транспорт для отладки
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
    level: config.LOG_LEVEL
  })
]

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { 
    service: 'constructure-api',
    environment: config.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  },
  transports
})

// Хелперы для структурированного логирования
export const loggerHelpers = {
  // HTTP запросы
  httpRequest: (method: string, url: string, statusCode?: number, responseTime?: number, userAgent?: string) => {
    logger.info('HTTP Request', {
      type: 'http_request',
      method,
      url,
      statusCode,
      responseTime,
      userAgent
    })
  },

  // Database операции
  dbOperation: (operation: string, table: string, duration?: number, error?: Error) => {
    if (error) {
      logger.error('Database Operation Failed', {
        type: 'db_operation',
        operation,
        table,
        duration,
        error: error.message,
        stack: error.stack
      })
    } else {
      logger.debug('Database Operation', {
        type: 'db_operation',
        operation,
        table,
        duration
      })
    }
  },

  // Аутентификация
  auth: (event: string, userId?: string, email?: string, ip?: string) => {
    logger.info('Authentication Event', {
      type: 'auth',
      event,
      userId,
      email,
      ip
    })
  },

  // Бизнес события
  businessEvent: (event: string, data: Record<string, any>) => {
    logger.info('Business Event', {
      type: 'business_event',
      event,
      ...data
    })
  },

  // Системные события
  systemEvent: (event: string, data?: Record<string, any>) => {
    logger.info('System Event', {
      type: 'system_event',
      event,
      ...data
    })
  }
}

// Middleware для логирования ошибок Express/Fastify
export const errorLogger = (error: Error, context?: Record<string, any>) => {
  logger.error('Application Error', {
    type: 'application_error',
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context
  })
} 