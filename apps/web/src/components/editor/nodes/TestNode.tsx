'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { HelpCircle, Hash } from 'lucide-react';

export function TestNode({ data, selected }: NodeProps) {
  return (
    <div className={`
      bg-white border-2 rounded-lg shadow-sm min-w-[200px] p-4
      ${selected ? 'border-amber-500 shadow-lg' : 'border-amber-200'}
      hover:shadow-md transition-all duration-200
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-white"
      />
      
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
            {data.label}
          </h3>
          
          {data.description && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {data.description}
            </p>
          )}
          
          {data.questions && (
            <div className="flex items-center text-xs text-gray-500">
              <Hash className="w-3 h-3 mr-1" />
              {data.questions} вопросов
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-amber-500 !border-2 !border-white"
      />
    </div>
  );
} 