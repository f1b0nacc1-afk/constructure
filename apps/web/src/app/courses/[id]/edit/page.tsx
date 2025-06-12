'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../../components/ui';

interface CourseNode {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  position: { x: number; y: number };
}

const mockCourse = {
  id: '1',
  title: 'Введение в программирование',
  description: 'Основы программирования для начинающих',
  nodes: [
    {
      id: '1',
      title: 'Урок 1: Основы',
      type: 'lesson' as const,
      position: { x: 100, y: 100 }
    },
    {
      id: '2', 
      title: 'Тест по основам',
      type: 'quiz' as const,
      position: { x: 300, y: 150 }
    }
  ]
};

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const [course, setCourse] = useState(mockCourse);
  const [nodes, setNodes] = useState<CourseNode[]>(course.nodes);

  const addNode = (type: 'lesson' | 'quiz' | 'assignment') => {
    const newNode: CourseNode = {
      id: `node-${Date.now()}`,
      title: `Новый ${type === 'lesson' ? 'урок' : type === 'quiz' ? 'тест' : 'задание'}`,
      type,
      position: { 
        x: Math.random() * 400 + 50, 
        y: Math.random() * 300 + 50 
      }
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  const updateNode = (id: string, updates: Partial<CourseNode>) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    ));
  };

  const saveCourse = async () => {
    const updatedCourse = {
      ...course,
      nodes: nodes
    };
    
    console.log('Сохранение изменений курса:', updatedCourse);
    alert('Изменения сохранены!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Редактирование: {course.title}
            </h1>
            <p className="text-gray-600 mt-2">
              Курс ID: {params.id}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/courses')}
            >
              Отмена
            </Button>
            <Button 
              onClick={saveCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Сохранить изменения
            </Button>
          </div>
        </div>

        {/* Tools */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm font-medium text-gray-700">Добавить элемент:</span>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('lesson')}
                >
                  + Урок
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('quiz')}
                >
                  + Тест
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('assignment')}
                >
                  + Задание
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Структура курса
              </h2>
              <p className="text-sm text-gray-600">
                Элементов в курсе: {nodes.length}
              </p>
            </div>
            
            <div className="relative h-96 bg-gray-50 overflow-hidden">
              {nodes.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-lg mb-2">Курс пуст</div>
                    <div className="text-gray-500 text-sm">
                      Добавьте элементы с помощью кнопок выше
                    </div>
                  </div>
                </div>
              ) : (
                nodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute bg-white border-2 border-gray-300 rounded-lg p-3 shadow-sm"
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                      minWidth: '180px'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        node.type === 'lesson' ? 'bg-blue-100 text-blue-800' :
                        node.type === 'quiz' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {node.type === 'lesson' ? 'Урок' : 
                         node.type === 'quiz' ? 'Тест' : 'Задание'}
                      </div>
                      <button
                        onClick={() => deleteNode(node.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={node.title}
                      onChange={(e) => updateNode(node.id, { title: e.target.value })}
                      className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-500 rounded px-1 py-1"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Информация о курсе
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название курса
              </label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse({...course, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse({...course, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 