'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Input, Spinner } from '../../components/ui';
import { PlusIcon, SearchIcon, BookOpenIcon, UsersIcon, GlobeIcon, LockIcon } from 'lucide-react';

// Типы для курсов
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
  _count: {
    nodes: number;
    collaborators: number;
  };
}

interface CoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'my' | 'public' | 'templates'>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Загрузка курсов
  const loadCourses = async (page = 1, searchQuery = search) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(filter === 'public' && { isPublic: 'true' }),
        ...(filter === 'templates' && { isTemplate: 'true' })
      });

      const response = await fetch(`/api/courses?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data: CoursesResponse = await response.json();
        setCourses(data.courses);
        setPagination({
          page: data.pagination.page,
          totalPages: data.pagination.totalPages,
          hasNextPage: data.pagination.hasNextPage,
          hasPrevPage: data.pagination.hasPrevPage
        });
      } else {
        console.error('Ошибка загрузки курсов');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [filter]);

  // Поиск с задержкой
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadCourses(1, search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getAuthorName = (author: Course['author']) => {
    if (author.firstName || author.lastName) {
      return `${author.firstName || ''} ${author.lastName || ''}`.trim();
    }
    return author.email;
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Загрузка курсов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Мои курсы</h1>
              <p className="mt-2 text-gray-600">
                Создавайте и редактируйте образовательные курсы
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/courses/new">
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Создать курс
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Поиск */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск курсов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Фильтры */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Все' },
              { key: 'my', label: 'Мои' },
              { key: 'public', label: 'Публичные' },
              { key: 'templates', label: 'Шаблоны' }
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter(filterOption.key as any)}
              >
                {filterOption.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Список курсов */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto w-12 h-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {search ? 'Курсы не найдены' : 'Нет курсов'}
            </h3>
            <p className="mt-2 text-gray-600">
              {search 
                ? 'Попробуйте изменить поисковый запрос' 
                : 'Создайте свой первый курс, чтобы начать работу'
              }
            </p>
            {!search && (
              <div className="mt-6">
                <Link href="/courses/new">
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Создать курс
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Сетка курсов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`}>
                  <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                    {/* Превью изображение */}
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpenIcon className="w-8 h-8 text-white/80" />
                        </div>
                      )}
                      
                      {/* Бейджи */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {course.isPublic ? (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <GlobeIcon className="w-3 h-3 mr-1" />
                            Публичный
                          </span>
                        ) : (
                          <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <LockIcon className="w-3 h-3 mr-1" />
                            Приватный
                          </span>
                        )}
                        {course.isTemplate && (
                          <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            Шаблон
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Контент */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {course.title}
                      </h3>
                      
                      {course.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {course.description}
                        </p>
                      )}

                      {/* Метрики */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <BookOpenIcon className="w-3 h-3 mr-1" />
                          {course._count.nodes} блоков
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="w-3 h-3 mr-1" />
                          {course._count.collaborators} участников
                        </div>
                      </div>

                      {/* Автор и дата */}
                      <div className="text-xs text-gray-500">
                        <div className="mb-1">{getAuthorName(course.author)}</div>
                        <div>Обновлен {formatDate(course.updatedAt)}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Пагинация */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasPrevPage || loading}
                  onClick={() => loadCourses(pagination.page - 1)}
                >
                  Назад
                </Button>
                
                <span className="text-sm text-gray-600 px-4">
                  Страница {pagination.page} из {pagination.totalPages}
                </span>
                
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => loadCourses(pagination.page + 1)}
                >
                  Вперёд
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 