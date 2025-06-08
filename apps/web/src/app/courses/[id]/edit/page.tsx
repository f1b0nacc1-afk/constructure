'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import CourseEditor from '@/components/editor/CourseEditor';

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.id as string;

  return (
    <div className="h-screen bg-gray-50">
      <CourseEditor courseId={courseId} />
    </div>
  );
} 