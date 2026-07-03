"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';

export default function LatestBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          // Filter to published blogs
          const list = (data.blogs || []).filter(b => b.is_published);
          setBlogs(list.slice(0, 3)); // show top 3 latest blogs
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-8 border-t">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-6 w-36 bg-slate-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
            <div className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
            <div className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) return null;

  return (
    <section className="py-20 px-6 sm:px-8 border-t bg-slate-50/10">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-widest text-violet-500 uppercase">My Writing</span>
            <h2 className="text-3xl font-black text-slate-900">Latest Articles</h2>
          </div>
          <Link
            href="/blogs"
            className="text-xs font-bold text-violet-600 hover:text-violet-500 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            Browse all articles
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

      </div>
    </section>
  );
}
