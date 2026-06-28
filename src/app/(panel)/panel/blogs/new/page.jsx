"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/ui/forms/BlogForm.jsx';

export default function PanelNewBlogPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/panel/blogs');
  };

  const handleSuccess = () => {
    router.push('/panel/blogs');
  };

  return (
    <div className="space-y-6">
      <BlogForm
        blog={null}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
