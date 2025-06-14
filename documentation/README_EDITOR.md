# 🎯 Constructure - Редактор курсов

## 🚀 Полноэкранный редактор для создания интерактивных образовательных курсов

### ✨ Новые возможности

#### 🎨 Современный дизайн
- **Полноэкранный интерфейс** - максимальное рабочее пространство
- **Минималистичный UI** - фокус на создании контента
- **Адаптивная панель инструментов** - все необходимые функции под рукой
- **Современная цветовая схема** - приятная работа в течение долгого времени

#### 🔧 Функциональность

##### 📋 Типы узлов курса:
- **📖 Модуль** - раздел курса (синий)
- **📚 Урок** - обучающий материал (зеленый) 
- **🧪 Тест** - проверка знаний (оранжевый)
- **🎥 Видео** - видеоурок (фиолетовый)
- **📄 Документ** - текстовый материал (серый)
- **🎨 Интерактив** - интерактивные элементы (розовый)

##### 🎛️ Режимы просмотра:
- **🔲 Блоки** - классический вид с узлами (по умолчанию)
- **🌲 Дерево** - иерархическая структура
- **🧠 Mind Map** - ментальная карта
- **📊 Диаграмма** - схема потока

##### ⚡ Интерактивные возможности:
- **Drag & Drop** - перетаскивание элементов из палитры на холст
- **Перемещение узлов** - свободное перетаскивание по холсту
- **Дублирование узлов** - быстрое создание копий
- **Удаление узлов** - с подтверждением
- **Масштабирование** - от 10% до 300%
- **Панорамирование** - навигация по большим схемам

#### 🎯 Панели управления

##### 🛠️ Левая панель - Элементы:
- Палитра доступных типов узлов
- Описание каждого типа элемента
- Подсказки по использованию
- Возможность скрытия для экономии места

##### ⚙️ Правая панель - Свойства:
- Редактирование названия узла
- Изменение описания
- Настройка длительности (для уроков, видео)
- Количество вопросов (для тестов)
- Кнопки действий (дублировать, удалить)

##### 🎛️ Верхняя панель - Инструменты:
- Переключение режимов просмотра
- Управление масштабом
- Отмена/повтор действий
- Превью курса
- Сохранение

### 🔄 Как использовать

#### 1. **Создание узлов**
```
1. Выберите тип элемента в левой панели
2. Перетащите его на холст в нужное место
3. Отпустите кнопку мыши для создания
```

#### 2. **Редактирование узлов**
```
1. Кликните на узел для выбора
2. В правой панели измените свойства
3. Изменения применяются автоматически
```

#### 3. **Перемещение узлов**
```
1. Зажмите левую кнопку мыши на узле
2. Перетащите в нужное место
3. Отпустите кнопку мыши
```

#### 4. **Дублирование узлов**
```
1. Выберите узел
2. Нажмите синюю кнопку с иконкой копирования
3. Копия появится рядом с оригиналом
```

#### 5. **Управление видом**
```
1. Используйте кнопки масштабирования
2. Переключайте режимы просмотра
3. Скрывайте панели для большего пространства
```

### 🎨 Технические детали

#### 🛠️ Технологии:
- **Frontend**: React + Next.js + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Demo**: Pure HTML + JavaScript + Tailwind CDN

#### 📁 Структура файлов:
```
apps/web/src/app/courses/new/page.tsx  # React компонент редактора
dist/editor.html                       # HTML демо версия
apps/web/src/app/globals.css           # Стили и CSS классы
```

### 🚀 Запуск

#### 🐳 Docker (рекомендуется):
```bash
# Запуск всех сервисов
docker-compose up -d

# Доступ к приложению
# Основное приложение: http://localhost:8000
# Редактор: http://localhost:8000/courses/new
# HTML демо: http://localhost:8000/editor.html
```

#### 🌐 HTML демо:
```bash
# Открыть напрямую
open dist/editor.html
# или
python -m http.server 8080
# Затем: http://localhost:8080/editor.html
```

### 🎯 Горячие клавиши

| Действие | Клавиши |
|----------|---------|
| Отмена | `Ctrl+Z` |
| Повтор | `Ctrl+Y` |
| Сохранение | `Ctrl+S` |
| Дублирование | `Ctrl+D` |
| Удаление | `Delete` |
| Масштаб + | `Ctrl++` |
| Масштаб - | `Ctrl+-` |
| Сброс вида | `Ctrl+0` |

### 🎨 Персонализация

#### Цветовые схемы узлов:
- Модуль: `bg-blue-100 text-blue-600`
- Урок: `bg-green-100 text-green-600`  
- Тест: `bg-orange-100 text-orange-600`
- Видео: `bg-purple-100 text-purple-600`
- Документ: `bg-gray-100 text-gray-600`
- Интерактив: `bg-pink-100 text-pink-600`

#### Кастомизация в `globals.css`:
```css
.node-custom {
  @apply bg-teal-100 text-teal-600;
}
```

### 🔮 Планы развития

#### ⭐ Ближайшие фиксы:
- [ ] Соединение узлов стрелками
- [ ] Автосохранение каждые 30 секунд
- [ ] Экспорт в различные форматы
- [ ] Шаблоны курсов

#### 🚀 Будущие возможности:
- [ ] Коллаборативное редактирование
- [ ] Версионность проектов
- [ ] Интеграция с LMS системами
- [ ] AI-помощник для создания контента

### 📞 Контакты

Если у вас есть вопросы или предложения по улучшению редактора, создайте issue в репозитории проекта.

---

**Создано с ❤️ для образования будущего** 🚀 