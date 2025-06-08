'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Spinner } from '../../../components/ui';
import { ArrowLeftIcon, SaveIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';

interface CreateCourseData {
  title: string;
  description: string;
  thumbnail: string;
  isPublic: boolean;
  isTemplate: boolean;
}

export default function NewCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    thumbnail: '',
    isPublic: false,
    isTemplate: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateCourseData>>({});

  const handleInputChange = (field: keyof CreateCourseData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<CreateCourseData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название курса обязательно';
    }
    
    if (formData.thumbnail && !isValidUrl(formData.thumbnail)) {
      newErrors.thumbnail = 'Некорректный URL изображения';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          thumbnail: formData.thumbnail.trim() || undefined,
          isPublic: formData.isPublic,
          isTemplate: formData.isTemplate
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/courses/${data.course.id}`);
      } else {
        const errorData = await response.json();
        console.error('Ошибка создания курса:', errorData);
        // TODO: Показать пользователю ошибку
      }
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link 
              href="/courses" 
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Создать новый курс</h1>
              <p className="mt-2 text-gray-600">
                Заполните основную информацию о курсе
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Форма */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная форма */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Основная информация
                </h2>

                <div className="space-y-6">
                  {/* Название */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Название курса *
                    </label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Введите название курса"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                  </div>

                  {/* Описание */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Опишите содержание и цели курса"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>

                  {/* Изображение */}
                  <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                      URL изображения
                    </label>
                    <Input
                      id="thumbnail"
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={errors.thumbnail ? 'border-red-500' : ''}
                    />
                    {errors.thumbnail && (
                      <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Рекомендуемое соотношение сторон: 16:9
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Настройки */}
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Настройки
                </h2>

                <div className="space-y-4">
                  {/* Публичность */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isPublic"
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isPublic" className="font-medium text-gray-700 flex items-center">
                        {formData.isPublic ? (
                          <EyeIcon className="w-4 h-4 mr-1 text-green-600" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4 mr-1 text-gray-400" />
                        )}
                        Публичный курс
                      </label>
                      <p className="text-gray-500">
                        {formData.isPublic 
                          ? 'Курс будет доступен для всех пользователей'
                          : 'Курс будет доступен только вам и соавторам'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Шаблон */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isTemplate"
                        type="checkbox"
                        checked={formData.isTemplate}
                        onChange={(e) => handleInputChange('isTemplate', e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isTemplate" className="font-medium text-gray-700">
                        Шаблон курса
                      </label>
                      <p className="text-gray-500">
                        Курс может использоваться как шаблон для создания новых курсов
                      </p>
                    </div>
                  </div>
                </div>

                {/* Превью изображения */}
                {formData.thumbnail && isValidUrl(formData.thumbnail) && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Превью
                    </label>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.thumbnail}
                        alt="Превью курса"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Кнопки действий */}
                <div className="mt-8 space-y-3">
                  <Button
                    type="submit"
                    disabled={loading || !formData.title.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Создание...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Создать курс
                      </>
                    )}
                  </Button>

                  <Link href="/courses" className="block">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full"
                      disabled={loading}
                    >
                      Отмена
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 