# 🌿 Git Workflow - Стратегия ветвления Constructure

## 📋 Обзор

Используем модифицированный **Git Flow** для эффективного управления версиями и совместной разработки.

## 🔄 Структура веток

### Основные ветки
- **`main`** - Продакшн ветка, всегда стабильная
- **`develop`** - Основная ветка разработки
- **`staging`** - Предпродакшн тестирование

### Feature ветки
- **`feature/phase1-*`** - Фаза 1: Инфраструктура (недели 1-6)
- **`feature/phase2-*`** - Фаза 2: Визуализация (недели 7-14)  
- **`feature/phase3-*`** - Фаза 3: Расширенный функционал (недели 15-22)
- **`feature/phase4-*`** - Фаза 4: Оптимизация (недели 23-28)

### Версионные ветки
- **`release/v0.1.0`** - MVP версия (конец фазы 1)
- **`release/v0.5.0`** - Альфа версия (конец фазы 2)
- **`release/v1.0.0`** - Бета версия (конец фазы 3)
- **`release/v2.0.0`** - Продакшн версия (конец фазы 4)

### Hotfix ветки
- **`hotfix/critical-*`** - Критические исправления в продакшне

## 🚀 Workflow процесс

### 1. Начало новой фичи
```bash
git checkout develop
git pull origin develop
git checkout -b feature/phase1-authentication
```

### 2. Разработка и коммиты
```bash
git add .
git commit -m "feat(auth): add JWT authentication service"
git push origin feature/phase1-authentication
```

### 3. Pull Request
- Создаем PR из feature ветки в `develop`
- Code review и автоматические тесты
- Мердж только после одобрения

### 4. Подготовка релиза
```bash
git checkout develop
git checkout -b release/v0.1.0
# Финальные тесты и багфиксы
git checkout main
git merge release/v0.1.0
git tag v0.1.0
```

### 5. Hotfix
```bash
git checkout main
git checkout -b hotfix/security-fix
# Исправление
git checkout main
git merge hotfix/security-fix
git checkout develop
git merge hotfix/security-fix
```

## 📝 Соглашения о коммитах

Используем [Conventional Commits](https://conventionalcommits.org/):

### Типы коммитов
- **`feat`** - Новая функциональность
- **`fix`** - Исправление бага
- **`docs`** - Документация
- **`style`** - Форматирование кода
- **`refactor`** - Рефакторинг
- **`test`** - Тесты
- **`chore`** - Обслуживание проекта

### Области (scope)
- **`auth`** - Аутентификация
- **`ui`** - Пользовательский интерфейс
- **`api`** - Backend API
- **`db`** - База данных
- **`drag-drop`** - Drag & Drop функциональность
- **`visualization`** - Режимы визуализации
- **`course`** - Управление курсами

### Примеры коммитов
```
feat(auth): add JWT token refresh mechanism
fix(drag-drop): resolve ghost element positioning issue
docs(api): update authentication endpoints documentation
style(ui): format React components with Prettier
refactor(course): extract validation logic to separate service
test(api): add integration tests for course CRUD operations
chore(deps): update React to v18.2.0
```

## 🏷️ Версионирование

Следуем [Semantic Versioning](https://semver.org/):

### Формат версий: `MAJOR.MINOR.PATCH`

- **MAJOR** - Кардинальные изменения (breaking changes)
- **MINOR** - Новая функциональность (обратно совместимая)
- **PATCH** - Исправления багов

### Roadmap версий
- **v0.1.0** - MVP: Базовая инфраструктура + аутентификация
- **v0.2.0** - Первый режим визуализации (дерево)
- **v0.3.0** - CRUD операции для курсов
- **v0.4.0** - Базовый drag & drop
- **v0.5.0** - Все 4 режима визуализации
- **v0.6.0** - Интерактивное редактирование
- **v0.7.0** - Rich text редактор
- **v0.8.0** - Совместная работа
- **v0.9.0** - Оптимизация производительности
- **v1.0.0** - Полнофункциональный релиз

## 🛡️ Защищенные ветки

### `main` ветка
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators
- ❌ Allow force pushes

### `develop` ветка  
- ✅ Require pull request reviews
- ✅ Require status checks to pass
- ❌ Include administrators
- ❌ Allow force pushes

## 📊 Автоматизация

### GitHub Actions
- **CI/CD Pipeline** - Тесты, линтинг, сборка
- **Auto Deploy** - Staging при push в develop
- **Release Notes** - Автогенерация при создании тега
- **Dependency Updates** - Dependabot уведомления

### Hooks
- **Pre-commit** - Форматирование и линтинг
- **Pre-push** - Локальные тесты
- **Commit-msg** - Валидация формата коммитов

## 🎯 Правила команды

1. **Никогда не пушим прямо в `main` или `develop`**
2. **Каждая фича = отдельная ветка**
3. **Pull Request обязателен для любого изменения**
4. **Code review обязателен перед мерджем**
5. **Тесты должны проходить перед мерджем**
6. **Соблюдаем conventional commits**
7. **Регулярно синхронизируемся с develop** 