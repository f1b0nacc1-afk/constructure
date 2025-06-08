import winston from 'winston'
import { config } from '../config'
import path from 'path'
import fs from 'fs'

// Создаем директорию для логов если она не существует
const logDir = process.env.LOG_FILE ? path.dirname(process.env.LOG_FILE) : 'logs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Кастомный формат для Docker
const dockerFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, service, stack, ...meta }) => {
    const logObject: Record<string, any> = {
      timestamp,
      level: level.toUpperCase(),
      service,
      message
    }
    
    if (stack) {
      logObject.stack = stack
    }
    
    if (Object.keys(meta).length > 0) {
      logObject.meta = meta
    }
    
    return JSON.stringify(logObject)
  })
)

// Формат для консоли в development
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

// Создаем транспорты
const transports: winston.transport[] = []

// Файловые транспорты
if (process.env.LOG_FILE) {
  // Основной лог файл
  transports.push(
    new winston.transports.File({
      filename: process.env.LOG_FILE,
      format: dockerFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    })
  )
  
  // Отдельный файл для ошибок
  transports.push(
    new winston.transports.File({
      filename: process.env.LOG_FILE.replace('.log', '.error.log'),
      level: 'error',
      format: dockerFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3,
      tailable: true
    })
  )
} else {
  // Локальные файлы
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'api.log'),
      format: dockerFormat,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: dockerFormat,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3
    })
  )
}

// Консольный транспорт
if (config.NODE_ENV === 'development' || process.env.ENABLE_CONSOLE_LOGS === 'true') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: config.LOG_LEVEL
    })
  )
}

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { 
    service: 'constructure-api',
    environment: config.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  },
  transports,
  // Обработчик необработанных исключений
  exceptionHandlers: [
    new winston.transports.File({
      filename: process.env.LOG_FILE ? 
        process.env.LOG_FILE.replace('.log', '.exceptions.log') : 
        path.join(logDir, 'exceptions.log'),
      format: dockerFormat
    })
  ],
  // Обработчик необработанных Promise rejection
  rejectionHandlers: [
    new winston.transports.File({
      filename: process.env.LOG_FILE ? 
        process.env.LOG_FILE.replace('.log', '.rejections.log') : 
        path.join(logDir, 'rejections.log'),
      format: dockerFormat
    })
  ]
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