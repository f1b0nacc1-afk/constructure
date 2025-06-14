'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui';

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  nodeCount: number;
  connectionsCount?: number;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  nodes: any[];
  connections: any[];
}

// Функция для получения всех курсов (дефолтные + созданные пользователем)
const getAllCourses = (): Course[] => {
  const courses: Course[] = [];
  
  // Дефолтные курсы
  const defaultCourses = [
    {
      id: '1',
      title: 'Введение в программирование',
      description: 'Основы программирования для начинающих',
      createdAt: '2024-01-15',
      nodeCount: 3
    },
    {
      id: '2',
      title: 'Основы дизайна',
      description: 'Принципы графического дизайна и композиции',
      createdAt: '2024-01-10',
      nodeCount: 3
    },
    {
      id: '3',
      title: 'Управление проектами',
      description: 'Методология Agile и Scrum',
      createdAt: '2024-01-05',
      nodeCount: 5
    }
  ];

  // Проверяем localStorage для каждого дефолтного курса
  defaultCourses.forEach(defaultCourse => {
    try {
      const savedCourse = localStorage.getItem(`course_${defaultCourse.id}`);
      if (savedCourse) {
        const courseData: CourseData = JSON.parse(savedCourse);
        courses.push({
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          createdAt: defaultCourse.createdAt,
          nodeCount: courseData.nodes.length,
          connectionsCount: courseData.connections.length
        });
      } else {
        courses.push(defaultCourse);
      }
    } catch (error) {
      console.error(`Ошибка загрузки курса ${defaultCourse.id}:`, error);
      courses.push(defaultCourse);
    }
  });

  // Добавляем созданные пользователем курсы
  try {
    const coursesList = localStorage.getItem('courses_list');
    if (coursesList) {
      const userCourses = JSON.parse(coursesList);
      userCourses.forEach((userCourse: any) => {
        // Проверяем, что это не дефолтный курс
        if (!['1', '2', '3'].includes(userCourse.id)) {
          courses.push({
            id: userCourse.id,
            title: userCourse.title,
            description: userCourse.description,
            createdAt: userCourse.createdAt,
            nodeCount: userCourse.elementsCount || 0,
            connectionsCount: userCourse.connectionsCount || 0
          });
        }
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки списка курсов:', error);
  }

  return courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем курсы при монтировании компонента
    const loadCourses = () => {
      try {
        const allCourses = getAllCourses();
        setCourses(allCourses);
        console.log('Загружено курсов:', allCourses.length);
      } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();

    // Обновляем список при изменении localStorage
    const handleStorageChange = () => {
      loadCourses();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">Загрузка курсов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Мои курсы</h1>
            <p className="text-gray-600 mt-2">
              Управляйте своими образовательными курсами ({courses.length} курсов)
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
                  <span>
                    {course.nodeCount} элементов
                    {course.connectionsCount !== undefined && ` • ${course.connectionsCount} связей`}
                  </span>
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