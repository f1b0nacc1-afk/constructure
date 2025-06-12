'use client';

import Link from 'next/link';
import { Button } from '../components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Конструктор образовательных курсов
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Создавайте интерактивные курсы с помощью современного визуального редактора. 
            Простой drag & drop интерфейс для профессиональных результатов.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/courses/new">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Создать курс
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                Посмотреть примеры
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Основные возможности
          </h2>
          <p className="text-lg text-gray-600">
            Все необходимое для создания качественных образовательных курсов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Визуальный редактор
            </h3>
            <p className="text-gray-600">
              Создавайте курсы с помощью интуитивного drag & drop интерфейса
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Режимы отображения
            </h3>
            <p className="text-gray-600">
              Дерево, блоки, Mind Map - выберите подходящий формат
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Быстрое создание
            </h3>
            <p className="text-gray-600">
              От идеи до готового курса за несколько минут
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы начать?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Создайте свой первый курс прямо сейчас
          </p>
          <Link href="/courses/new">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg">
              Начать создание
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 