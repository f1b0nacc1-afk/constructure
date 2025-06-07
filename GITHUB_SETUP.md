# 🚀 Настройка GitHub репозитория для Constructure

## Шаг 1: Создание репозитория на GitHub

1. **Зайдите на [GitHub.com](https://github.com)** и войдите в свой аккаунт

2. **Создайте новый репозиторий**:
   - Нажмите на "+" в правом верхнем углу → "New repository"
   - Repository name: `constructure`
   - Description: `🏗️ Визуальный конструктор образовательных курсов с drag & drop интерфейсом`
   - Выберите `Public` (или Private, если хотите приватный репо)
   - **НЕ СТАВЬТЕ** галочки на "Add a README file", "Add .gitignore", "Choose a license"
   - Нажмите "Create repository"

## Шаг 2: Инициализация локального Git репозитория

Откройте терминал в папке проекта и выполните команды:

```bash
# Инициализируем Git репозиторий
git init

# Добавляем все файлы в индекс
git add .

# Создаем первый коммит
git commit -m "feat: initial project setup with monorepo structure

- Add monorepo setup with Turbo
- Add React frontend app structure  
- Add Node.js API backend structure
- Add shared packages (types, ui, utils)
- Add Docker development environment
- Add comprehensive documentation"

# Устанавливаем основную ветку
git branch -M main

# Добавляем удаленный репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/constructure.git

# Отправляем код в GitHub
git push -u origin main
```

## Шаг 3: Настройка GitHub Actions (CI/CD)

Создайте файл `.github/workflows/ci.yml`:

```yaml
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
    
    - name: Test
      run: npm run test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/constructure_test
        REDIS_URL: redis://localhost:6379
    
    - name: Build
      run: npm run build

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./apps/web
```

## Шаг 4: Настройка защиты веток

1. Зайдите в Settings репозитория → Branches
2. Нажмите "Add rule"
3. Branch name pattern: `main`
4. Включите:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require up-to-date branches before merging
   - ✅ Include administrators

## Шаг 5: Настройка GitHub Projects (Канбан доска)

1. Зайдите в Projects → New project
2. Выберите "Board" template
3. Название: "Constructure Development"
4. Создайте колонки:
   - 📋 **Backlog** - Запланированные задачи
   - 🚧 **In Progress** - В разработке
   - 👀 **Review** - На ревью
   - ✅ **Done** - Выполнено

## Шаг 6: Настройка Issues Templates

Создайте файл `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
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
```

## Шаг 7: Автоматизация коммитов

Добавьте в `package.json` скрипты для автоматизации:

```json
{
  "scripts": {
    "commit": "git add . && git-cz",
    "release": "standard-version",
    "push": "git push --follow-tags origin main"
  },
  "devDependencies": {
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",
    "standard-version": "^9.5.0"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

## Шаг 8: Пример workflow для совместной работы

### Создание новой функции:

```bash
# 1. Создаем ветку для фичи
git checkout -b feature/drag-drop-nodes

# 2. Разрабатываем функцию
# ... код ...

# 3. Коммитим изменения  
git add .
git commit -m "feat: add drag and drop for course nodes

- Implement DragDropContext with react-dnd
- Add NodePalette component with draggable items
- Add DropZone component in Canvas
- Add visual feedback during drag operations
- Add tests for drag and drop functionality"

# 4. Отправляем в GitHub
git push origin feature/drag-drop-nodes

# 5. Создаем Pull Request через GitHub UI
```

### Ревью кода:

1. Зайдите в Pull Requests
2. Проверьте изменения
3. Оставьте комментарии
4. Approve или Request changes

## Шаг 9: Настройка Dependabot

Создайте файл `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Обновления NPM пакетов
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore"
      include: "scope"
  
  # Обновления GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    commit-message:
      prefix: "chore"
      include: "scope"
```

## Шаг 10: Создание Releases

```bash
# Создание релиза
npm run release

# Отправка тегов в GitHub
git push --follow-tags origin main
```

## 🎉 Готово!

Теперь у вас есть полностью настроенный GitHub репозиторий с:

- ✅ Автоматической сборкой и тестированием
- ✅ Защищенной главной веткой
- ✅ Канбан доской для управления задачами
- ✅ Шаблонами для Issues и Pull Requests
- ✅ Автоматическими обновлениями зависимостей

## 🚀 Следующие шаги

1. Замените `YOUR_USERNAME` на ваш GitHub username в файлах
2. Выполните команды из Шага 2
3. Настройте Vercel или другой хостинг для деплоя
4. Пригласите соавторов в репозиторий
5. Начните разработку!

---

**Удачной разработки! 🎯** 