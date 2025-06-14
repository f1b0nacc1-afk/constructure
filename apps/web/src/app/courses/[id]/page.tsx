'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../../components/ui';

interface CourseNode {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  description: string;
  position: { x: number; y: number };
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  nodes: CourseNode[];
  connections: Connection[];
}

// Данные курса (в реальном приложении будут загружаться с API)
const getCourseData = (courseId: string): Course => {
  // Сначала пытаемся загрузить из localStorage
  try {
    const savedCourse = localStorage.getItem(`course_${courseId}`);
    if (savedCourse) {
      const parsedCourse = JSON.parse(savedCourse);
      console.log('Загружен курс из localStorage для просмотра:', parsedCourse);
      return parsedCourse;
    }
  } catch (error) {
    console.error('Ошибка загрузки курса из localStorage:', error);
  }

  // Если не найден в localStorage, используем дефолтные данные
  const courses: Record<string, Course> = {
    '1': {
      id: '1',
      title: 'Введение в программирование',
      description: 'Основы программирования для начинающих разработчиков. В этом курсе вы изучите базовые концепции программирования, синтаксис языка и научитесь создавать простые программы.',
      createdAt: '2024-01-15',
      nodes: [
        {
          id: '1',
          title: 'Урок 1: Что такое программирование?',
          type: 'lesson',
          description: 'Введение в мир программирования и основные концепции',
          position: { x: 100, y: 100 }
        },
        {
          id: '2',
          title: 'Урок 2: Переменные и типы данных',
          type: 'lesson',
          description: 'Изучаем основные типы данных и работу с переменными',
          position: { x: 400, y: 100 }
        },
        {
          id: '3', 
          title: 'Тест: Проверка знаний основ',
          type: 'quiz',
          description: 'Проверьте свои знания по пройденному материалу',
          position: { x: 250, y: 250 }
        }
      ],
      connections: [
        { id: 'conn1', from: '1', to: '2' },
        { id: 'conn2', from: '2', to: '3' }
      ]
    },
    '2': {
      id: '2',
      title: 'Основы дизайна',
      description: 'Принципы графического дизайна и композиции',
      createdAt: '2024-01-10',
      nodes: [
        {
          id: '1',
          title: 'Введение в дизайн',
          type: 'lesson',
          description: 'Основные принципы дизайна',
          position: { x: 200, y: 100 }
        },
        {
          id: '2',
          title: 'Цветовая теория',
          type: 'lesson',
          description: 'Работа с цветом в дизайне',
          position: { x: 200, y: 250 }
        },
        {
          id: '3',
          title: 'Тест по цветам',
          type: 'quiz',
          description: 'Проверка знаний цветовой теории',
          position: { x: 200, y: 400 }
        }
      ],
      connections: [
        { id: 'conn1', from: '1', to: '2' },
        { id: 'conn2', from: '2', to: '3' }
      ]
    },
    '3': {
      id: '3',
      title: 'Управление проектами',
      description: 'Методология Agile и Scrum',
      createdAt: '2024-01-05',
      nodes: [
        {
          id: '1',
          title: 'Введение в Agile',
          type: 'lesson',
          description: 'Основы гибкой методологии разработки',
          position: { x: 100, y: 100 }
        },
        {
          id: '2',
          title: 'Scrum фреймворк',
          type: 'lesson',
          description: 'Изучение Scrum процессов',
          position: { x: 300, y: 100 }
        },
        {
          id: '3',
          title: 'Kanban доска',
          type: 'lesson',
          description: 'Работа с Kanban методологией',
          position: { x: 500, y: 100 }
        },
        {
          id: '4',
          title: 'Тест по Agile',
          type: 'quiz',
          description: 'Проверка знаний Agile методологии',
          position: { x: 200, y: 250 }
        },
        {
          id: '5',
          title: 'Практическое задание: Планирование спринта',
          type: 'assignment',
          description: 'Создайте план спринта для проекта',
          position: { x: 400, y: 250 }
        }
      ],
      connections: [
        { id: 'conn1', from: '1', to: '2' },
        { id: 'conn2', from: '2', to: '3' },
        { id: 'conn3', from: '1', to: '4' },
        { id: 'conn4', from: '3', to: '5' }
      ]
    }
  };

  return courses[courseId] || {
    id: courseId,
    title: `Курс ${courseId}`,
    description: 'Описание курса',
    createdAt: new Date().toISOString(),
    nodes: [],
    connections: []
  };
};

const getNodeTypeIcon = (type: string) => {
  switch (type) {
    case 'lesson': return '📚';
    case 'quiz': return '❓';
    case 'assignment': return '📝';
    default: return '📄';
  }
};

const getNodeTypeColor = (type: string) => {
  switch (type) {
    case 'lesson': return 'bg-blue-500';
    case 'quiz': return 'bg-yellow-500';
    case 'assignment': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

// Функция для сортировки узлов по логическому порядку (на основе соединений)
const getSortedNodes = (nodes: CourseNode[], connections: Connection[]): CourseNode[] => {
  // Создаем граф зависимостей
  const graph: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};
  
  // Инициализируем
  nodes.forEach(node => {
    graph[node.id] = [];
    inDegree[node.id] = 0;
  });
  
  // Строим граф
  connections.forEach(conn => {
    if (graph[conn.from] && inDegree[conn.to] !== undefined) {
      graph[conn.from].push(conn.to);
      inDegree[conn.to]++;
    }
  });
  
  // Топологическая сортировка
  const queue: string[] = [];
  const result: string[] = [];
  
  // Находим узлы без входящих связей
  Object.keys(inDegree).forEach(nodeId => {
    if (inDegree[nodeId] === 0) {
      queue.push(nodeId);
    }
  });
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);
    
    graph[current].forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    });
  }
  
  // Если есть циклы, добавляем оставшиеся узлы
  nodes.forEach(node => {
    if (!result.includes(node.id)) {
      result.push(node.id);
    }
  });
  
  // Возвращаем отсортированные узлы
  return result.map(id => nodes.find(node => node.id === id)!).filter(Boolean);
};

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [sortedNodes, setSortedNodes] = useState<CourseNode[]>([]);

  useEffect(() => {
    // Загружаем данные курса
    const courseData = getCourseData(params.id as string);
    setCourse(courseData);
    
    // Сортируем узлы по логическому порядку
    const sorted = getSortedNodes(courseData.nodes, courseData.connections);
    setSortedNodes(sorted);
  }, [params.id]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">Загрузка курса...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {course.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>📚 {course.nodes.length} элементов</span>
                <span>🔗 {course.connections.length} соединений</span>
                <span>📅 Создан {new Date(course.createdAt).toLocaleDateString('ru-RU')}</span>
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
              Последовательность изучения материала ({sortedNodes.length} элементов)
            </p>
          </div>
          
          <div className="p-6">
            {sortedNodes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">Курс пуст</div>
                <div className="text-gray-500 text-sm mb-4">
                  В этом курсе пока нет элементов
                </div>
                <Link href={`/courses/${params.id}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    ✏️ Добавить элементы
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedNodes.map((node, index) => (
                  <div
                    key={node.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
                      {index + 1}
                    </div>
                    
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-4 ${getNodeTypeColor(node.type)}`}></div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getNodeTypeIcon(node.type)}</span>
                        <h3 className="font-medium text-gray-900">
                          {node.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {node.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getNodeTypeColor(node.type)}`}>
                        {node.type === 'lesson' ? 'Урок' : 
                         node.type === 'quiz' ? 'Тест' : 'Задание'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Course Statistics */}
        {course.nodes.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">📚</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Уроки</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {course.nodes.filter(n => n.type === 'lesson').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 text-lg">❓</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Тесты</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {course.nodes.filter(n => n.type === 'quiz').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-lg">📝</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Задания</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {course.nodes.filter(n => n.type === 'assignment').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 