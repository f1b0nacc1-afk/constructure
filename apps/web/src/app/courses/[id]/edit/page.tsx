'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../../components/ui';

interface CourseNode {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'assignment';
  position: { x: number; y: number };
  description?: string;
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
  nodes: CourseNode[];
  connections: Connection[];
}

// Данные курсов (в реальном приложении будут загружаться с API)
const getCourseData = (courseId: string): Course => {
  // Сначала пытаемся загрузить из localStorage
  try {
    const savedCourse = localStorage.getItem(`course_${courseId}`);
    if (savedCourse) {
      const parsedCourse = JSON.parse(savedCourse);
      console.log('Загружен курс из localStorage:', parsedCourse);
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
      description: 'Основы программирования для начинающих',
      nodes: [
        {
          id: '1',
          title: 'Урок 1: Основы программирования',
          type: 'lesson',
          position: { x: 100, y: 100 },
          description: 'Введение в мир программирования'
        },
        {
          id: '2', 
          title: 'Тест по основам',
          type: 'quiz',
          position: { x: 400, y: 150 },
          description: 'Проверка знаний по основам'
        },
        {
          id: '3',
          title: 'Практическое задание',
          type: 'assignment',
          position: { x: 250, y: 300 },
          description: 'Решение практических задач'
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
      nodes: [
        {
          id: '1',
          title: 'Введение в дизайн',
          type: 'lesson',
          position: { x: 200, y: 100 },
          description: 'Основные принципы дизайна'
        },
        {
          id: '2',
          title: 'Цветовая теория',
          type: 'lesson',
          position: { x: 200, y: 250 },
          description: 'Работа с цветом в дизайне'
        },
        {
          id: '3',
          title: 'Тест по цветам',
          type: 'quiz',
          position: { x: 200, y: 400 },
          description: 'Проверка знаний цветовой теории'
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
      nodes: [
        {
          id: '1',
          title: 'Введение в Agile',
          type: 'lesson',
          position: { x: 100, y: 100 },
          description: 'Основы гибкой методологии разработки'
        },
        {
          id: '2',
          title: 'Scrum фреймворк',
          type: 'lesson',
          position: { x: 300, y: 100 },
          description: 'Изучение Scrum процессов'
        },
        {
          id: '3',
          title: 'Kanban доска',
          type: 'lesson',
          position: { x: 500, y: 100 },
          description: 'Работа с Kanban методологией'
        },
        {
          id: '4',
          title: 'Тест по Agile',
          type: 'quiz',
          position: { x: 200, y: 250 },
          description: 'Проверка знаний Agile методологии'
        },
        {
          id: '5',
          title: 'Практическое задание: Планирование спринта',
          type: 'assignment',
          position: { x: 400, y: 250 },
          description: 'Создайте план спринта для проекта'
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
    title: `Новый курс ${courseId}`,
    description: 'Описание нового курса',
    nodes: [],
    connections: []
  };
};

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [nodes, setNodes] = useState<CourseNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Загружаем данные курса при изменении ID
  useEffect(() => {
    const courseData = getCourseData(params.id as string);
    setCourse(courseData);
    setNodes(courseData.nodes);
    setConnections(courseData.connections);
  }, [params.id]);

  // Обработка зума колесиком мыши
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.3, Math.min(2, zoom + delta));
    setZoom(newZoom);
    
    // Автоматически расширяем канвас при отдалении
    if (newZoom < 1) {
      const scaleFactor = 1 / newZoom;
      setCanvasSize({
        width: Math.max(1200, 1200 * scaleFactor),
        height: Math.max(800, 800 * scaleFactor)
      });
    } else {
      setCanvasSize({ width: 1200, height: 800 });
    }
  }, [zoom]);

  // Обновляем размер канваса при изменении окна
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const baseWidth = Math.max(1200, rect.width);
        const baseHeight = Math.max(800, rect.height);
        
        // Учитываем зум при расчете размера
        if (zoom < 1) {
          const scaleFactor = 1 / zoom;
          setCanvasSize({ 
            width: baseWidth * scaleFactor, 
            height: baseHeight * scaleFactor 
          });
        } else {
          setCanvasSize({ width: baseWidth, height: baseHeight });
        }
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [zoom]);

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-500 border-blue-600';
      case 'quiz': return 'bg-yellow-500 border-yellow-600';
      case 'assignment': return 'bg-purple-500 border-purple-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'quiz': return '❓';
      case 'assignment': return '📝';
      default: return '📄';
    }
  };

  const addNode = (type: 'lesson' | 'quiz' | 'assignment') => {
    const newNode: CourseNode = {
      id: `node-${Date.now()}`,
      title: `Новый ${type === 'lesson' ? 'урок' : type === 'quiz' ? 'тест' : 'задание'}`,
      type,
      position: { 
        x: Math.random() * (canvasSize.width - 200) + 100, 
        y: Math.random() * (canvasSize.height - 200) + 100 
      },
      description: `Описание для нового ${type === 'lesson' ? 'урока' : type === 'quiz' ? 'теста' : 'задания'}`
    };
    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setConnections(connections.filter(conn => conn.from !== id && conn.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const updateNode = (id: string, updates: Partial<CourseNode>) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, ...updates } : node
    ));
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (isConnecting) {
      if (!connectionStart) {
        setConnectionStart(nodeId);
      } else if (connectionStart !== nodeId) {
        // Создаем новое соединение
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          from: connectionStart,
          to: nodeId
        };
        setConnections([...connections, newConnection]);
        setConnectionStart(null);
        setIsConnecting(false);
      }
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - node.position.x,
      y: (e.clientY - rect.top) / zoom - node.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(canvasSize.width - 200, (e.clientX - rect.left) / zoom - dragOffset.x));
    const newY = Math.max(0, Math.min(canvasSize.height - 120, (e.clientY - rect.top) / zoom - dragOffset.y));

    updateNode(draggedNode, { position: { x: newX, y: newY } });
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const toggleConnectionMode = () => {
    setIsConnecting(!isConnecting);
    setConnectionStart(null);
  };

  const deleteConnection = (connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnections(connections.filter(conn => conn.id !== connectionId));
  };

  const saveCourse = async () => {
    if (!course) return;
    
    const updatedCourse = {
      ...course,
      nodes: nodes,
      connections: connections
    };
    
    // Имитируем сохранение в localStorage для демонстрации
    try {
      localStorage.setItem(`course_${course.id}`, JSON.stringify(updatedCourse));
      console.log('Курс сохранен:', updatedCourse);
      alert(`Курс "${course.title}" успешно сохранен!\n\nЭлементов: ${nodes.length}\nСоединений: ${connections.length}`);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении курса');
    }
  };

  const renderConnections = () => {
    return connections.map(connection => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return null;

      const fromX = fromNode.position.x + 100; // центр блока
      const fromY = fromNode.position.y + 60;
      const toX = toNode.position.x + 100;
      const toY = toNode.position.y + 60;

      return (
        <g key={connection.id}>
          <line
            x1={fromX}
            y1={fromY}
            x2={toX}
            y2={toY}
            stroke="#6b7280"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          <circle
            cx={(fromX + toX) / 2}
            cy={(fromY + toY) / 2}
            r="8"
            fill="#ef4444"
            className="cursor-pointer hover:fill-red-600"
            onClick={(e) => deleteConnection(connection.id, e)}
            style={{ pointerEvents: 'all' }}
          />
          <text
            x={(fromX + toX) / 2}
            y={(fromY + toY) / 2 + 3}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            className="pointer-events-none select-none"
          >
            ×
          </text>
        </g>
      );
    });
  };

  const renderGrid = () => {
    const gridLines = [];
    const gridSize = 20;
    
    // Вертикальные линии
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasSize.height}
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      );
    }
    
    // Горизонтальные линии
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasSize.width}
          y2={y}
          stroke="#e5e7eb"
          strokeWidth="0.5"
        />
      );
    }
    
    return gridLines;
  };

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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Редактирование: {course.title}
            </h1>
            <p className="text-gray-600 mt-1">
              Курс ID: {params.id} | Элементов: {nodes.length} | Соединений: {connections.length} | Зум: {Math.round(zoom * 100)}%
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/courses')}
            >
              ← Назад
            </Button>
            <Button 
              onClick={saveCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              💾 Сохранить
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm font-medium text-gray-700">Инструменты:</span>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('lesson')}
                  className="flex items-center gap-2"
                >
                  📚 Урок
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('quiz')}
                  className="flex items-center gap-2"
                >
                  ❓ Тест
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('assignment')}
                  className="flex items-center gap-2"
                >
                  📝 Задание
                </Button>
              </div>

              <div className="border-l border-gray-300 pl-4">
                <Button
                  variant={isConnecting ? "primary" : "outline"}
                  size="sm"
                  onClick={toggleConnectionMode}
                  className={`flex items-center gap-2 ${isConnecting ? 'bg-green-600 text-white' : ''}`}
                >
                  🔗 {isConnecting ? 'Соединение активно' : 'Соединить блоки'}
                </Button>
              </div>

              <div className="border-l border-gray-300 pl-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                  >
                    🔍-
                  </Button>
                  <span className="text-sm text-gray-600 min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  >
                    🔍+
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(1)}
                  >
                    100%
                  </Button>
                </div>
              </div>

              {isConnecting && (
                <div className="text-sm text-green-600 font-medium">
                  {connectionStart ? 'Выберите целевой блок' : 'Выберите начальный блок'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Структура курса
            </h2>
            <p className="text-sm text-gray-600">
              Перетаскивайте блоки для изменения структуры. Используйте колесико мыши для зума. Кликайте по красному кружку для удаления связей.
            </p>
          </div>
          
          <div 
            ref={canvasRef}
            className="relative bg-gray-50 overflow-hidden"
            style={{ height: '600px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {/* SVG для сетки и соединений */}
            <svg 
              className="absolute inset-0"
              width={canvasSize.width}
              height={canvasSize.height}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: '0 0'
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                  />
                </marker>
              </defs>
              
              {/* Координатная сетка */}
              {renderGrid()}
              
              {/* Соединения */}
              {renderConnections()}
            </svg>

            {/* Блоки курса */}
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: '0 0'
              }}
            >
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute cursor-move select-none transition-shadow duration-200 ${
                    selectedNode === node.id ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-sm hover:shadow-md'
                  } ${isConnecting ? 'cursor-pointer' : ''}`}
                  style={{
                    left: node.position.x,
                    top: node.position.y,
                    width: '200px',
                    zIndex: draggedNode === node.id ? 1000 : 1
                  }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                >
                  <div className={`bg-white border-2 rounded-lg p-3 ${
                    connectionStart === node.id ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium text-white ${getNodeTypeColor(node.type)}`}>
                        {getNodeTypeIcon(node.type)} {node.type === 'lesson' ? 'Урок' : 
                         node.type === 'quiz' ? 'Тест' : 'Задание'}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-red-100"
                      >
                        ×
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={node.title}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateNode(node.id, { title: e.target.value });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-500 rounded px-1 py-1 mb-2"
                    />
                    
                    <textarea
                      value={node.description || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateNode(node.id, { description: e.target.value });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Описание..."
                      className="w-full text-xs text-gray-600 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-blue-500 rounded px-1 py-1 resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Подсказка для пустого канваса */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-lg mb-2">Курс пуст</div>
                  <div className="text-gray-500 text-sm">
                    Добавьте элементы с помощью кнопок выше
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Info */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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