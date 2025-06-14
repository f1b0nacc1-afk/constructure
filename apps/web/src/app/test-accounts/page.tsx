'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui';

interface TestAccount {
  role: string;
  email: string;
  password: string;
  name: string;
  description: string;
}

const testAccounts: TestAccount[] = [
  {
    role: 'Администратор',
    email: 'admin@constructure.com',
    password: 'admin123456',
    name: 'Админ Системы',
    description: 'Полный доступ ко всем функциям системы'
  },
  {
    role: 'Преподаватель',
    email: 'teacher@example.com', 
    password: 'teacher123',
    name: 'Анна Преподаватель',
    description: 'Создание и управление курсами'
  },
  {
    role: 'Студент',
    email: 'student@example.com',
    password: 'student123', 
    name: 'Михаил Студент',
    description: 'Прохождение курсов и тестов'
  },
  {
    role: 'Тестовый пользователь',
    email: 'test@example.com',
    password: 'password123',
    name: 'Тест Пользователь', 
    description: 'Общий тестовый аккаунт'
  }
];

export default function TestAccountsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleQuickLogin = async (account: TestAccount) => {
    setIsLoading(account.email);
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Сохраняем токены в localStorage
        localStorage.setItem('accessToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Перенаправляем на главную страницу
        router.push('/');
        window.location.reload();
      } else {
        alert('Ошибка входа: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Ошибка соединения с сервером');
    } finally {
      setIsLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Уведомление о копировании можно добавить позже
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Тестовые аккаунты
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Используйте готовые тестовые аккаунты для проверки функциональности приложения. 
            Все аккаунты уже настроены и готовы к использованию.
          </p>
        </div>

        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Информация о системе
          </h2>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>API URL:</strong> http://localhost:3001</p>
            <p><strong>Фронтенд URL:</strong> http://localhost:3000</p>
            <p><strong>База данных:</strong> PostgreSQL (синхронизирована)</p>
            <p><strong>Статус:</strong> <span className="text-green-600 font-medium">✓ Все сервисы запущены</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testAccounts.map((account, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {account.role}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {account.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Тестовый
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                {account.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-gray-900">{account.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(account.email)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Копировать
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Пароль</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">{account.password}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(account.password)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Копировать
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleQuickLogin(account)}
                  disabled={isLoading === account.email}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading === account.email ? 'Входим...' : 'Войти быстро'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    copyToClipboard(`${account.email}\n${account.password}`);
                    router.push('/auth/login');
                  }}
                  className="w-full"
                >
                  Скопировать и перейти к входу
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            ⚠️ Важные замечания
          </h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Все тестовые аккаунты используют простые пароли для удобства тестирования</li>
            <li>• В продакшене обязательно используйте сложные пароли</li>
            <li>• API работает на порту 3001, фронтенд на порту 3000</li>
            <li>• При изменении кода фронтенда может потребоваться перезагрузка страницы</li>
            <li>• Все данные сохраняются в базе данных PostgreSQL</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 