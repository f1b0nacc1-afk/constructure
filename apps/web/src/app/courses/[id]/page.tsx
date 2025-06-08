'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Spinner } from '../../../components/ui';
import { 
  ArrowLeftIcon, 
  EditIcon, 
  ShareIcon, 
  CopyIcon, 
  TrashIcon,
  PlayIcon,
  UsersIcon,
  BookOpenIcon,
  GlobeIcon,
  LockIcon,
  CalendarIcon,
  UserIcon
} from 'lucide-react';

// Типы данных
interface CourseNode {
  id: string;
  type: string;
  title: string;
  content?: any;
  positions: any;
  config?: any;
  createdAt: string;
  updatedAt: string;
}

interface CourseEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  label?: string;
  condition?: any;
  style?: any;
}

interface CourseCollaborator {
  id: string;
  role: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isPublic: boolean;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  nodes: CourseNode[];
  collaborators: CourseCollaborator[];
}

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const courseId = params.id as string;

  // Загрузка курса
  const loadCourse = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else if (response.status === 404) {
        router.push('/courses');
      } else {
        console.error('Ошибка загрузки курса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorName = (author: Course['author']) => {
    if (author.firstName || author.lastName) {
      return `${author.firstName || ''} ${author.lastName || ''}`.trim();
    }
    return author.email;
  };

  const handleDuplicate = async () => {
    if (!course) return;
    
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/courses/${course.id}/duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/courses/${data.course.id}`);
      } else {
        console.error('Ошибка дублирования курса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!course) return;
    
    if (!confirm('Вы уверены, что хотите удалить этот курс? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/courses/${course.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        router.push('/courses');
      } else {
        console.error('Ошибка удаления курса');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Загрузка курса...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Курс не найден</h2>
          <p className="text-gray-600 mb-4">Возможно, курс был удален или у вас нет прав доступа</p>
          <Link href="/courses">
            <Button>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Вернуться к курсам
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Link 
                href="/courses" 
                className="mt-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </Link>
              
              <div className="flex-1">
                {/* Превью изображение */}
                {course.thumbnail && (
                  <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                  
                  {/* Бейджи */}
                  {course.isPublic ? (
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full flex items-center">
                      <GlobeIcon className="w-3 h-3 mr-1" />
                      Публичный
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full flex items-center">
                      <LockIcon className="w-3 h-3 mr-1" />
                      Приватный
                    </span>
                  )}
                  
                  {course.isTemplate && (
                    <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                      Шаблон
                    </span>
                  )}
                </div>
                
                {course.description && (
                  <p className="text-gray-600 mb-4 max-w-2xl">{course.description}</p>
                )}
                
                {/* Метаинформация */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {getAuthorName(course.author)}
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="w-4 h-4 mr-1" />
                    {course.nodes.length} блоков
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    {course.collaborators.length} участников
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Обновлен {formatDate(course.updatedAt)}
                  </div>
                </div>
              </div>
            </div>

            {/* Действия */}
            <div className="flex items-center space-x-2 ml-4">
              <Link href={`/courses/${course.id}/editor`}>
                <Button>
                  <EditIcon className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              </Link>
              
              <Link href={`/courses/${course.id}/preview`}>
                <Button variant="secondary">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Предпросмотр
                </Button>
              </Link>
              
              <Button
                variant="secondary"
                onClick={handleDuplicate}
                disabled={actionLoading}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Дублировать
              </Button>
              
              <Button variant="secondary">
                <ShareIcon className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
              
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Удалить
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Структура курса */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Структура курса
              </h2>
              
              {course.nodes.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpenIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Курс пока не содержит блоков</p>
                  <Link href={`/courses/${course.id}/editor`}>
                    <Button>
                      <EditIcon className="w-4 h-4 mr-2" />
                      Начать редактирование
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {course.nodes.map((node, index) => (
                    <div
                      key={node.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{node.title}</h4>
                        <p className="text-sm text-gray-500 capitalize">{node.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Участники */}
            {course.collaborators.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Участники
                </h3>
                <div className="space-y-3">
                  {course.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {collaborator.user.firstName || collaborator.user.lastName
                            ? `${collaborator.user.firstName || ''} ${collaborator.user.lastName || ''}`.trim()
                            : collaborator.user.email
                          }
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{collaborator.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Статистика */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Статистика
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Блоков:</span>
                  <span className="font-medium">{course.nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Участников:</span>
                  <span className="font-medium">{course.collaborators.length + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Создан:</span>
                  <span className="font-medium text-sm">
                    {formatDate(course.createdAt)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 