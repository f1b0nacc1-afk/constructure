'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui';

const mockCourse = {
  id: '1',
  title: 'Введение в программирование',
  description: 'Основы программирования для начинающих разработчиков. В этом курсе вы изучите базовые концепции программирования, синтаксис языка и научитесь создавать простые программы.',
  createdAt: '2024-01-15',
  nodeCount: 12,
  nodes: [
    {
      id: '1',
      title: 'Урок 1: Что такое программирование?',
      type: 'lesson' as const,
      description: 'Введение в мир программирования и основные концепции'
    },
    {
      id: '2',
      title: 'Урок 2: Переменные и типы данных',
      type: 'lesson' as const,
      description: 'Изучаем основные типы данных и работу с переменными'
    },
    {
      id: '3', 
      title: 'Тест: Проверка знаний основ',
      type: 'quiz' as const,
      description: 'Проверьте свои знания по пройденному материалу'
    },
    {
      id: '4',
      title: 'Урок 3: Условные конструкции',
      type: 'lesson' as const,
      description: 'Логические операторы и условные конструкции'
    },
    {
      id: '5',
      title: 'Практическое задание',
      type: 'assignment' as const,
      description: 'Решите практические задачи для закрепления материала'
    }
  ]
};

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {mockCourse.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {mockCourse.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>📚 {mockCourse.nodeCount} элементов</span>
                <span>📅 Создан {new Date(mockCourse.createdAt).toLocaleDateString('ru-RU')}</span>
                <span>🆔 ID: {params.id}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/courses')}
              >
                ← Назад к курсам
              </Button>
              <Link href={`/courses/${params.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  ✏️ Редактировать
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Course Structure */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Структура курса
            </h2>
            <p className="text-gray-600 mt-1">
              Последовательность изучения материала
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {mockCourse.nodes.map((node, index) => (
                <div
                  key={node.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
                    {index + 1}
                  </div>
                  
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-4 ${
                    node.type === 'lesson' ? 'bg-blue-500' :
                    node.type === 'quiz' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`}></div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {node.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {node.description}
                    </p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    node.type === 'lesson' ? 'bg-blue-100 text-blue-800' :
                    node.type === 'quiz' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {node.type === 'lesson' ? 'Урок' : 
                     node.type === 'quiz' ? 'Тест' : 'Задание'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-4">
            <Button 
              variant="outline"
              className="px-8 py-3"
            >
              📊 Статистика прохождения
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              ▶️ Начать изучение
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-3"
            >
              📤 Поделиться курсом
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 