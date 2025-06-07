# 🏗️ Constructure - Визуальный конструктор курсов

> Современная платформа для создания интерактивных образовательных курсов с drag & drop интерфейсом и множественными режимами визуализации.

![Constructure Preview](./docs/images/preview.png)

## ✨ Особенности

- 🎨 **Drag & Drop интерфейс** - Интуитивное создание курсов перетаскиванием
- 🔄 **4 режима визуализации** - Дерево, LEGO-блоки, Mind Map, Flowchart  
- 👥 **Совместная работа** - Редактирование курсов в реальном времени
- 📱 **Адаптивный дизайн** - Работает на всех устройствах
- 🚀 **Высокая производительность** - Поддержка до 500 блоков без лагов
- 🔧 **TypeScript** - Полная типизация для надежности

## 🏗️ Архитектура

```
constructure/
├── apps/
│   ├── web/                 # React frontend (Next.js)
│   ├── api/                 # Node.js backend (Fastify)
│   └── docs/                # Документация (VitePress)
├── packages/
│   ├── ui/                  # UI компоненты
│   ├── types/               # TypeScript типы
│   ├── utils/               # Утилиты
│   └── config/              # Конфигурации
└── docs/                    # Проектная документация
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Docker (опционально)

### Установка

```bash
# Клонируем репозиторий
git clone https://github.com/f1b0nacc1-afk/constructure.git
cd constructure

# Устанавливаем зависимости
npm install

# Настраиваем базу данных
npm run setup

# Запускаем в режиме разработки
npm run dev
```

### Запуск с Docker

```bash
# Запуск всех сервисов
npm run docker:dev

# Приложение будет доступно на:
# Frontend: http://localhost:3000
# API: http://localhost:3001
# Docs: http://localhost:3002
```

## 📖 Документация

- [📋 План разработки](./DEVELOPMENT_PLAN.md)
- [🔧 Техническая спецификация](./TECHNICAL_SPECIFICATION.md)
- [🎨 Концепт-дизайн](./UI_CONCEPT_DESIGN.md)
- [🏗️ Архитектурный обзор](./ARCHITECTURE_OVERVIEW.md)
- [📝 Информация о проекте](./Information.txt)

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