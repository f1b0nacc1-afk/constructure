'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Toolbar from './Toolbar';
import NodePanel from './NodePanel';
import PropertiesPanel from './PropertiesPanel';
import { LessonNode } from './nodes/LessonNode';
import { ModuleNode } from './nodes/ModuleNode';
import { TestNode } from './nodes/TestNode';

const nodeTypes = {
  lesson: LessonNode,
  module: ModuleNode,
  test: TestNode,
};

interface CourseEditorProps {
  courseId: string;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'module',
    position: { x: 250, y: 25 },
    data: { 
      label: 'Введение в курс',
      description: 'Основные понятия и обзор курса',
      duration: 30
    },
  },
  {
    id: '2',
    type: 'lesson',
    position: { x: 100, y: 125 },
    data: { 
      label: 'Урок 1: Основы',
      description: 'Первый урок курса',
      duration: 15
    },
  },
  {
    id: '3',
    type: 'lesson',
    position: { x: 400, y: 125 },
    data: { 
      label: 'Урок 2: Практика',
      description: 'Практические упражнения',
      duration: 20
    },
  },
  {
    id: '4',
    type: 'test',
    position: { x: 250, y: 250 },
    data: { 
      label: 'Тест по модулю',
      description: 'Проверка знаний',
      questions: 5
    },
  },
];

const initialEdges: Edge[] = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2',
    type: 'smoothstep',
    animated: true
  },
  { 
    id: 'e1-3', 
    source: '1', 
    target: '3',
    type: 'smoothstep',
    animated: true
  },
  { 
    id: 'e2-4', 
    source: '2', 
    target: '4',
    type: 'smoothstep'
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4',
    type: 'smoothstep'
  },
];

export default function CourseEditor({ courseId }: CourseEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isNodePanelOpen, setIsNodePanelOpen] = useState(true);
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position,
      data: {
        label: `Новый ${type === 'lesson' ? 'урок' : type === 'module' ? 'модуль' : 'тест'}`,
        description: 'Описание элемента',
        ...(type === 'test' ? { questions: 1 } : { duration: 10 }),
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [setNodes, setEdges, selectedNode]);

  return (
    <div className="w-full h-full flex">
      {/* Toolbar */}
      <Toolbar 
        onSave={() => console.log('Сохранение курса...')}
        onUndo={() => console.log('Отмена...')}
        onRedo={() => console.log('Повтор...')}
        onZoomIn={() => console.log('Увеличить...')}
        onZoomOut={() => console.log('Уменьшить...')}
        onToggleNodePanel={() => setIsNodePanelOpen(!isNodePanelOpen)}
        onTogglePropertiesPanel={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
      />

      {/* Node Panel */}
      {isNodePanelOpen && (
        <NodePanel onAddNode={addNode} />
      )}

      {/* Main Editor Area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Controls position="bottom-left" />
          <MiniMap 
            position="bottom-right"
            nodeColor={(node) => {
              switch (node.type) {
                case 'module': return '#3b82f6';
                case 'lesson': return '#10b981';
                case 'test': return '#f59e0b';
                default: return '#6b7280';
              }
            }}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#e5e7eb"
          />
        </ReactFlow>
      </div>

      {/* Properties Panel */}
      {isPropertiesPanelOpen && (
        <PropertiesPanel 
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
          onDeleteNode={deleteNode}
        />
      )}
    </div>
  );
} 