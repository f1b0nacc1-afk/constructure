#!/bin/bash

# 🛑 Constructure - Скрипт остановки
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

print_step() {
    echo -e "${BLUE}🔹 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}"
    echo "=========================================="
    echo "🛑 CONSTRUCTURE - ОСТАНОВКА"
    echo "=========================================="
    echo -e "${NC}"
}

# Основная функция остановки
stop_application() {
    print_header
    
    print_step "Остановка всех контейнеров..."
    docker-compose down --remove-orphans
    
    print_success "Все контейнеры остановлены"
    
    echo
    echo -e "${WHITE}🛠️  Полезные команды для перезапуска:${NC}"
    echo -e "${CYAN}   ./quick-start.sh${NC}              # Быстрый запуск"
    echo -e "${CYAN}   docker-compose up -d${NC}          # Обычный запуск"
    echo
    
    print_success "Готово! Приложение остановлено."
}

# Запуск основной функции
stop_application "$@" 