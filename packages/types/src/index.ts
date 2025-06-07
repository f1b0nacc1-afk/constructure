// Базовые типы
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// Пользователь
export interface User extends BaseEntity {
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  verified: boolean
}

// Курс
export interface Course extends BaseEntity {
  title: string
  description?: string
  thumbnail?: string
  isPublic: boolean
  isTemplate: boolean
  authorId: string
  author?: User
  nodes?: CourseNode[]
  edges?: CourseEdge[]
  collaborators?: CourseCollaborator[]
  comments?: Comment[]
  versions?: CourseVersion[]
}

// Узел курса
export interface CourseNode extends BaseEntity {
  courseId: string
  type: NodeType
  title: string
  content?: any
  positions: NodePositions
  config?: any
}

// Связь между узлами
export interface CourseEdge extends BaseEntity {
  courseId: string
  sourceId: string
  targetId: string
  type: EdgeType
  label?: string
  condition?: any
  style?: EdgeStyle
}

// Совместная работа
export interface CourseCollaborator extends BaseEntity {
  courseId: string
  userId: string
  role: CollaboratorRole
  permissions?: any
  user?: User
}

// Комментарий
export interface Comment extends BaseEntity {
  courseId: string
  userId: string
  content: string
  resolved: boolean
  nodeId?: string
  position?: Position
  user?: User
}

// Версия курса
export interface CourseVersion extends BaseEntity {
  courseId: string
  version: string
  description?: string
  snapshot: any
}

// Позиции узла для разных режимов визуализации
export interface NodePositions {
  tree: Position
  lego: Position
  mindmap: Position
  flowchart: Position
}

// Позиция
export interface Position {
  x: number
  y: number
}

// Стиль связи
export interface EdgeStyle {
  color?: string
  width?: number
  type?: 'solid' | 'dashed' | 'dotted'
  animated?: boolean
}

// Перечисления
export enum NodeType {
  LESSON = 'LESSON',
  TEST = 'TEST',
  ASSIGNMENT = 'ASSIGNMENT',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  INTERACTIVE = 'INTERACTIVE',
  CONDITION = 'CONDITION',
  START = 'START',
  END = 'END',
}

export enum EdgeType {
  SEQUENCE = 'SEQUENCE',
  CONDITION = 'CONDITION',
  REFERENCE = 'REFERENCE',
}

export enum CollaboratorRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  COMMENTER = 'COMMENTER',
  VIEWER = 'VIEWER',
}

// Режимы визуализации
export enum VisualizationMode {
  TREE = 'tree',
  LEGO = 'lego',
  MINDMAP = 'mindmap',
  FLOWCHART = 'flowchart',
}

// API типы
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Аутентификация
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
}

export interface AuthResponse extends ApiResponse<User> {
  token: string
}

// Курсы API
export interface CreateCourseRequest {
  title: string
  description?: string
  isPublic?: boolean
  isTemplate?: boolean
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string
}

// Узлы API
export interface CreateNodeRequest {
  courseId: string
  type: NodeType
  title: string
  content?: any
  positions: NodePositions
  config?: any
}

export interface UpdateNodeRequest extends Partial<CreateNodeRequest> {
  id: string
}

// Связи API
export interface CreateEdgeRequest {
  courseId: string
  sourceId: string
  targetId: string
  type?: EdgeType
  label?: string
  condition?: any
  style?: EdgeStyle
}

export interface UpdateEdgeRequest extends Partial<CreateEdgeRequest> {
  id: string
}

// WebSocket события
export interface WebSocketEvent<T = any> {
  type: string
  payload: T
  userId: string
  courseId: string
  timestamp: string
}

export enum WebSocketEventType {
  // Курс
  COURSE_UPDATED = 'course:updated',
  
  // Узлы
  NODE_CREATED = 'node:created',
  NODE_UPDATED = 'node:updated',
  NODE_DELETED = 'node:deleted',
  NODE_MOVED = 'node:moved',
  
  // Связи
  EDGE_CREATED = 'edge:created',
  EDGE_UPDATED = 'edge:updated',
  EDGE_DELETED = 'edge:deleted',
  
  // Совместная работа
  USER_JOINED = 'user:joined',
  USER_LEFT = 'user:left',
  USER_CURSOR = 'user:cursor',
  
  // Комментарии
  COMMENT_CREATED = 'comment:created',
  COMMENT_UPDATED = 'comment:updated',
  COMMENT_DELETED = 'comment:deleted',
}

// Состояние приложения
export interface AppState {
  user: User | null
  currentCourse: Course | null
  visualizationMode: VisualizationMode
  selectedNodes: string[]
  selectedEdges: string[]
  isLoading: boolean
  error: string | null
}

// Drag & Drop
export interface DragItem {
  type: string
  id: string
  nodeType?: NodeType
}

export interface DropResult {
  position: Position
  targetId?: string
} 