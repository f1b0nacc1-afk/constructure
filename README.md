# 📚 Constructure - Визуальный конструктор образовательных курсов

Интуитивная платформа для создания образовательных курсов с поддержкой drag & drop интерфейса и множественных режимов визуализации.

## ✨ Особенности

- 🎨 **4 режима визуализации**: Дерево, LEGO-блоки, Mind map, Flowchart
- 🔧 **Drag & Drop интерфейс** для интуитивного создания курсов
- 👥 **Совместная работа** в реальном времени
- 🔄 **Версионирование** курсов с возможностью отката
- 📱 **Отзывчивый дизайн** для всех устройств
- 🔐 **Полноценная система аутентификации** с JWT токенами

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

2. **Запустите development окружение**
```bash
docker-compose up -d
```

3. **Дождитесь запуска всех сервисов** (обычно 1-2 минуты)

### 🌐 Доступные сервисы

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Adminer (БД управление)**: http://localhost:8080
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6379

### 🔑 Тестовые аккаунты

Для удобства тестирования созданы готовые аккаунты (доступны на `/test-accounts`):

| Роль | Email | Пароль | Описание |
|------|-------|--------|----------|
| **Администратор** | admin@constructure.com | admin123456 | Полный доступ ко всем функциям |
| **Преподаватель** | teacher@example.com | teacher123 | Создание и управление курсами |
| **Студент** | student@example.com | student123 | Прохождение курсов и тестов |
| **Тестовый** | test@example.com | password123 | Общий тестовый аккаунт |

**🎯 Быстрый доступ**: Перейдите на http://localhost:3000/test-accounts для быстрого входа!

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
│   ├── web/                    # React/Next.js Frontend
│   │   ├── src/app/
│   │   │   ├── auth/          # Страницы аутентификации
│   │   │   │   ├── login.tsx
│   │   │   │   ├── register.tsx
│   │   │   │   └── test-accounts/ # Тестовые аккаунты
│   │   │   ├── courses/       # Управление курсами
│   │   │   └── test-accounts/ # Тестовые аккаунты
│   │   ├── src/components/
│   │   │   ├── auth/          # Компоненты аутентификации
│   │   │   ├── layout/        # Навигация и макеты
│   │   │   └── ui/            # UI компоненты
│   │   └── src/hooks/         # React хуки (useAuth)
│   └── api/                   # Node.js/Fastify Backend
│       ├── src/routes/auth.ts # API аутентификации
│       └── prisma/schema.prisma # Схема базы данных
├── packages/
│   └── types/                 # Общие TypeScript типы
└── docker-compose.yml         # Docker конфигурация
```

## 🛠️ Полезные команды

```bash
# Docker управление
docker-compose up -d          # Запуск всех сервисов
docker-compose down           # Остановка всех сервисов
docker-compose logs web       # Просмотр логов фронтенда
docker-compose logs api       # Просмотр логов API

# База данных
docker-compose exec api npx prisma studio    # Prisma Studio UI
docker-compose exec api npx prisma db push   # Применить изменения схемы
docker-compose exec api npx prisma generate  # Генерация Prisma Client

# Перезапуск сервисов
docker-compose restart web    # Перезапуск фронтенда
docker-compose restart api    # Перезапуск API
```

## 🎯 Текущий статус

**Фаза 1**: ✅ **ЗАВЕРШЕНА** (Инфраструктура и аутентификация)
**Фаза 2**: 🔄 **В разработке** (CRUD операции и визуализация)

### ✅ Полностью реализовано

**🔐 Система аутентификации:**
- JWT токены с access/refresh механизмом
- Регистрация и авторизация пользователей
- Защищённые маршруты и middleware
- Интеграция фронтенда с localStorage
- 4 готовых тестовых аккаунта

**🎨 Frontend (Next.js 14):**
- Современный UI с Tailwind CSS
- Навигация с поддержкой аутентификации
- Формы входа и регистрации
- Страница тест-аккаунтов с быстрым входом
- Хук useAuth для управления состоянием
- ProtectedRoute компонент

**⚙️ Backend (Fastify):**
- RESTful API с документацией
- PostgreSQL + Prisma ORM
- Redis для кэширования
- Валидация и error handling
- Health checks эндпоинты

**🐳 Инфраструктура:**
- Docker-compose setup
- PostgreSQL база данных
- Redis для сессий
- Adminer для управления БД

### 🔄 В работе

- CRUD операции для курсов
- Базовый редактор курсов
- Первый режим визуализации (дерево)
- Drag & Drop функциональность

### 📋 Запланировано

- Остальные режимы визуализации (LEGO, Mind map, Flowchart)
- Совместная работа в реальном времени
- Экспорт курсов в различные форматы
- Аналитика и отчёты

## 🔒 API Endpoints

### Аутентификация
```bash
POST /api/auth/register    # Регистрация
POST /api/auth/login       # Авторизация
GET  /api/auth/me          # Получение профиля (защищённый)
POST /api/auth/refresh     # Обновление токена
```

### Пример использования
```bash
# Авторизация
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Получение профиля
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Тестирование

Все компоненты системы протестированы и работают стабильно:

- ✅ API endpoints возвращают корректные ответы
- ✅ Аутентификация работает на фронтенде и бэкенде
- ✅ База данных синхронизирована
- ✅ Тестовые аккаунты созданы и функциональны
- ✅ Навигация между страницами работает
- ✅ localStorage интеграция настроена

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

## 🚨 Важные заметки

- В продакшене **обязательно** смените пароли тестовых аккаунтов
- JWT секретные ключи должны быть надёжными в продакшене
- База данных настроена для разработки, не для продакшена
- Все пароли в `.env` файлах используются только для разработки

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE) файл.

## 👥 Команда

- **Архитектор**: Claude Sonnet 4
- **Разработчик**: f1b0nacc1-afk

## 🔗 Полезные ссылки

- [API Документация](apps/api/README.md)
- [Frontend Документация](apps/web/README.md)
- [Схема базы данных](apps/api/prisma/schema.prisma)

---

**🎉 Проект готов к разработке! Запустите `docker-compose up -d` и переходите на http://localhost:3000** 