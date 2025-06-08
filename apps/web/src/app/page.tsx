'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '../components/layout';
import { Button } from '../components/ui';
import { ArrowRightIcon, PlayIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
              🏗️ Constructure
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Современная платформа для создания интерактивных образовательных курсов 
              с drag & drop интерфейсом и множественными режимами визуализации
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/courses/new">
                <Button size="lg">
                  Начать создание
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="secondary" size="lg">
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Мои курсы
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drag & Drop
              </h3>
              <p className="text-gray-600">
                Интуитивное создание курсов перетаскиванием элементов
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">🔄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                4 режима визуализации
              </h3>
              <p className="text-gray-600">
                Дерево, LEGO-блоки, Mind Map, Flowchart
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Совместная работа
              </h3>
              <p className="text-gray-600">
                Редактирование курсов в реальном времени
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-2xl mb-4">📱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Адаптивный дизайн
              </h3>
              <p className="text-gray-600">
                Работает на всех устройствах и экранах
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительные секции */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Начните создавать уже сегодня
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам преподавателей, которые уже используют Constructure 
              для создания увлекательных образовательных курсов
            </p>
            <Link href="/courses/new">
              <Button size="lg">
                Создать первый курс
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 