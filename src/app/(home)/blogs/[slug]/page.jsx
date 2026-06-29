"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function BlogDetailPage({ params }) {
  // Resolve dynamic URL parameters in Next.js 15+
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBlogDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog?slug=${slug}`);
        const data = await res.json();
        
        if (res.ok && data.blog) {
          setBlog(data.blog);
        } else {
          setError(data.error || 'Article details not found');
        }
      } catch (err) {
        console.error(err);
        setError('Network error fetching article specifications');
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadBlogDetails();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-violet-500/15 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-violet-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-sm font-semibold tracking-wide">Retrieving article details...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-lg font-bold text-white">Oops! Fetching Error</h2>
          <p className="text-xs">{error || 'Unable to locate article'}</p>
          <div className="pt-2">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold text-white"
            >
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen py-24 px-6 sm:px-8 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <div>
          <Link
            href="/blogs"
            className="text-xs font-bold hover:text-white transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to articles index
          </Link>
        </div>

        {/* Article Metadata */}
        <div className="space-y-4">
          
          <div className="flex flex-wrap items-center gap-4 text-[9px] font-bold uppercase tracking-widest">
            {blog.created_at && (
              <span>
                Posted: {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            )}
            {blog.category && (
              <span className="border px-2 py-0.5 rounded">
                {blog.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {blog.title}
          </h1>

          {blog.summary && (
            <p className="text-xs sm:text-sm leading-relaxed italic border-l-2 border-violet-500/20 pl-4 py-1">
              {blog.summary}
            </p>
          )}
        </div>

        {/* Cover Photo */}
        {blog.image && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border shadow-2xl">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Rich HTML body contents */}
        <div className="prose prose-invert prose-sm max-w-none prose-neutral prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-400 hover:prose-a:text-violet-300 pt-4">
          <div
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="text-xs sm:text-sm space-y-4 whitespace-normal"
          />
        </div>

      </div>
    </article>
  );
}
