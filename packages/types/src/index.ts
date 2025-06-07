// Base types
export type UUID = string;
export type Timestamp = Date;

// User types
export interface User {
  id: UUID;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Course types
export interface Course {
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

export interface CourseMetadata {
  estimatedDuration: number; // в минутах
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  version: string;
  prerequisites: string[];
}

// Graph types
export interface CourseGraph {
  nodes: Map<UUID, CourseNode>;
  edges: Map<UUID, CourseEdge>;
  layouts: Map<LayoutType, LayoutData>;
  metadata: GraphMetadata;
}

export interface CourseNode {
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

export interface CourseEdge {
  id: UUID;
  sourceId: UUID;
  targetId: UUID;
  type: EdgeType;
  condition?: EdgeCondition;
  label?: string;
  style?: EdgeStyle;
}

// Node types
export type NodeType = 
  | 'module'
  | 'lesson'
  | 'video'
  | 'quiz'
  | 'assignment'
  | 'text'
  | 'interactive'
  | 'checkpoint'
  | 'branch'
  | 'start'
  | 'end';

export type EdgeType = 
  | 'sequence'
  | 'conditional'
  | 'optional'
  | 'prerequisite'
  | 'reference';

// Content types
export type NodeContent = 
  | LessonContent
  | VideoContent
  | QuizContent
  | AssignmentContent
  | TextContent
  | InteractiveContent;

export interface LessonContent {
  type: 'lesson';
  body: string;
  attachments: Attachment[];
  resources: Resource[];
}

export interface VideoContent {
  type: 'video';
  videoUrl: string;
  duration: number;
  subtitles?: Subtitle[];
  chapters?: VideoChapter[];
}

export interface QuizContent {
  type: 'quiz';
  questions: Question[];
  settings: QuizSettings;
  scoring: ScoringConfig;
}

export interface AssignmentContent {
  type: 'assignment';
  instructions: string;
  submissionType: 'text' | 'file' | 'url' | 'code';
  rubric?: AssignmentRubric;
  dueDate?: Timestamp;
}

export interface TextContent {
  type: 'text';
  content: string;
  format: 'markdown' | 'html' | 'plain';
}

export interface InteractiveContent {
  type: 'interactive';
  config: Record<string, any>;
  componentType: string;
}

// Utility types
export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface NodeConfig {
  isRequired: boolean;
  passingScore?: number;
  maxAttempts?: number;
  timeLimit?: number;
  allowSkip: boolean;
  showProgress: boolean;
}

export interface EdgeCondition {
  type: 'score' | 'completion' | 'time' | 'custom';
  operator: '>' | '<' | '==' | '!=' | '>=' | '<=';
  value: number | string | boolean;
  expression?: string;
}

export interface EdgeStyle {
  color?: string;
  width?: number;
  dashArray?: string;
  animated?: boolean;
}

// Layout types
export type LayoutType = 'tree' | 'lego' | 'mindmap' | 'flowchart';

export interface LayoutData {
  type: LayoutType;
  positions: Map<UUID, Position>;
  viewBox: ViewBox;
  zoom: number;
  settings: LayoutSettings;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutSettings {
  spacing?: number;
  direction?: 'horizontal' | 'vertical';
  alignment?: 'start' | 'center' | 'end';
  autoLayout?: boolean;
}

export interface GraphMetadata {
  totalNodes: number;
  totalEdges: number;
  lastModified: Timestamp;
  version: number;
}

// Question types for quizzes
export interface Question {
  id: UUID;
  type: 'multiple-choice' | 'single-choice' | 'text' | 'true-false' | 'matching' | 'ordering';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number;
  explanation?: string;
  points: number;
  tags?: string[];
}

export interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showFeedback: boolean;
  allowReview: boolean;
  timeLimit?: number;
  maxAttempts: number;
}

export interface ScoringConfig {
  totalPoints: number;
  passingScore: number;
  showScore: boolean;
  weightedScoring: boolean;
}

export interface AssignmentRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: UUID;
  name: string;
  description: string;
  maxPoints: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  points: number;
  description: string;
}

// Media types
export interface Attachment {
  id: UUID;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Resource {
  id: UUID;
  title: string;
  type: 'link' | 'document' | 'tool';
  url: string;
  description?: string;
}

export interface Subtitle {
  language: string;
  url: string;
}

export interface VideoChapter {
  title: string;
  startTime: number;
  endTime: number;
}

// Collaboration types
export interface Comment {
  id: UUID;
  content: string;
  nodeId?: UUID;
  position?: Position;
  resolved: boolean;
  authorId: UUID;
  courseId: UUID;
  parentId?: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CollaboratorCursor {
  userId: UUID;
  position: Position;
  color: string;
  lastSeen: Timestamp;
}

export interface Conflict {
  id: UUID;
  nodeId: UUID;
  conflictType: 'concurrent_edit' | 'version_mismatch' | 'delete_conflict';
  details: ConflictDetails;
  participants: UUID[];
  createdAt: Timestamp;
}

export interface ConflictDetails {
  originalValue: any;
  currentValue: any;
  incomingValue: any;
  field: string;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    pagination?: PaginationMeta;
    timestamp: Timestamp;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// WebSocket event types
export interface WSClientEvents {
  'join-course': { courseId: string };
  'leave-course': { courseId: string };
  'node-update': { courseId: string; nodeId: string; changes: Partial<CourseNode> };
  'edge-update': { courseId: string; edgeId: string; changes: Partial<CourseEdge> };
  'layout-update': { courseId: string; layoutType: LayoutType; changes: Partial<LayoutData> };
  'cursor-move': { courseId: string; position: Position };
  'selection-change': { courseId: string; selectedIds: string[] };
}

export interface WSServerEvents {
  'user-joined': { user: User };
  'user-left': { userId: string };
  'node-updated': { nodeId: string; changes: Partial<CourseNode>; author: User };
  'edge-updated': { edgeId: string; changes: Partial<CourseEdge>; author: User };
  'layout-updated': { layoutType: LayoutType; changes: Partial<LayoutData>; author: User };
  'cursor-moved': { userId: string; position: Position };
  'selection-changed': { userId: string; selectedIds: string[] };
  'conflict-detected': { conflictId: string; details: ConflictDetails };
}

// State management types
export interface EditorState {
  graph: CourseGraph;
  currentLayout: LayoutType;
  viewport: ViewBox;
  selectedNodes: Set<string>;
  selectedEdges: Set<string>;
  history: HistoryStack;
  mode: EditorMode;
}

export interface HistoryStack {
  past: HistoryEntry[];
  present: HistoryEntry;
  future: HistoryEntry[];
}

export interface HistoryEntry {
  graph: CourseGraph;
  timestamp: Timestamp;
  description: string;
}

export type EditorMode = 'select' | 'drag' | 'connect' | 'edit' | 'preview'; 