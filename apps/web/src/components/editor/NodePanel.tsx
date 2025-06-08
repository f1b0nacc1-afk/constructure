'use client';

import React from 'react';
import { BookOpen, FileText, HelpCircle, Folder } from 'lucide-react';

interface NodePanelProps {
  onAddNode: (type: string, position: { x: number; y: number }) => void;
}

interface NodeTypeProps {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  onDoubleClick: () => void;
}

function NodeType({ type, label, icon, description, color, onDoubleClick }: NodeTypeProps) {
  return (
    <div
      className="p-4 bg-white border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md border-l-4"
      style={{ borderLeftColor: color }}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{label}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function NodePanel({ onAddNode }: NodePanelProps) {
  const nodeTypes = [
    {
      type: 'module',
      label: 'Модуль',
      icon: <Folder className="w-5 h-5" />,
      description: 'Группировка уроков',
      color: '#3b82f6'
    },
    {
      type: 'lesson',
      label: 'Урок',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Обучающий материал',
      color: '#10b981'
    },
    {
      type: 'test',
      label: 'Тест',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Проверка знаний',
      color: '#f59e0b'
    },
    {
      type: 'content',
      label: 'Контент',
      icon: <FileText className="w-5 h-5" />,
      description: 'Текстовый блок',
      color: '#8b5cf6'
    }
  ];

  const handleDoubleClick = (type: string) => {
    // При двойном клике добавляем узел в центр
    onAddNode(type, { x: 400, y: 300 });
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Элементы курса
        </h2>
        <p className="text-sm text-gray-600">
          Дважды кликните на элемент для добавления на холст
        </p>
      </div>

      <div className="space-y-3">
        {nodeTypes.map((nodeType) => (
          <NodeType
            key={nodeType.type}
            {...nodeType}
            onDoubleClick={() => handleDoubleClick(nodeType.type)}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Подсказка</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Дважды кликните для добавления элемента</li>
          <li>• Соединяйте элементы линиями</li>
          <li>• Кликните для выбора и редактирования</li>
          <li>• Перетаскивайте элементы для изменения позиции</li>
        </ul>
      </div>
    </div>
  );
} 