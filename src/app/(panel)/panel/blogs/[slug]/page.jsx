"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/ui/forms/BlogForm.jsx';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelEditBlogPage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.blog) {
            setBlog(data.blog);
          } else {
            showToast('Blog article not found', 'error');
            router.push('/panel/blogs');
          }
        } else {
          showToast('Failed to retrieve blog article', 'error');
          router.push('/panel/blogs');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        showToast('Network error fetching article details', 'error');
        router.push('/panel/blogs');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBlog();
    }
  }, [slug, router, showToast]);

  const handleCancel = () => {
    router.push('/panel/blogs');
  };

  const handleSuccess = () => {
    router.push('/panel/blogs');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="space-y-6">
      <BlogForm
        blog={blog}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
