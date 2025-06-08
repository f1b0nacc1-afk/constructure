'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { 
  Save, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  PanelLeft, 
  PanelRight,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface ToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleNodePanel: () => void;
  onTogglePropertiesPanel: () => void;
}

export default function Toolbar({
  onSave,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onToggleNodePanel,
  onTogglePropertiesPanel,
}: ToolbarProps) {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
      {/* Navigation */}
      <Link href="/courses">
        <Button variant="ghost" size="sm" className="w-12 h-12 p-0">
          <Home className="w-5 h-5" />
        </Button>
      </Link>
      
      <div className="w-full h-px bg-gray-200 my-2" />

      {/* File Operations */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-12 h-12 p-0"
        onClick={onSave}
        title="Сохранить"
      >
        <Save className="w-5 h-5" />
      </Button>

      <div className="w-full h-px bg-gray-200 my-2" />

      {/* Edit Operations */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-12 h-12 p-0"
        onClick={onUndo}
        title="Отменить"
      >
        <Undo2 className="w-5 h-5" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="w-12 h-12 p-0"
        onClick={onRedo}
        title="Повторить"
      >
        <Redo2 className="w-5 h-5" />
      </Button>

      <div className="w-full h-px bg-gray-200 my-2" />

      {/* View Operations */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-12 h-12 p-0"
        onClick={onZoomIn}
        title="Увеличить"
      >
        <ZoomIn className="w-5 h-5" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="w-12 h-12 p-0"
        onClick={onZoomOut}
        title="Уменьшить"
      >
        <ZoomOut className="w-5 h-5" />
      </Button>

      <div className="w-full h-px bg-gray-200 my-2" />

      {/* Panel Toggles */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-12 h-12 p-0"
        onClick={onToggleNodePanel}
        title="Панель элементов"
      >
        <PanelLeft className="w-5 h-5" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        className="w-12 h-12 p-0"
        onClick={onTogglePropertiesPanel}
        title="Панель свойств"
      >
        <PanelRight className="w-5 h-5" />
      </Button>
    </div>
  );
} 