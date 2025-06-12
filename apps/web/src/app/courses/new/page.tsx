'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui';

interface CourseNode {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  position: { x: number; y: number };
}

export default function NewCoursePage() {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [nodes, setNodes] = useState<CourseNode[]>([]);
  const [selectedNodeType, setSelectedNodeType] = useState<'lesson' | 'quiz' | 'assignment'>('lesson');

  const addNode = () => {
    const newNode: CourseNode = {
      id: `node-${Date.now()}`,
      title: `Новый ${selectedNodeType === 'lesson' ? 'урок' : selectedNodeType === 'quiz' ? 'тест' : 'задание'}`,
      type: selectedNodeType,
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

  const saveCourse = async () => {
    if (!courseTitle.trim()) {
      alert('Пожалуйста, введите название курса');
      return;
    }

    const courseData = {
      title: courseTitle,
      description: courseDescription,
      nodes: nodes
    };

    console.log('Сохранение курса:', courseData);
    alert('Курс сохранен!');
    router.push('/courses');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Создание нового курса
          </h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название курса
                </label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите название курса"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Краткое описание курса"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm font-medium text-gray-700">Добавить элемент:</span>
              
              <div className="flex gap-2">
                <Button
                  variant={selectedNodeType === 'lesson' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedNodeType('lesson')}
                >
                  Урок
                </Button>
                <Button
                  variant={selectedNodeType === 'quiz' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedNodeType('quiz')}
                >
                  Тест
                </Button>
                <Button
                  variant={selectedNodeType === 'assignment' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedNodeType('assignment')}
                >
                  Задание
                </Button>
              </div>
              
              <Button onClick={addNode} className="bg-green-600 hover:bg-green-700 text-white">
                Добавить
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Конструктор курса
              </h2>
              <p className="text-sm text-gray-600">
                Элементы курса: {nodes.length}
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
                    className="absolute bg-white border-2 border-gray-300 rounded-lg p-3 shadow-sm cursor-move"
                    style={{
                      left: node.position.x,
                      top: node.position.y,
                      minWidth: '150px'
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
                    <div className="text-sm font-medium text-gray-900">
                      {node.title}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/courses')}
          >
            Отмена
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline">
              Предварительный просмотр
            </Button>
            <Button 
              onClick={saveCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Сохранить курс
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 