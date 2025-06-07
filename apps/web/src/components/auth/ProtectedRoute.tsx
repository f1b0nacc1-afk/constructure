'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user && !accessToken) {
      router.push('/auth/login');
    }
  }, [user, accessToken, isLoading, router]);

  // Показываем загрузку пока проверяем аутентификацию
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  // Если пользователь не аутентифицирован, не показываем контент
  if (!user || !accessToken) {
    return null;
  }

  return <>{children}</>;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (user && accessToken) {
      router.push('/dashboard');
    }
  }, [user, accessToken, router]);

  // Если пользователь уже аутентифицирован, перенаправляем
  if (user && accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
} 