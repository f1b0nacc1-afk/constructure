#!/bin/bash

# Скрипт для запуска development окружения Constructure

echo "🚀 Запуск Constructure Development Environment"

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker для продолжения."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose для продолжения."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.dev.yml down

# Удаляем старые контейнеры если есть конфликт портов
docker rm -f constructure-postgres-dev 2>/dev/null || true

# Создаем volume для PostgreSQL если не существует
echo "📦 Создаем Docker volumes..."
docker volume create constructure_postgres_data 2>/dev/null || true
docker volume create constructure_redis_data 2>/dev/null || true

# Запускаем инфраструктуру (БД, Redis, Adminer)
echo "🐘 Запускаем PostgreSQL и Redis..."
docker-compose -f docker-compose.dev.yml up -d postgres redis adminer

# Ждем пока БД запустится
echo "⏳ Ждем запуска PostgreSQL..."
sleep 15

# Проверяем подключение к БД (порт изменен на 5433)
echo "🔍 Проверяем подключение к базе данных..."
until docker exec constructure-postgres-dev pg_isready -h localhost -U constructure -p 5432; do
  echo "Ждем PostgreSQL..."
  sleep 2
done

echo "✅ PostgreSQL готов к работе!"

# Миграции базы данных
echo "🔄 Выполняем миграции Prisma..."
cd apps/api

# Устанавливаем DATABASE_URL для Prisma
export DATABASE_URL="postgresql://constructure:dev_password_123@localhost:5433/constructure_dev"

# Генерируем Prisma Client
echo "  📦 Генерируем Prisma Client..."
node node_modules/prisma/build/index.js generate

# Синхронизируем схему с базой данных
echo "  🔄 Синхронизируем схему с БД..."
node node_modules/prisma/build/index.js db push

cd ../..

echo "🌐 Доступные сервисы:"
echo "  - PostgreSQL: localhost:5433 (внешний порт)"
echo "  - Redis: localhost:6379"
echo "  - Adminer: http://localhost:8080"
echo ""
echo "🔗 Подключение к БД в Adminer:"
echo "  - Сервер: postgres"
echo "  - Пользователь: constructure"
echo "  - Пароль: dev_password_123"
echo "  - База данных: constructure_dev"
echo ""
echo "🚀 Для запуска приложений выполните:"
echo "  - Frontend: cd apps/web && npm run dev"
echo "  - Backend: cd apps/api && npm run dev"
echo ""
echo "✅ Development окружение готово!" 