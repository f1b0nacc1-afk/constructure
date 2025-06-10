// Локальные типы для API
export interface User {
  id: string
  email: string
  username?: string | null
  firstName?: string | null
  lastName?: string | null
  avatar?: string | null
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatar?: string | null
    createdAt: Date
    updatedAt: Date
  }
  accessToken: string
  refreshToken: string
}

export interface Course {
  id: string
  title: string
  description?: string
  thumbnail?: string
  isPublic: boolean
  isTemplate: boolean
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCourseRequest {
  title: string
  description?: string
  isPublic?: boolean
  isTemplate?: boolean
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string
} 