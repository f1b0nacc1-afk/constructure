#!/bin/bash

# 🚀 Скрипт для создания GitHub репозитория Constructure
# Запуск: ./scripts/setup-github.sh YOUR_GITHUB_USERNAME

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Проверяем аргументы
if [ $# -eq 0 ]; then
    error "Использование: $0 YOUR_GITHUB_USERNAME"
fi

GITHUB_USERNAME=$1
REPO_NAME="constructure"

log "🏗️  Настройка GitHub репозитория для Constructure"
log "👤 Username: $GITHUB_USERNAME"
log "📦 Repository: $REPO_NAME"

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    error "Запустите скрипт из корневой директории проекта"
fi

# Проверяем, что Git установлен
if ! command -v git &> /dev/null; then
    error "Git не установлен. Установите Git перед продолжением."
fi

# Проверяем, что GitHub CLI установлен (опционально)
if command -v gh &> /dev/null; then
    log "✅ GitHub CLI найден. Будет использован для создания репозитория."
    USE_GH_CLI=true
else
    warn "GitHub CLI не найден. Репозиторий нужно будет создать вручную."
    USE_GH_CLI=false
fi

# Обновляем package.json с правильным URL репозитория
log "📝 Обновление package.json..."
if command -v jq &> /dev/null; then
    # Используем jq если доступен
    jq --arg url "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git" \
       '.repository.url = $url | 
        .bugs.url = "https://github.com/\($GITHUB_USERNAME)/\($REPO_NAME)/issues" |
        .homepage = "https://github.com/\($GITHUB_USERNAME)/\($REPO_NAME)#readme"' \
       package.json > package.json.tmp && mv package.json.tmp package.json
else
    # Используем sed как fallback
    sed -i.bak "s|https://github.com/your-username/constructure.git|https://github.com/$GITHUB_USERNAME/$REPO_NAME.git|g" package.json
    sed -i.bak "s|https://github.com/your-username/constructure/issues|https://github.com/$GITHUB_USERNAME/$REPO_NAME/issues|g" package.json
    sed -i.bak "s|https://github.com/your-username/constructure#readme|https://github.com/$GITHUB_USERNAME/$REPO_NAME#readme|g" package.json
    rm -f package.json.bak
fi

# Обновляем README.md
log "📖 Обновление README.md..."
sed -i.bak "s|YOUR_USERNAME|$GITHUB_USERNAME|g" README.md
sed -i.bak "s|your-username|$GITHUB_USERNAME|g" README.md
rm -f README.md.bak

# Инициализируем Git репозиторий
if [ ! -d ".git" ]; then
    log "🔧 Инициализация Git репозитория..."
    git init
    git branch -M main
else
    log "✅ Git репозиторий уже инициализирован"
fi

# Создаем .gitignore если не существует
if [ ! -f ".gitignore" ]; then
    log "📄 Создание .gitignore..."
    # .gitignore уже должен быть создан ранее
fi

# Добавляем все файлы
log "📦 Добавление файлов в Git..."
git add .

# Создаем первый коммит
log "💾 Создание первого коммита..."
git commit -m "feat: initial project setup with monorepo structure

- Add monorepo setup with Turbo
- Add React frontend app structure  
- Add Node.js API backend structure
- Add shared packages (types, ui, utils)
- Add Docker development environment
- Add comprehensive documentation
- Add GitHub setup automation"

# Создаем репозиторий на GitHub (если доступен GitHub CLI)
if [ "$USE_GH_CLI" = true ]; then
    log "🌐 Создание репозитория на GitHub..."
    
    # Проверяем, авторизован ли пользователь
    if ! gh auth status &> /dev/null; then
        log "🔐 Требуется авторизация в GitHub CLI..."
        gh auth login
    fi
    
    # Создаем репозиторий
    gh repo create $REPO_NAME \
        --description "🏗️ Визуальный конструктор образовательных курсов с drag & drop интерфейсом" \
        --public \
        --source=. \
        --remote=origin \
        --push
        
    log "✅ Репозиторий создан и код отправлен на GitHub!"
    log "🌍 URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
else
    # Добавляем remote вручную
    log "🔗 Добавление remote origin..."
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    
    log "⚠️  Создайте репозиторий вручную на GitHub:"
    log "   1. Перейдите на https://github.com/new"
    log "   2. Repository name: $REPO_NAME"
    log "   3. Description: 🏗️ Визуальный конструктор образовательных курсов с drag & drop интерфейсом"
    log "   4. Выберите Public"
    log "   5. НЕ ДОБАВЛЯЙТЕ README, .gitignore, license"
    log "   6. Нажмите 'Create repository'"
    log ""
    log "   Затем выполните:"
    log "   git push -u origin main"
fi

# Создаем директории для GitHub templates
log "📝 Создание GitHub templates..."
mkdir -p .github/{workflows,ISSUE_TEMPLATE}

# Создаем GitHub Actions workflow
cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: constructure_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build
EOF

# Создаем template для feature request
cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature Request
about: Предложите новую функциональность
title: 'feat: '
labels: 'enhancement'
assignees: ''
---

## 📝 Описание функциональности

Четкое и краткое описание того, что вы хотите добавить.

## 🎯 Мотивация

Почему эта функциональность нужна? Какую проблему она решает?

## 📋 Задачи

- [ ] Задача 1
- [ ] Задача 2
- [ ] Задача 3

## 🎨 Дизайн (опционально)

Приложите макеты или описание интерфейса.

## 📊 Критерии приемки

- [ ] Критерий 1
- [ ] Критерий 2
EOF

# Создаем template для bug report
cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug Report
about: Сообщите об ошибке
title: 'fix: '
labels: 'bug'
assignees: ''
---

## 🐛 Описание ошибки

Четкое и краткое описание проблемы.

## 🔄 Как воспроизвести

Шаги для воспроизведения проблемы:
1. Перейдите к '...'
2. Нажмите на '...'
3. Прокрутите до '...'
4. Увидите ошибку

## ✅ Ожидаемое поведение

Описание того, что должно было произойти.

## 📱 Окружение

- OS: [например, Windows 10, macOS 12, Ubuntu 20.04]
- Browser: [например, Chrome 91, Firefox 89, Safari 14]
- Node.js: [версия Node.js, если применимо]

## 📎 Дополнительная информация

Добавьте любую другую информацию о проблеме.
EOF

# Создаем Dependabot config
cat > .github/dependabot.yml << 'EOF'
version: 2
updates:
  # NPM dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore"
      include: "scope"
  
  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore"
      include: "scope"
EOF

log "✅ GitHub настройка завершена!"
log ""
log "🎯 Следующие шаги:"
log "   1. Проверьте репозиторий: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
log "   2. Настройте защиту веток в Settings → Branches"
log "   3. Создайте GitHub Project для управления задачами"
log "   4. Настройте секреты для деплоя (если нужно)"
log "   5. Начните разработку!"
log ""
log "🚀 Удачной разработки!" 