'use client';

import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Button, Input } from '@/components/ui';
import { Trash2, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, newData: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export default function PropertiesPanel({ 
  selectedNode, 
  onUpdateNode, 
  onDeleteNode 
}: PropertiesPanelProps) {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    duration: '',
    questions: '',
  });

  useEffect(() => {
    if (selectedNode) {
      setFormData({
        label: selectedNode.data.label || '',
        description: selectedNode.data.description || '',
        duration: selectedNode.data.duration?.toString() || '',
        questions: selectedNode.data.questions?.toString() || '',
      });
    }
  }, [selectedNode]);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (selectedNode) {
      const updateData: any = {
        [field]: field === 'duration' || field === 'questions' 
          ? parseInt(value) || 0 
          : value
      };
      onUpdateNode(selectedNode.id, updateData);
    }
  };

  const handleDelete = () => {
    if (selectedNode && window.confirm('Удалить этот элемент?')) {
      onDeleteNode(selectedNode.id);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <div className="text-center py-8">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Свойства элемента</h3>
          <p className="text-sm text-gray-600">
            Выберите элемент на холсте для редактирования его свойств
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Свойства элемента
        </h2>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: selectedNode.type === 'module' ? '#3b82f6' :
                             selectedNode.type === 'lesson' ? '#10b981' :
                             selectedNode.type === 'test' ? '#f59e0b' : '#8b5cf6'
            }}
          />
          <span className="text-sm font-medium text-gray-700 capitalize">
            {selectedNode.type === 'module' ? 'Модуль' :
             selectedNode.type === 'lesson' ? 'Урок' :
             selectedNode.type === 'test' ? 'Тест' : 'Контент'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название
          </label>
          <Input
            value={formData.label}
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Введите название"
            className="w-full"
          />
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Введите описание"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Продолжительность (для уроков и модулей) */}
        {(selectedNode.type === 'lesson' || selectedNode.type === 'module') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Продолжительность (мин)
            </label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="30"
              min="1"
              className="w-full"
            />
          </div>
        )}

        {/* Количество вопросов (для тестов) */}
        {selectedNode.type === 'test' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Количество вопросов
            </label>
            <Input
              type="number"
              value={formData.questions}
              onChange={(e) => handleInputChange('questions', e.target.value)}
              placeholder="5"
              min="1"
              className="w-full"
            />
          </div>
        )}

        {/* Метаданные */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Метаданные</h3>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>ID:</span>
              <span className="font-mono">{selectedNode.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Тип:</span>
              <span>{selectedNode.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Позиция:</span>
              <span>
                x: {Math.round(selectedNode.position.x)}, 
                y: {Math.round(selectedNode.position.y)}
              </span>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Удалить элемент
          </Button>
        </div>
      </div>
    </div>
  );
} 