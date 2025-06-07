# 📚 Constructure - Визуальный конструктор образовательных курсов

Интуитивная платформа для создания образовательных курсов с поддержкой drag & drop интерфейса и множественных режимов визуализации.

## ✨ Особенности

- 🎨 **4 режима визуализации**: Дерево, LEGO-блоки, Mind map, Flowchart
- 🔧 **Drag & Drop интерфейс** для интуитивного создания курсов
- 👥 **Совместная работа** в реальном времени
- 🔄 **Версионирование** курсов с возможностью отката
- 📱 **Отзывчивый дизайн** для всех устройств

## 🚀 Быстрый старт

### Предварительные требования

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0  
- **Docker** и **Docker Compose**

### Установка и запуск

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/f1b0nacc1-afk/constructure.git
cd constructure
```

2. **Установите зависимости**
```bash
npm run dev:setup
```

3. **Запустите development окружение**
```bash
npm run dev:start
```

4. **Запустите приложения**
```bash
# В отдельных терминалах:
npm run dev:api    # Backend API (порт 3001)
npm run dev:web    # Frontend (порт 3000)

# Или одновременно:
npm run dev
```

### 🌐 Доступные сервисы

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Adminer (БД управление)**: http://localhost:8080
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6379

### 🔗 Подключение к базе данных

**Через Adminer (http://localhost:8080):**
- Сервер: `postgres`
- Пользователь: `constructure` 
- Пароль: `dev_password_123`
- База данных: `constructure_dev`

**Прямое подключение:**
```bash
psql postgresql://constructure:dev_password_123@localhost:5433/constructure_dev
```

## 📂 Структура проекта

```
constructure/
├── apps/
│   ├── web/           # React/Next.js Frontend
│   └── api/           # Node.js/Fastify Backend
├── packages/
│   └── types/         # Общие TypeScript типы
├── scripts/           # Скрипты автоматизации
└── docker-compose.dev.yml  # Docker конфигурация
```

## 🛠️ Полезные команды

```bash
# Docker управление
npm run docker:dev        # Запуск всех сервисов
npm run docker:dev:down   # Остановка всех сервисов
npm run docker:dev:logs   # Просмотр логов

# База данных
npm run prisma:studio     # Prisma Studio UI
npm run prisma:push       # Применить изменения схемы
npm run prisma:generate   # Генерация Prisma Client

# Разработка
npm run lint             # Проверка кода
npm run type-check       # Проверка типов
npm run build           # Сборка проектов
```

## 🎯 Текущий статус

**Фаза 1**: ✅ **ЗАВЕРШЕНА** (Инфраструктура и аутентификация)
**Фаза 2**: 🔄 **В разработке** (CRUD операции и визуализация)

### ✅ Реализовано

- Полная инфраструктура разработки (Docker, PostgreSQL, Redis)
- Система аутентификации с JWT
- UI Kit компоненты (Button, Input, Card, Modal, Spinner)
- Настройка TypeScript, ESLint, Prettier
- Схема базы данных и Prisma ORM
- Zustand store для управления состоянием

### 🔄 В работе

- CRUD операции для курсов
- Базовый редактор курсов
- Первый режим визуализации (дерево)
- Drag & Drop функциональность

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Коммитьте изменения (`git commit -m 'feat: add amazing feature'`)
4. Пушните ветку (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

### Правила коммитов

Используем [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: новая функциональность
fix: исправление бага
docs: изменения в документации
style: форматирование кода
refactor: рефакторинг
test: добавление тестов
chore: обновление зависимостей
```

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл.

## 🔗 Полезные ссылки

- [План разработки](DEVELOPMENT_PLAN.md)
- [Git Workflow](GIT_WORKFLOW.md)
- [API Документация](apps/api/README.md)
- [Frontend Документация](apps/web/README.md)

## 🛠️ Разработка

### Команды

```bash
npm run dev          # Запуск в режиме разработки
npm run build        # Сборка проекта
npm run test         # Запуск тестов
npm run lint         # Линтинг кода
npm run type-check   # Проверка типов TypeScript
```

### Структура коммитов

Используем [Conventional Commits](https://conventionalcommits.org/):

```
feat: добавить drag & drop для узлов курса
fix: исправить сохранение позиций в режиме LEGO
docs: обновить README с инструкциями по запуску
style: форматирование кода в компонентах
refactor: переписать логику валидации курса
test: добавить тесты для CourseService
```

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для фичи (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'feat: add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - смотрите файл [LICENSE](LICENSE) для деталей.

## 👥 Команда

- **Архитектор**: Claude Sonnet 4
- **Разработчик**: f1b0nacc1-afk

## 🔗 Ссылки

- [Живая демо-версия](https://constructure.vercel.app)
- [Документация API](https://api.constructure.app/docs)
- [Figma дизайн](https://figma.com/constructure)
- [Roadmap проекта](https://github.com/f1b0nacc1-afk/constructure/projects)

---

**Создаем будущее образования вместе! 🚀** 