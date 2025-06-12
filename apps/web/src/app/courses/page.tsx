'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui';

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  nodeCount: number;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Введение в программирование',
    description: 'Основы программирования для начинающих',
    createdAt: '2024-01-15',
    nodeCount: 12
  },
  {
    id: '2',
    title: 'Основы дизайна',
    description: 'Принципы графического дизайна и композиции',
    createdAt: '2024-01-10',
    nodeCount: 8
  },
  {
    id: '3',
    title: 'Управление проектами',
    description: 'Методология Agile и Scrum',
    createdAt: '2024-01-05',
    nodeCount: 15
  }
];

export default function CoursesPage() {
  const [courses] = useState<Course[]>(mockCourses);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Мои курсы</h1>
            <p className="text-gray-600 mt-2">
              Управляйте своими образовательными курсами
            </p>
          </div>
          
          <Link href="/courses/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Создать курс
            </Button>
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-400 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              У вас пока нет курсов
            </h3>
            <p className="text-gray-600 mb-6">
              Создайте свой первый курс, чтобы начать обучение
            </p>
            <Link href="/courses/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Создать первый курс
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      ⋯
                    </Button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{course.nodeCount} элементов</span>
                  <span>{new Date(course.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/courses/${course.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Редактировать
                    </Button>
                  </Link>
                  <Link href={`/courses/${course.id}`} className="flex-1">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Открыть
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 