// Утилита для работы с environment переменными в Next.js

const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL'
] as const;

type RequiredEnvVar = typeof requiredEnvVars[number];

// Функция для получения обязательной переменной окружения
function getRequiredEnvVar(name: RequiredEnvVar): string {
  const value = process.env[name];
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  
  return value;
}

// Функция для получения опциональной переменной окружения
function getOptionalEnvVar(name: string, defaultValue?: string): string | undefined {
  return process.env[name] || defaultValue;
}

// Конфигурация приложения
export const env = {
  // API
  API_URL: getOptionalEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3001'),
  
  // Режим разработки
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production' 
} as const;

// Проверка всех обязательных переменных при загрузке модуля
export function validateEnvironment(): void {
  try {
    for (const envVar of requiredEnvVars) {
      getRequiredEnvVar(envVar);
    }
    console.log('✅ Environment variables validated');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    if (env.isProduction) {
      throw error;
    }
  }
} 