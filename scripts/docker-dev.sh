#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода с цветом
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon не запущен"
        exit 1
    fi
}

# Создание необходимых директорий
create_directories() {
    print_status "Создание директорий для логов..."
    mkdir -p logs/{api,web,postgres,redis,nginx}
    mkdir -p nginx/conf.d
    print_success "Директории созданы"
}

# Функция запуска
start_services() {
    print_status "Запуск Docker сервисов..."
    
    # Останавливаем старые контейнеры если они есть
    docker-compose down 2>/dev/null || true
    
    # Собираем и запускаем контейнеры
    if docker-compose up -d --build; then
        print_success "Сервисы запущены"
        
        # Ждем запуска сервисов
        print_status "Ожидание готовности сервисов..."
        sleep 10
        
        # Проверяем статус сервисов
        check_services
    else
        print_error "Ошибка запуска сервисов"
        exit 1
    fi
}

# Проверка статуса сервисов
check_services() {
    print_status "Проверка статуса сервисов..."
    
    # PostgreSQL
    if docker-compose exec -T postgres pg_isready -U constructure -d constructure_dev &>/dev/null; then
        print_success "PostgreSQL: Работает"
    else
        print_warning "PostgreSQL: Не готов"
    fi
    
    # Redis
    if docker-compose exec -T redis redis-cli ping &>/dev/null; then
        print_success "Redis: Работает"
    else
        print_warning "Redis: Не готов"
    fi
    
    # API
    if curl -s http://localhost:3001/health &>/dev/null; then
        print_success "API: Работает (http://localhost:3001)"
    else
        print_warning "API: Не готов"
    fi
    
    # Web
    if curl -s http://localhost:3000 &>/dev/null; then
        print_success "Web: Работает (http://localhost:3000)"
    else
        print_warning "Web: Не готов"
    fi
    
    # Nginx
    if curl -s http://localhost/health &>/dev/null; then
        print_success "Nginx: Работает (http://localhost)"
    else
        print_warning "Nginx: Не готов"
    fi
    
    # Adminer
    if curl -s http://localhost:8080 &>/dev/null; then
        print_success "Adminer: Работает (http://localhost:8080)"
    else
        print_warning "Adminer: Не готов"
    fi
}

# Остановка сервисов
stop_services() {
    print_status "Остановка сервисов..."
    docker-compose down
    print_success "Сервисы остановлены"
}

# Просмотр логов
show_logs() {
    if [ -z "$2" ]; then
        print_status "Показываем логи всех сервисов..."
        docker-compose logs -f --tail=100
    else
        print_status "Показываем логи сервиса: $2"
        docker-compose logs -f --tail=100 "$2"
    fi
}

# Перезапуск сервиса
restart_service() {
    if [ -z "$2" ]; then
        print_error "Укажите имя сервиса для перезапуска"
        exit 1
    fi
    
    print_status "Перезапуск сервиса: $2"
    docker-compose restart "$2"
    print_success "Сервис $2 перезапущен"
}

# Очистка
cleanup() {
    print_status "Очистка Docker ресурсов..."
    docker-compose down -v --remove-orphans
    docker system prune -f
    print_success "Очистка завершена"
}

# Показать статус
show_status() {
    print_status "Статус контейнеров:"
    docker-compose ps
    echo ""
    check_services
}

# Помощь
show_help() {
    echo "Управление Docker development средой для Constructure"
    echo ""
    echo "Использование: $0 [КОМАНДА]"
    echo ""
    echo "Команды:"
    echo "  start      Запустить все сервисы"
    echo "  stop       Остановить все сервисы"
    echo "  restart    Перезапустить все сервисы"
    echo "  restart <service>  Перезапустить конкретный сервис"
    echo "  status     Показать статус сервисов"
    echo "  logs       Показать логи всех сервисов"
    echo "  logs <service>  Показать логи конкретного сервиса"
    echo "  cleanup    Очистить все Docker ресурсы"
    echo "  help       Показать эту справку"
    echo ""
    echo "Доступные сервисы: postgres, redis, api, web, nginx, adminer"
    echo ""
    echo "Полезные URL после запуска:"
    echo "  - Приложение: http://localhost или http://localhost:3000"
    echo "  - API: http://localhost:3001"
    echo "  - Админер БД: http://localhost:8080"
}

# Основная логика
case "${1:-help}" in
    start)
        check_docker
        create_directories
        start_services
        ;;
    stop)
        check_docker
        stop_services
        ;;
    restart)
        check_docker
        if [ -z "$2" ]; then
            stop_services
            start_services
        else
            restart_service "$@"
        fi
        ;;
    status)
        check_docker
        show_status
        ;;
    logs)
        check_docker
        show_logs "$@"
        ;;
    cleanup)
        check_docker
        cleanup
        ;;
    help|*)
        show_help
        ;;
esac 