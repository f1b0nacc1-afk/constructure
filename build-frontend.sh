#!/bin/bash

echo "🏗️  Сборка фронтенда для статической раздачи через Docker..."

# Очищаем старую сборку
echo "🧹 Очистка старой сборки..."
rm -rf dist

# Собираем через Docker
echo "⚙️  Сборка Next.js приложения в Docker..."
docker build -f Dockerfile.build -t constructure-frontend-build .

# Извлекаем собранные файлы из контейнера
echo "📦 Извлечение собранных файлов..."
docker create --name temp-container constructure-frontend-build
docker cp temp-container:/app/apps/web/dist ./dist
docker rm temp-container

# Проверяем что сборка прошла успешно
if [ $? -eq 0 ] && [ -d "dist" ]; then
    echo "✅ Фронтенд успешно собран в папку dist/"
    echo "📁 Статические файлы готовы для nginx"
    echo ""
    ls -la dist/
    echo ""
    echo "🚀 Теперь запустите: docker-compose up -d"
    echo "🌐 Приложение будет доступно на: http://localhost:8000"
else
    echo "❌ Ошибка сборки фронтенда"
    exit 1
fi 