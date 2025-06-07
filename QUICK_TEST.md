# 🧪 Быстрое тестирование Constructure

## ✅ Проверка инфраструктуры

### 1. Запуск окружения
```bash
# Запуск всех сервисов
./scripts/dev-start.sh

# Проверка статуса контейнеров
docker ps
```

**Ожидаемый результат**: 3 контейнера запущены (postgres, redis, adminer)

### 2. Проверка базы данных

**Через Adminer**: http://localhost:8080

⚠️ **ВАЖНО**: Вводите данные ТОЧНО как указано ниже:

| Поле | Значение |
|------|----------|
| **System** | `PostgreSQL` (выберите из списка) |
| **Server** | `postgres` |
| **Username** | `constructure` |
| **Password** | `dev_password_123` |
| **Database** | `constructure_dev` |

#### 🚨 Частые ошибки:
- ❌ **НЕ вводите** `dev_password_123` в поле "Database"
- ❌ **НЕ вводите** `localhost` в поле "Server"  
- ❌ **НЕ путайте** пароль с именем базы данных
- ✅ **Используйте** `postgres` как Server (имя Docker контейнера)

**Ожидаемый результат**: Подключение успешно, видны 7 таблиц Prisma:
- `users`
- `courses` 
- `course_nodes`
- `course_edges`
- `course_collaborators`
- `comments`
- `course_versions`

#### 🔍 Альтернативная проверка БД:
```bash
# Прямое подключение через psql
docker exec -it constructure-postgres-dev psql -U constructure -d constructure_dev

# Список таблиц
\dt

# Выход
\q
```

### 3. Проверка API
```bash
cd apps/api
npm run dev
```

**Тест**: http://localhost:3001/health
**Ожидаемый результат**: `{"status": "ok"}`

### 4. Проверка Frontend
```bash
cd apps/web  
npm run dev
```

**Тест**: http://localhost:3000
**Ожидаемый результат**: Страница входа загружается

## 🔧 Устранение проблем

### PostgreSQL не запускается
```bash
# Проверить занятые порты
sudo lsof -i :5432
sudo lsof -i :5433

# Остановить локальный PostgreSQL если нужно
sudo systemctl stop postgresql
```

### Adminer: "database does not exist"
Это означает что данные введены неправильно. Проверьте:
1. **Database**: должно быть `constructure_dev`, НЕ `dev_password_123`
2. **Server**: должно быть `postgres`, НЕ `localhost`
3. **Username**: должно быть `constructure`
4. **Password**: должно быть `dev_password_123`

### Prisma ошибки
```bash
cd apps/api
export DATABASE_URL="postgresql://constructure:dev_password_123@localhost:5433/constructure_dev"
node node_modules/prisma/build/index.js generate
node node_modules/prisma/build/index.js db push
```

### Очистка Docker
```bash
# Остановить все контейнеры
docker-compose -f docker-compose.dev.yml down

# Удалить volumes (ВНИМАНИЕ: удалит данные)
docker volume rm constructure_postgres_data constructure_redis_data

# Перезапуск
./scripts/dev-start.sh
```

## 📊 Статус компонентов

| Компонент | Статус | URL | Порт |
|-----------|--------|-----|------|
| PostgreSQL | ✅ | localhost | 5433 |
| Redis | ✅ | localhost | 6379 |
| Adminer | ✅ | http://localhost:8080 | 8080 |
| API | 🔄 | http://localhost:3001 | 3001 |
| Frontend | 🔄 | http://localhost:3000 | 3000 |

**Легенда**: ✅ Готово | 🔄 В разработке | ❌ Проблема

## 🚀 Следующие шаги

1. **Тестирование аутентификации**
   - Регистрация пользователя
   - Вход в систему
   - JWT токены

2. **Создание первого курса**
   - CRUD операции
   - Сохранение в БД
   - Валидация данных

3. **Базовая визуализация**
   - Режим "дерево"
   - Drag & Drop
   - Позиционирование узлов 