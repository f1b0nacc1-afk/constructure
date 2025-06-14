#!/bin/bash

# 🚀 Constructure - Скрипт быстрого запуска
# Визуальный конструктор образовательных курсов

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Функция для вывода с цветами
print_step() {
    echo -e "${BLUE}🔹 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}"
    echo "=========================================="
    echo "🏗️  CONSTRUCTURE - БЫСТРЫЙ ЗАПУСК"
    echo "=========================================="
    echo -e "${NC}"
}

# Проверка зависимостей
check_dependencies() {
    print_step "Проверка зависимостей..."
    
    # Проверка Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Проверка Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose не установлен. Установите Docker Compose: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Проверка что Docker запущен
    if ! docker info &> /dev/null; then
        print_error "Docker не запущен. Запустите Docker daemon."
        exit 1
    fi
    
    print_success "Все зависимости установлены"
}

# Остановка существующих контейнеров
stop_existing() {
    print_step "Остановка существующих контейнеров..."
    docker-compose down --remove-orphans 2>/dev/null || true
    print_success "Существующие контейнеры остановлены"
}

# Запуск приложения
start_application() {
    print_step "Запуск приложения..."
    
    # Создание необходимых директорий
    mkdir -p logs/postgres logs/redis logs/nginx logs/api
    
    # Запуск контейнеров
    docker-compose up -d
    
    print_success "Контейнеры запущены"
}

# Ожидание готовности сервисов
wait_for_services() {
    print_step "Ожидание готовности сервисов..."
    
    # Ждем базу данных
    print_info "Ожидание PostgreSQL..."
    timeout=60
    while ! docker-compose exec -T postgres pg_isready -U constructure -d constructure_dev &>/dev/null && [ $timeout -gt 0 ]; do
        sleep 2
        timeout=$((timeout-2))
        echo -n "."
    done
    echo
    
    if [ $timeout -le 0 ]; then
        print_error "Timeout: PostgreSQL не готов"
        exit 1
    fi
    
    # Ждем Redis
    print_info "Ожидание Redis..."
    timeout=30
    while ! docker-compose exec -T redis redis-cli ping &>/dev/null && [ $timeout -gt 0 ]; do
        sleep 1
        timeout=$((timeout-1))
        echo -n "."
    done
    echo
    
    if [ $timeout -le 0 ]; then
        print_error "Timeout: Redis не готов"
        exit 1
    fi
    
    # Ждем API
    print_info "Ожидание API..."
    timeout=90
    while ! curl -s http://localhost:3001/health &>/dev/null && [ $timeout -gt 0 ]; do
        sleep 2
        timeout=$((timeout-2))
        echo -n "."
    done
    echo
    
    if [ $timeout -le 0 ]; then
        print_error "Timeout: API не готов"
        exit 1
    fi
    
    # Ждем Frontend
    print_info "Ожидание Frontend..."
    timeout=120
    while ! curl -s http://localhost:3000 &>/dev/null && [ $timeout -gt 0 ]; do
        sleep 3
        timeout=$((timeout-3))
        echo -n "."
    done
    echo
    
    if [ $timeout -le 0 ]; then
        print_warning "Frontend может быть еще не готов, но продолжаем..."
    fi
    
    print_success "Все сервисы готовы!"
}

# Применение миграций базы данных
apply_migrations() {
    print_step "Применение миграций базы данных..."
    docker-compose exec -T api npx prisma db push 2>/dev/null || true
    docker-compose exec -T api npx prisma generate 2>/dev/null || true
    print_success "Миграции применены"
}

# Показ информации о запущенных сервисах
show_services_info() {
    print_success "🎉 Приложение успешно запущено!"
    echo
    echo -e "${WHITE}📋 Доступные сервисы:${NC}"
    echo -e "${CYAN}🌐 Frontend:${NC}          http://localhost:3000"
    echo -e "${CYAN}🔧 Backend API:${NC}       http://localhost:3001"
    echo -e "${CYAN}📊 Nginx (main):${NC}     http://localhost:8000"
    echo -e "${CYAN}🗄️  Adminer (БД):${NC}     http://localhost:8080"
    echo -e "${CYAN}🐘 PostgreSQL:${NC}       localhost:5433"
    echo -e "${CYAN}📦 Redis:${NC}            localhost:6379"
    echo
    echo -e "${WHITE}🔑 Тестовые аккаунты:${NC}"
    echo -e "${YELLOW}👑 Администратор:${NC}    admin@constructure.com / admin123456"
    echo -e "${YELLOW}👨‍🏫 Преподаватель:${NC}    teacher@example.com / teacher123"
    echo -e "${YELLOW}👨‍🎓 Студент:${NC}          student@example.com / student123"
    echo -e "${YELLOW}🧪 Тестовый:${NC}         test@example.com / password123"
    echo
    echo -e "${WHITE}💡 Быстрый доступ к тестовым аккаунтам:${NC}"
    echo -e "${CYAN}   http://localhost:3000/test-accounts${NC}"
    echo
    echo -e "${WHITE}🛠️  Полезные команды:${NC}"
    echo -e "${CYAN}   docker-compose ps${NC}              # Статус контейнеров"
    echo -e "${CYAN}   docker-compose logs -f${NC}         # Просмотр логов"
    echo -e "${CYAN}   docker-compose down${NC}            # Остановка"
    echo -e "${CYAN}   docker-compose restart${NC}         # Перезапуск"
    echo
}

# Основная функция
main() {
    print_header
    
    check_dependencies
    stop_existing
    start_application
    wait_for_services
    apply_migrations
    show_services_info
    
    print_success "Готово! Приложение запущено и готово к использованию."
}

# Обработка сигналов для корректного завершения
trap 'print_warning "Прервано пользователем"; exit 1' INT TERM

# Запуск основной функции
main "$@" 