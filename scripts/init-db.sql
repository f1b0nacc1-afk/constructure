-- Инициализация базы данных Constructure
-- Создание расширений и базовых настроек

-- Включаем расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Создаем пользователя для приложения если не существует
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'constructure_app') THEN
        CREATE ROLE constructure_app WITH LOGIN PASSWORD 'app_password_123';
    END IF;
END
$$;

-- Даем права на базу данных
GRANT ALL PRIVILEGES ON DATABASE constructure_dev TO constructure_app;
GRANT ALL PRIVILEGES ON SCHEMA public TO constructure_app;

-- Создаем схему для временных данных
CREATE SCHEMA IF NOT EXISTS temp_data;
GRANT ALL PRIVILEGES ON SCHEMA temp_data TO constructure_app;

-- Настройки для разработки
ALTER DATABASE constructure_dev SET timezone TO 'UTC';
ALTER DATABASE constructure_dev SET log_statement TO 'all';

-- Комментарий
COMMENT ON DATABASE constructure_dev IS 'База данных для разработки платформы Constructure'; 