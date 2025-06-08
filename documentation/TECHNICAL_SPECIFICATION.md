# 🔧 Техническая спецификация: Constructure

## 📊 Модель данных

### Основные сущности

```typescript
// Базовые типы
type UUID = string;
type Timestamp = Date;

// Пользователь
interface User {
  id: UUID;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Курс
interface Course {
  id: UUID;
  title: string;
  description: string;
  thumbnail?: string;
  authorId: UUID;
  collaborators: UUID[];
  status: 'draft' | 'published' | 'archived';
  visibility: 'private' | 'public' | 'organization';
  tags: string[];
  metadata: CourseMetadata;
  graph: CourseGraph;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Метаданные курса
interface CourseMetadata {
  estimatedDuration: number; // в минутах
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  version: string;
  prerequisites: string[];
}

// Граф курса - центральная структура данных
interface CourseGraph {
  nodes: Map<UUID, CourseNode>;
  edges: Map<UUID, CourseEdge>;
  layouts: Map<LayoutType, LayoutData>;
  metadata: GraphMetadata;
}

// Узел курса (модуль, урок, тест и т.д.)
interface CourseNode {
  id: UUID;
  type: NodeType;
  title: string;
  description?: string;
  content: NodeContent;
  config: NodeConfig;
  position: Position;
  size: Size;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Связь между узлами
interface CourseEdge {
  id: UUID;
  sourceId: UUID;
  targetId: UUID;
  type: EdgeType;
  condition?: EdgeCondition;
  label?: string;
  style?: EdgeStyle;
}

// Типы узлов
type NodeType = 
  | 'module'      // Модуль (группировка)
  | 'lesson'      // Урок
  | 'video'       // Видео
  | 'quiz'        // Тест/квиз
  | 'assignment'  // Задание
  | 'text'        // Текстовый контент
  | 'interactive' // Интерактивный элемент
  | 'checkpoint'  // Контрольная точка
  | 'branch'      // Ветвление логики
  | 'start'       // Начальная точка
  | 'end';        // Конечная точка

// Типы связей
type EdgeType = 
  | 'sequence'    // Последовательное выполнение
  | 'conditional' // Условный переход
  | 'optional'    // Опциональный путь
  | 'prerequisite'// Требование
  | 'reference';  // Ссылка/референс

// Содержимое узла (зависит от типа)
type NodeContent = 
  | LessonContent
  | VideoContent
  | QuizContent
  | AssignmentContent
  | TextContent
  | InteractiveContent;

// Контент урока
interface LessonContent {
  type: 'lesson';
  body: string; // Rich text/HTML
  attachments: Attachment[];
  resources: Resource[];
}

// Контент видео
interface VideoContent {
  type: 'video';
  videoUrl: string;
  duration: number;
  subtitles?: Subtitle[];
  chapters?: VideoChapter[];
}

// Контент теста
interface QuizContent {
  type: 'quiz';
  questions: Question[];
  settings: QuizSettings;
  scoring: ScoringConfig;
}

// Контент задания
interface AssignmentContent {
  type: 'assignment';
  instructions: string;
  submissionType: 'text' | 'file' | 'url' | 'code';
  rubric?: AssignmentRubric;
  dueDate?: Timestamp;
}

// Позиция и размер для визуализации
interface Position {
  x: number;
  y: number;
  z?: number; // для 3D режимов
}

interface Size {
  width: number;
  height: number;
}

// Конфигурация узла
interface NodeConfig {
  isRequired: boolean;
  passingScore?: number;
  maxAttempts?: number;
  timeLimit?: number;
  allowSkip: boolean;
  showProgress: boolean;
}

// Условие для связи
interface EdgeCondition {
  type: 'score' | 'completion' | 'time' | 'custom';
  operator: '>' | '<' | '==' | '!=' | '>=' | '<=';
  value: number | string | boolean;
  expression?: string; // для сложных условий
}

// Типы макетов
type LayoutType = 'tree' | 'lego' | 'mindmap' | 'flowchart';

// Данные макета
interface LayoutData {
  type: LayoutType;
  positions: Map<UUID, Position>;
  viewBox: ViewBox;
  zoom: number;
  settings: LayoutSettings;
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Вопрос для теста
interface Question {
  id: UUID;
  type: 'multiple-choice' | 'single-choice' | 'text' | 'true-false' | 'matching' | 'ordering';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number;
  explanation?: string;
  points: number;
  tags?: string[];
}

// Настройки теста
interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showFeedback: boolean;
  allowReview: boolean;
  timeLimit?: number;
  maxAttempts: number;
}

// Система оценки
interface ScoringConfig {
  totalPoints: number;
  passingScore: number;
  showScore: boolean;
  weightedScoring: boolean;
}

// Приложение к уроку
interface Attachment {
  id: UUID;
  name: string;
  url: string;
  type: string;
  size: number;
}

// Ресурс
interface Resource {
  id: UUID;
  title: string;
  type: 'link' | 'document' | 'tool';
  url: string;
  description?: string;
}

// Субтитры
interface Subtitle {
  language: string;
  url: string;
}

// Глава видео
interface VideoChapter {
  title: string;
  startTime: number;
  endTime: number;
}
```

---

## 🔄 API Endpoints

### Аутентификация
```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Курсы
```typescript
GET    /api/courses              // Список курсов
POST   /api/courses              // Создать курс
GET    /api/courses/:id          // Получить курс
PUT    /api/courses/:id          // Обновить курс
DELETE /api/courses/:id          // Удалить курс
POST   /api/courses/:id/duplicate // Дублировать курс
GET    /api/courses/:id/export   // Экспорт курса
POST   /api/courses/import       // Импорт курса
```

### Узлы курса
```typescript
GET    /api/courses/:courseId/nodes     // Получить все узлы
POST   /api/courses/:courseId/nodes     // Создать узел
PUT    /api/courses/:courseId/nodes/:id // Обновить узел
DELETE /api/courses/:courseId/nodes/:id // Удалить узел
```

### Связи
```typescript
GET    /api/courses/:courseId/edges     // Получить все связи
POST   /api/courses/:courseId/edges     // Создать связь
PUT    /api/courses/:courseId/edges/:id // Обновить связь
DELETE /api/courses/:courseId/edges/:id // Удалить связь
```

### Макеты
```typescript
GET /api/courses/:courseId/layouts/:type // Получить макет
PUT /api/courses/:courseId/layouts/:type // Сохранить макет
```

### Совместная работа
```typescript
GET  /api/courses/:courseId/collaborators     // Список соавторов
POST /api/courses/:courseId/collaborators     // Добавить соавтора
PUT  /api/courses/:courseId/collaborators/:id // Изменить права
DELETE /api/courses/:courseId/collaborators/:id // Удалить соавтора
```

### Комментарии
```typescript
GET    /api/courses/:courseId/comments          // Все комментарии
POST   /api/courses/:courseId/comments          // Создать комментарий
PUT    /api/courses/:courseId/comments/:id      // Обновить комментарий
DELETE /api/courses/:courseId/comments/:id      // Удалить комментарий
POST   /api/courses/:courseId/comments/:id/reply // Ответить на комментарий
```

### Медиа файлы
```typescript
POST /api/media/upload    // Загрузить файл
GET  /api/media/:id       // Получить файл
DELETE /api/media/:id     // Удалить файл
```

---

## 🔗 WebSocket Events

### Совместное редактирование
```typescript
// Клиент -> Сервер
interface WSClientEvents {
  'join-course': { courseId: string };
  'leave-course': { courseId: string };
  'node-update': { courseId: string; nodeId: string; changes: Partial<CourseNode> };
  'edge-update': { courseId: string; edgeId: string; changes: Partial<CourseEdge> };
  'layout-update': { courseId: string; layoutType: LayoutType; changes: Partial<LayoutData> };
  'cursor-move': { courseId: string; position: Position };
  'selection-change': { courseId: string; selectedIds: string[] };
}

// Сервер -> Клиент
interface WSServerEvents {
  'user-joined': { user: User };
  'user-left': { userId: string };
  'node-updated': { nodeId: string; changes: Partial<CourseNode>; author: User };
  'edge-updated': { edgeId: string; changes: Partial<CourseEdge>; author: User };
  'layout-updated': { layoutType: LayoutType; changes: Partial<LayoutData>; author: User };
  'cursor-moved': { userId: string; position: Position };
  'selection-changed': { userId: string; selectedIds: string[] };
  'conflict-detected': { conflictId: string; details: ConflictDetails };
}
```

---

## 🏗️ Frontend Architecture

### State Management (Zustand)
```typescript
// Главный стор
interface AppStore {
  // Аутентификация
  user: User | null;
  isAuthenticated: boolean;
  
  // Текущий курс
  currentCourse: Course | null;
  isLoading: boolean;
  
  // Режим редактирования
  currentLayout: LayoutType;
  selectedNodes: Set<UUID>;
  selectedEdges: Set<UUID>;
  
  // UI состояние
  sidebarOpen: boolean;
  propertiesPanelOpen: boolean;
  
  // Действия
  actions: {
    // Аутентификация
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    
    // Курсы
    loadCourse: (courseId: UUID) => Promise<void>;
    saveCourse: () => Promise<void>;
    
    // Узлы
    addNode: (node: Partial<CourseNode>) => void;
    updateNode: (nodeId: UUID, changes: Partial<CourseNode>) => void;
    deleteNode: (nodeId: UUID) => void;
    
    // Связи
    addEdge: (edge: Partial<CourseEdge>) => void;
    updateEdge: (edgeId: UUID, changes: Partial<CourseEdge>) => void;
    deleteEdge: (edgeId: UUID) => void;
    
    // Макеты
    switchLayout: (layoutType: LayoutType) => void;
    updateLayout: (changes: Partial<LayoutData>) => void;
    
    // Выделение
    selectNode: (nodeId: UUID, multi?: boolean) => void;
    selectEdge: (edgeId: UUID, multi?: boolean) => void;
    clearSelection: () => void;
  };
}
```

### Компонентная архитектура
```
src/
├── components/
│   ├── ui/                 # Базовые UI компоненты
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Tooltip/
│   ├── layout/             # Компоненты макета
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── PropertiesPanel/
│   ├── course/             # Компоненты курса
│   │   ├── CourseCard/
│   │   ├── CourseList/
│   │   └── CourseSettings/
│   ├── editor/             # Компоненты редактора
│   │   ├── Canvas/
│   │   ├── Toolbar/
│   │   ├── NodePalette/
│   │   └── PropertiesEditor/
│   ├── nodes/              # Компоненты узлов
│   │   ├── BaseNode/
│   │   ├── LessonNode/
│   │   ├── VideoNode/
│   │   ├── QuizNode/
│   │   └── AssignmentNode/
│   └── visualizations/     # Компоненты визуализации
│       ├── TreeLayout/
│       ├── LegoLayout/
│       ├── MindmapLayout/
│       └── FlowchartLayout/
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── services/               # API сервисы
├── utils/                  # Утилиты
└── types/                  # TypeScript типы
```

---

## 🔧 Инфраструктура

### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://api:3001
    depends_on:
      - api

  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/constructure
      - JWT_SECRET=your-secret-key
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=constructure
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Prisma Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatar    String?
  role      Role     @default(TEACHER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Отношения
  courses       Course[] @relation("CourseAuthor")
  collaborations Collaboration[]
  comments      Comment[]

  @@map("users")
}

model Course {
  id          String       @id @default(cuid())
  title       String
  description String?
  thumbnail   String?
  status      CourseStatus @default(DRAFT)
  visibility  Visibility   @default(PRIVATE)
  tags        String[]
  metadata    Json?
  graph       Json         // Граф курса в JSON
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // Отношения
  authorId        String
  author          User            @relation("CourseAuthor", fields: [authorId], references: [id])
  collaborations  Collaboration[]
  comments        Comment[]

  @@map("courses")
}

model Collaboration {
  id        String           @id @default(cuid())
  role      CollaboratorRole @default(EDITOR)
  createdAt DateTime         @default(now())

  // Отношения
  userId   String
  user     User   @relation(fields: [userId], references: [id])
  courseId String
  course   Course @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId])
  @@map("collaborations")
}

model Comment {
  id        String    @id @default(cuid())
  content   String
  nodeId    String?   // К какому узлу относится комментарий
  position  Json?     // Позиция комментария на canvas
  resolved  Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Отношения
  authorId  String
  author    User      @relation(fields: [authorId], references: [id])
  courseId  String
  course    Course    @relation(fields: [courseId], references: [id])
  parentId  String?
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")

  @@map("comments")
}

// Enums
enum Role {
  ADMIN
  TEACHER
  STUDENT
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum Visibility {
  PRIVATE
  PUBLIC
  ORGANIZATION
}

enum CollaboratorRole {
  VIEWER
  EDITOR
  ADMIN
}
```

---

## 🚀 Production Deployment

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_API_URL=https://api.constructure.app
REACT_APP_WS_URL=wss://api.constructure.app
REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud
REACT_APP_SENTRY_DSN=https://your-sentry-dsn

# Backend (.env)
DATABASE_URL=postgresql://user:pass@db:5432/constructure
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-key
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SENTRY_DSN=https://your-sentry-dsn
NODE_ENV=production
PORT=3001
```

### Nginx Configuration
```nginx
upstream api {
    server api:3001;
}

server {
    listen 80;
    server_name constructure.app www.constructure.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name constructure.app www.constructure.app;

    # SSL configuration
    ssl_certificate /etc/ssl/certs/constructure.crt;
    ssl_certificate_key /etc/ssl/private/constructure.key;

    # Frontend
    location / {
        root /var/www/constructure;
        try_files $uri $uri/ /index.html;
        
        # Кеширование статических файлов
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API
    location /api/ {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
``` 